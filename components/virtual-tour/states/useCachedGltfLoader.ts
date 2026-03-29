import { LoadingManager, Mesh, MeshStandardMaterial, type Object3D } from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

type LoadCachedGltfOptions = {
  timeoutMs?: number
  maxRetries?: number
}

type RequiredLoadOptions = {
  timeoutMs: number
  maxRetries: number
}

type RetryableError = Error & {
  retryable?: boolean
}

const MODEL_CACHE_NAME = 'virtual-tour-gltf-cache-v1'
const MODEL_CACHE_NAME_PREFIX = 'virtual-tour-gltf-cache-'
const DEFAULT_TIMEOUT_MS = 15000
const DEFAULT_MAX_RETRIES = 3
const RETRY_BACKOFF_BASE_MS = 400

const inFlightLoads = new Map<string, Promise<GLTF>>()
const parsedModelCache = new Map<string, GLTF>()
let staleCacheCleanupDone = false

export const VIRTUAL_TOUR_TEXTURE_MODEL_PATHS = {
  paving: '/3dModels/texture/seamless_paving_stone_texture.glb',
  wall: '/3dModels/texture/red_bricks_wall.glb',
} as const

function toRetryableError(error: unknown): RetryableError {
  if (error instanceof Error) {
    return error as RetryableError
  }

  const converted = new Error(String(error)) as RetryableError
  converted.retryable = true

  return converted
}

function createRetryableError(message: string, retryable: boolean): RetryableError {
  const error = new Error(message) as RetryableError
  error.retryable = retryable

  return error
}

function shouldRetryFromStatus(status: number): boolean {
  return status === 408 || status === 429 || status >= 500
}

function isLikelyRetryableError(error: RetryableError): boolean {
  if (typeof error.retryable === 'boolean') {
    return error.retryable
  }

  if (error.name === 'AbortError' || error.name === 'TypeError') {
    return true
  }

  return true
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function getResourcePath(resolvedUrl: string): string {
  const lastSlashIndex = resolvedUrl.lastIndexOf('/')
  if (lastSlashIndex === -1) {
    return resolvedUrl
  }

  return resolvedUrl.slice(0, lastSlashIndex + 1)
}

export function resolveVirtualTourAssetUrl(assetPath: string): string {
  const normalizedPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath
  const baseOrigin = typeof window === 'undefined' ? 'http://localhost' : window.location.origin
  const baseUrl = new URL(import.meta.env.BASE_URL, baseOrigin)

  return new URL(normalizedPath, baseUrl).toString()
}

async function cleanupStaleCaches(): Promise<void> {
  if (staleCacheCleanupDone || typeof window === 'undefined' || !('caches' in window)) {
    return
  }

  staleCacheCleanupDone = true

  const cacheKeys = await window.caches.keys()
  const staleKeys = cacheKeys.filter((key) => key.startsWith(MODEL_CACHE_NAME_PREFIX) && key !== MODEL_CACHE_NAME)

  await Promise.all(staleKeys.map((key) => window.caches.delete(key)))
}

async function openModelCache(): Promise<Cache | null> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return null
  }

  await cleanupStaleCaches()
  return window.caches.open(MODEL_CACHE_NAME)
}

async function fetchWithTimeout(request: Request, timeoutMs: number): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
  }, timeoutMs)

  try {
    return await fetch(request, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-store',
    })
  } finally {
    clearTimeout(timeoutId)
  }
}

async function parseGltfFromResponse(response: Response, resolvedUrl: string): Promise<GLTF> {
  const modelBuffer = await response.arrayBuffer()
  const loader = new GLTFLoader(new LoadingManager())

  return new Promise<GLTF>((resolve, reject) => {
    loader.parse(
      modelBuffer,
      getResourcePath(resolvedUrl),
      (gltf) => {
        resolve(gltf)
      },
      (error) => {
        reject(toRetryableError(error))
      },
    )
  })
}

async function loadGltfWithNetworkFallback(
  request: Request,
  resolvedUrl: string,
  cacheStorage: Cache | null,
  options: RequiredLoadOptions,
): Promise<GLTF> {
  for (let attempt = 1; attempt <= options.maxRetries; attempt += 1) {
    try {
      const response = await fetchWithTimeout(request, options.timeoutMs)

      if (!response.ok) {
        throw createRetryableError(
          `Failed to fetch ${resolvedUrl}. HTTP ${response.status}.`,
          shouldRetryFromStatus(response.status),
        )
      }

      if (cacheStorage) {
        await cacheStorage.put(request, response.clone())
      }

      return await parseGltfFromResponse(response, resolvedUrl)
    } catch (error) {
      const normalizedError = toRetryableError(error)
      const canRetry = isLikelyRetryableError(normalizedError)

      if (!canRetry || attempt >= options.maxRetries) {
        throw normalizedError
      }

      await wait(RETRY_BACKOFF_BASE_MS * attempt)
    }
  }

  throw createRetryableError(`Failed to load model ${resolvedUrl}.`, false)
}

async function loadCachedGltfModelInternal(resolvedUrl: string, options: RequiredLoadOptions): Promise<GLTF> {
  const request = new Request(resolvedUrl, { method: 'GET' })
  const cacheStorage = await openModelCache()

  if (cacheStorage) {
    const cachedResponse = await cacheStorage.match(request)

    if (cachedResponse) {
      try {
        return await parseGltfFromResponse(cachedResponse, resolvedUrl)
      } catch {
        await cacheStorage.delete(request)
      }
    }
  }

  return loadGltfWithNetworkFallback(request, resolvedUrl, cacheStorage, options)
}

export async function loadCachedGltfModel(assetPath: string, options: LoadCachedGltfOptions = {}): Promise<GLTF> {
  const resolvedUrl = resolveVirtualTourAssetUrl(assetPath)
  const memoryCachedModel = parsedModelCache.get(resolvedUrl)

  if (memoryCachedModel) {
    return memoryCachedModel
  }

  const inFlightLoad = inFlightLoads.get(resolvedUrl)
  if (inFlightLoad) {
    return inFlightLoad
  }

  const resolvedOptions: RequiredLoadOptions = {
    timeoutMs: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    maxRetries: options.maxRetries ?? DEFAULT_MAX_RETRIES,
  }

  const loadPromise = loadCachedGltfModelInternal(resolvedUrl, resolvedOptions)
    .then((gltf) => {
      parsedModelCache.set(resolvedUrl, gltf)
      return gltf
    })
    .finally(() => {
      inFlightLoads.delete(resolvedUrl)
    })

  inFlightLoads.set(resolvedUrl, loadPromise)
  return loadPromise
}

export async function preloadHighResolutionTextureModels(): Promise<void> {
  await Promise.all([
    loadCachedGltfModel(VIRTUAL_TOUR_TEXTURE_MODEL_PATHS.paving),
    loadCachedGltfModel(VIRTUAL_TOUR_TEXTURE_MODEL_PATHS.wall),
  ])
}

export function extractFirstMeshStandardMaterial(scene: Object3D): MeshStandardMaterial | null {
  let material: MeshStandardMaterial | null = null

  scene.traverse((child) => {
    if (material) return

    const mesh = child as Mesh
    if (!mesh.isMesh) return

    const materialCandidate = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
    if (!materialCandidate) return

    if ((materialCandidate as MeshStandardMaterial).isMeshStandardMaterial) {
      material = materialCandidate as MeshStandardMaterial
    }
  })

  return material
}
