import { shallowRef } from 'vue'
import RAPIER from '@dimforge/rapier3d-compat'
import type { Mesh, Object3D, PerspectiveCamera, Quaternion } from 'three'
import { Vector3 } from 'three'
import playerConfig from '@virtual-tour/config/playerConfig'

const rapierModule = shallowRef<typeof RAPIER | null>(null)
const physicsWorld = shallowRef<RAPIER.World | null>(null)
const playerBody = shallowRef<RAPIER.RigidBody | null>(null)

const pendingSolidColliders = new Set<Object3D>()
const solidColliderHandles = new Map<Object3D, number[]>()

const tempForward = new Vector3()
const tempRight = new Vector3()
const tempSize = new Vector3()
const tempCenter = new Vector3()
const tempScale = new Vector3()

let initPromise: Promise<void> | null = null

function rapierQuaternion(quaternion: Quaternion) {
  return {
    x: quaternion.x,
    y: quaternion.y,
    z: quaternion.z,
    w: quaternion.w,
  }
}

function createPlayerBody() {
  if (!physicsWorld.value || playerBody.value) return

  const bodyDescription = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(0, playerConfig.yPosition, 0)
    .lockRotations()
    .setCanSleep(false)
    .setLinearDamping(playerConfig.linearDamping)

  const body = physicsWorld.value.createRigidBody(bodyDescription)
  const colliderDescription = RAPIER.ColliderDesc.capsule(
    playerConfig.playerCapsuleHalfHeight,
    playerConfig.playerCapsuleRadius,
  ).setFriction(0.1)

  physicsWorld.value.createCollider(colliderDescription, body)
  playerBody.value = body
}

function createStaticColliderFromMesh(mesh: Mesh): number | null {
  if (!physicsWorld.value || !rapierModule.value || !mesh.geometry) return null

  if (!mesh.geometry.boundingBox) {
    mesh.geometry.computeBoundingBox()
  }

  const boundingBox = mesh.geometry.boundingBox
  if (!boundingBox) return null

  boundingBox.getSize(tempSize)
  mesh.getWorldScale(tempScale)

  const sizeX = Math.max(Math.abs(tempSize.x * tempScale.x), playerConfig.staticColliderMinThickness)
  const sizeY = Math.max(Math.abs(tempSize.y * tempScale.y), playerConfig.staticColliderMinThickness)
  const sizeZ = Math.max(Math.abs(tempSize.z * tempScale.z), playerConfig.staticColliderMinThickness)

  boundingBox.getCenter(tempCenter)
  const center = mesh.localToWorld(tempCenter.clone())
  const quaternion = mesh.getWorldQuaternion(mesh.quaternion.clone())

  const colliderDescription = rapierModule.value.ColliderDesc.cuboid(
    sizeX * 0.5,
    sizeY * 0.5,
    sizeZ * 0.5,
  )
    .setTranslation(center.x, center.y, center.z)
    .setRotation(rapierQuaternion(quaternion))

  const collider = physicsWorld.value.createCollider(colliderDescription)
  return collider.handle
}

function registerSolidColliderImmediate(object: Object3D) {
  if (!physicsWorld.value) return

  const handles: number[] = []
  object.updateWorldMatrix(true, true)

  object.traverse((child) => {
    const mesh = child as Mesh
    if (!mesh.isMesh) return

    const colliderHandle = createStaticColliderFromMesh(mesh)
    if (colliderHandle !== null) {
      handles.push(colliderHandle)
    }
  })

  if (handles.length > 0) {
    solidColliderHandles.set(object, handles)
  }
}

function processPendingSolids() {
  if (!physicsWorld.value || pendingSolidColliders.size === 0) return

  pendingSolidColliders.forEach((object) => {
    registerSolidColliderImmediate(object)
  })

  pendingSolidColliders.clear()
}

export async function ensurePhysicsWorld() {
  if (physicsWorld.value) return

  if (!initPromise) {
    initPromise = (async () => {
      await RAPIER.init()
      rapierModule.value = RAPIER
      physicsWorld.value = new RAPIER.World({ x: 0, y: 0, z: 0 })
      createPlayerBody()
      processPendingSolids()
    })()
  }

  await initPromise
}

export function registerSolidCollider(object: Object3D) {
  if (!physicsWorld.value) {
    pendingSolidColliders.add(object)
    return
  }

  registerSolidColliderImmediate(object)
}

export function refreshSolidCollider(object: Object3D) {
  unregisterSolidCollider(object)
  registerSolidCollider(object)
}

export function unregisterSolidCollider(object: Object3D) {
  pendingSolidColliders.delete(object)

  if (!physicsWorld.value) {
    solidColliderHandles.delete(object)
    return
  }

  const handles = solidColliderHandles.get(object)
  if (!handles) return

  handles.forEach((handle) => {
    const collider = physicsWorld.value?.getCollider(handle)
    if (collider && physicsWorld.value) {
      physicsWorld.value.removeCollider(collider, true)
    }
  })

  solidColliderHandles.delete(object)
}

export function setPlayerPlanarVelocity(velocityX: number, velocityZ: number) {
  if (!playerBody.value) return

  const currentVelocity = playerBody.value.linvel()
  playerBody.value.setLinvel({ x: velocityX, y: currentVelocity.y, z: velocityZ }, true)
}

export function computePlanarVelocityFromCamera(
  camera: PerspectiveCamera,
  localVelocityX: number,
  localVelocityZ: number,
) {
  camera.getWorldDirection(tempForward)
  tempForward.y = 0

  if (tempForward.lengthSq() === 0) {
    return { x: 0, z: 0 }
  }

  tempForward.normalize()
  tempRight.crossVectors(tempForward, camera.up).normalize()

  const worldVelocity = new Vector3()
    .addScaledVector(tempRight, localVelocityX)
    .addScaledVector(tempForward, -localVelocityZ)

  return {
    x: worldVelocity.x,
    z: worldVelocity.z,
  }
}

export function stepPhysicsWorld(delta: number) {
  if (!physicsWorld.value) return

  physicsWorld.value.timestep = Math.min(delta, playerConfig.maxPhysicsDelta)
  physicsWorld.value.step()
}

export function syncCameraToPlayer(camera: PerspectiveCamera) {
  if (!playerBody.value) return

  const translation = playerBody.value.translation()
  camera.position.set(translation.x, playerConfig.yPosition, translation.z)
}

export function teleportPlayer(position: Vector3) {
  if (!playerBody.value) return

  playerBody.value.setTranslation({ x: position.x, y: playerConfig.yPosition, z: position.z }, true)
}

export function disposePhysicsWorld() {
  if (!physicsWorld.value) return

  solidColliderHandles.clear()
  pendingSolidColliders.clear()
  playerBody.value = null

  physicsWorld.value.free()
  physicsWorld.value = null
  rapierModule.value = null
  initPromise = null
}
