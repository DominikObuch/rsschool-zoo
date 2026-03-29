<script setup lang="ts">
import { onBeforeUnmount, shallowRef } from 'vue';
import { DoubleSide, RepeatWrapping, SRGBColorSpace, Texture } from 'three';
import zooConfig from '@virtual-tour/config/zooConfig';
import {
  extractFirstMeshStandardMaterial,
  loadCachedGltfModel,
  VIRTUAL_TOUR_TEXTURE_MODEL_PATHS,
} from '@virtual-tour/states/useCachedGltfLoader';

type GroundTile = {
  position: [number, number, number]
  width: number
  depth: number
}

type TileTextures = {
  map: Texture | null
  normalMap: Texture | null
  roughnessMap: Texture | null
  metalnessMap: Texture | null
}

const TEXTURE_TILE_WORLD_SIZE = 2.2
const GROUND_Y = -0.02
const GROUND_ROTATION: [number, number, number] = [Math.PI / 2, 0, 0]

const worldMinX = -zooConfig.worldHalfWidth
const worldMaxX = zooConfig.worldHalfWidth
const worldMinZ = -zooConfig.worldHalfDepth
const worldMaxZ = zooConfig.worldHalfDepth

const enclosureBounds = [
  zooConfig.penguinEnclousureBounds,
  zooConfig.pandaEnclousureBounds,
  zooConfig.lionEnclousureBounds,
  zooConfig.elephantEnclousureBounds,
]

const leftOuterEdge = Math.min(...enclosureBounds.map((bounds) => bounds.minX))
const rightOuterEdge = Math.max(...enclosureBounds.map((bounds) => bounds.maxX))
const frontOuterEdge = Math.min(...enclosureBounds.map((bounds) => bounds.minZ))
const backOuterEdge = Math.max(...enclosureBounds.map((bounds) => bounds.maxZ))

const leftInnerEdge = Math.max(...enclosureBounds.filter((bounds) => bounds.maxX <= 0).map((bounds) => bounds.maxX))
const rightInnerEdge = Math.min(...enclosureBounds.filter((bounds) => bounds.minX >= 0).map((bounds) => bounds.minX))
const frontInnerEdge = Math.max(...enclosureBounds.filter((bounds) => bounds.maxZ <= 0).map((bounds) => bounds.maxZ))
const backInnerEdge = Math.min(...enclosureBounds.filter((bounds) => bounds.minZ >= 0).map((bounds) => bounds.minZ))

function createGroundTile(minX: number, maxX: number, minZ: number, maxZ: number): GroundTile | null {
  const tileWidth = maxX - minX
  const tileDepth = maxZ - minZ

  if (tileWidth <= 0 || tileDepth <= 0) return null

  return {
    position: [(minX + maxX) / 2, GROUND_Y, (minZ + maxZ) / 2],
    width: tileWidth,
    depth: tileDepth,
  }
}

function isGroundTile(tile: GroundTile | null): tile is GroundTile {
  return tile !== null
}

// Segments cover all walkable zoo floor while leaving 4 enclosure squares empty.
const tiles = [
  createGroundTile(worldMinX, worldMaxX, backOuterEdge, worldMaxZ),
  createGroundTile(worldMinX, worldMaxX, worldMinZ, frontOuterEdge),
  createGroundTile(worldMinX, leftOuterEdge, frontOuterEdge, backOuterEdge),
  createGroundTile(rightOuterEdge, worldMaxX, frontOuterEdge, backOuterEdge),
  createGroundTile(leftInnerEdge, rightInnerEdge, frontOuterEdge, backOuterEdge),
  createGroundTile(leftOuterEdge, leftInnerEdge, frontInnerEdge, backInnerEdge),
  createGroundTile(rightInnerEdge, rightOuterEdge, frontInnerEdge, backInnerEdge),
].filter(isGroundTile)

const tileTextures = shallowRef<TileTextures[]>(
  tiles.map(() => ({
    map: null,
    normalMap: null,
    roughnessMap: null,
    metalnessMap: null,
  })),
)

function cloneTexture(source: Texture | null, repeatX: number, repeatY: number, asColorTexture = false): Texture | null {
  if (!source) return null

  const texture = source.clone()
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  texture.repeat.set(repeatX, repeatY)
  if (asColorTexture) {
    texture.colorSpace = SRGBColorSpace
  }
  texture.needsUpdate = true

  return texture
}

async function loadPavingTextures() {
  try {
    const gltf = await loadCachedGltfModel(VIRTUAL_TOUR_TEXTURE_MODEL_PATHS.paving)
    const sourceMaterial = extractFirstMeshStandardMaterial(gltf.scene)

    if (!sourceMaterial) {
      throw new Error('Paving texture source material was not found in the model.')
    }

    tileTextures.value = tiles.map((tile) => {
      const repeatX = Math.max(tile.width / TEXTURE_TILE_WORLD_SIZE, 1)
      const repeatY = Math.max(tile.depth / TEXTURE_TILE_WORLD_SIZE, 1)

      return {
        map: cloneTexture(sourceMaterial.map ?? null, repeatX, repeatY, true),
        normalMap: cloneTexture(sourceMaterial.normalMap ?? null, repeatX, repeatY),
        roughnessMap: cloneTexture(sourceMaterial.roughnessMap ?? null, repeatX, repeatY),
        metalnessMap: cloneTexture(sourceMaterial.metalnessMap ?? null, repeatX, repeatY),
      }
    })
  } catch (error) {
    console.error('Failed to load paving textures', error)
  }
}

void loadPavingTextures()

onBeforeUnmount(() => {
  tileTextures.value.forEach((textures) => {
    textures.map?.dispose()
    textures.normalMap?.dispose()
    textures.roughnessMap?.dispose()
    textures.metalnessMap?.dispose()
  })
})
</script>

<template>
  <TresGroup>
    <!-- Plane segments keep 4 enclosure areas empty while using paving texture maps from GLB. -->
    <TresMesh
      v-for="(tile, index) in tiles"
      :key="`zoo-ground-${index}`"
      :position="tile.position"
      :rotation="GROUND_ROTATION"
      receive-shadow
    >
      <TresPlaneGeometry :args="[tile.width, tile.depth]" />
      <TresMeshStandardMaterial
        color="#9f9f9f"
        :side="DoubleSide"
        :map="tileTextures[index]?.map || null"
        :normalMap="tileTextures[index]?.normalMap || null"
        :roughnessMap="tileTextures[index]?.roughnessMap || null"
        :metalnessMap="tileTextures[index]?.metalnessMap || null"
      />
    </TresMesh>
  </TresGroup>
</template>
