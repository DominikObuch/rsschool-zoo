<script setup lang="ts">
import { onBeforeUnmount, shallowRef } from 'vue';
import zooConfig from '@virtual-tour/config/zooConfig';
import { Mesh, MeshStandardMaterial, RepeatWrapping, SRGBColorSpace, Texture, type Object3D } from 'three';
import Solid from '@virtual-tour/components/utility/Solid.vue';
import { loadCachedGltfModel, VIRTUAL_TOUR_TEXTURE_MODEL_PATHS } from '@virtual-tour/states/useCachedGltfLoader';
import ZooWallSign from '@virtual-tour/components/zoo/ZooWallSign.vue';

type WallConfig = {
    key: string
    position: [number, number, number]
    rotation: [number, number, number]
    width: number
    height: number
}

type WallTextures = {
    map: Texture | null
    normalMap: Texture | null
    roughnessMap: Texture | null
    metalnessMap: Texture | null
}

type WallTextureMap = Record<string, WallTextures>

const BRICK_TILE_WORLD_SIZE = 2.2

const walls: WallConfig[] = [
    {
        key: 'back-wall',
        position: [0, 0, zooConfig.depth / 2],
        rotation: [Math.PI, 0, 0],
        width: zooConfig.width,
        height: zooConfig.height,
    },
    {
        key: 'front-wall',
        position: [0, 0, -zooConfig.depth / 2],
        rotation: [0, 0, 0],
        width: zooConfig.width,
        height: zooConfig.height,
    },
    {
        key: 'left-wall',
        position: [-zooConfig.width / 2, 0, 0],
        rotation: [0, Math.PI / 2, 0],
        width: zooConfig.width,
        height: zooConfig.height,
    },
    {
        key: 'right-wall',
        position: [zooConfig.width / 2, 0, 0],
        rotation: [0, -Math.PI / 2, 0],
        width: zooConfig.width,
        height: zooConfig.height,
    },
]

function createEmptyWallTextures(): WallTextures {
    return {
        map: null,
        normalMap: null,
        roughnessMap: null,
        metalnessMap: null,
    }
}

function createInitialWallTextureMap(): WallTextureMap {
    return Object.fromEntries(walls.map((wall) => [wall.key, createEmptyWallTextures()])) as WallTextureMap
}

const wallTextures = shallowRef<WallTextureMap>(createInitialWallTextureMap())

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

function buildWallTextures(material: MeshStandardMaterial | null): WallTextureMap {
    if (!material) {
        return createInitialWallTextureMap()
    }

    return Object.fromEntries(
        walls.map((wall) => {
            const repeatX = Math.max(wall.width / BRICK_TILE_WORLD_SIZE, 1)
            const repeatY = Math.max(wall.height / BRICK_TILE_WORLD_SIZE, 1)

            return [
                wall.key,
                {
                    map: cloneTexture(material.map ?? null, repeatX, repeatY, true),
                    normalMap: cloneTexture(material.normalMap ?? null, repeatX, repeatY),
                    roughnessMap: cloneTexture(material.roughnessMap ?? null, repeatX, repeatY),
                    metalnessMap: cloneTexture(material.metalnessMap ?? null, repeatX, repeatY),
                },
            ]
        }),
    ) as WallTextureMap
}

function getSourceMaterial(scene: Object3D): MeshStandardMaterial | null {
    let material: MeshStandardMaterial | null = null

    scene.traverse((child) => {
        if (material) {
            return
        }

        const mesh = child as Mesh
        if (!mesh.isMesh) {
            return
        }

        const materialCandidate = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
        if (materialCandidate && (materialCandidate as MeshStandardMaterial).isMeshStandardMaterial) {
            material = materialCandidate as MeshStandardMaterial
        }
    })

    return material
}

async function loadWallTextures() {
    try {
        const gltf = await loadCachedGltfModel(VIRTUAL_TOUR_TEXTURE_MODEL_PATHS.wall)
        const sourceMaterial = getSourceMaterial(gltf.scene)

        if (!sourceMaterial) {
            console.error('Wall texture source material was not found in the model.')
        }

        wallTextures.value = buildWallTextures(sourceMaterial)
    } catch (error) {
        console.error('Failed to load wall texture model', error)
    }
}

void loadWallTextures()

onBeforeUnmount(() => {
    Object.values(wallTextures.value).forEach((textures) => {
        textures.map?.dispose()
        textures.normalMap?.dispose()
        textures.roughnessMap?.dispose()
        textures.metalnessMap?.dispose()
    })
})
</script>
<template>

        <Solid>
            <TresMesh
                v-for="wall in walls"
                :key="wall.key"
                :position="wall.position"
                :rotation="wall.rotation"
            >
                <TresPlaneGeometry :args="[wall.width, wall.height]" />
                <TresMeshStandardMaterial
                    color="#ffffff"
                    :map="wallTextures[wall.key]?.map || null"
                    :normalMap="wallTextures[wall.key]?.normalMap || null"
                    :roughnessMap="wallTextures[wall.key]?.roughnessMap || null"
                    :metalnessMap="wallTextures[wall.key]?.metalnessMap || null"
                />
            </TresMesh>
        </Solid>
            <ZooWallSign />
</template>