<script setup lang="ts">
import { useLoop } from '@tresjs/core';
import { GLTFModel } from '@tresjs/cientos';
import { shallowRef } from 'vue';
import { Color, MeshPhysicalMaterial, MeshStandardMaterial, type Group } from 'three';
import Solid from '@virtual-tour/components/utility/Solid.vue';

const props = defineProps<{
    position: [number, number, number],
    rotation?: [number, number, number],
}>()

const wrapperRef = shallowRef<Group | null>(null)
const fenceHighlightTint = new Color('#ffffff')
let materialBoostApplied = false

function brightenFenceMaterials(group: Group): boolean {
    let boostedAnyMaterial = false

    group.traverse((child) => {
        const meshCandidate = child as { isMesh?: boolean, material?: unknown }
        if (!meshCandidate.isMesh || !meshCandidate.material) {
            return
        }

        const meshMaterials = Array.isArray(meshCandidate.material)
            ? meshCandidate.material
            : [meshCandidate.material]

        meshMaterials.forEach((materialCandidate) => {
            if (!(materialCandidate instanceof MeshStandardMaterial || materialCandidate instanceof MeshPhysicalMaterial)) {
                return
            }

            if (materialCandidate.userData.fenceBrightnessBoostApplied === true) {
                boostedAnyMaterial = true
                return
            }

            materialCandidate.color.multiplyScalar(1.16)
            materialCandidate.emissive.lerp(fenceHighlightTint, 0.02)
            materialCandidate.emissiveIntensity = Math.max(materialCandidate.emissiveIntensity, 0.18)
            materialCandidate.roughness = Math.max(materialCandidate.roughness * 0.84, 0.2)
            materialCandidate.needsUpdate = true
            materialCandidate.userData.fenceBrightnessBoostApplied = true
            boostedAnyMaterial = true
        })
    })

    return boostedAnyMaterial
}

const { onBeforeRender } = useLoop()

onBeforeRender(() => {
    if (materialBoostApplied || !wrapperRef.value) {
        return
    }

    materialBoostApplied = brightenFenceMaterials(wrapperRef.value)
})

</script>
<template>
    <TresGroup ref="wrapperRef">
        <Suspense>
            <Solid>
                <GLTFModel
                    path="/3dModels/fense.glb"
                    :position="props.position"
                    :scale="2.3"
                    :rotation="props.rotation"
                    cast-shadow
                    receive-shadow
                />
            </Solid>
        </Suspense>
    </TresGroup>
</template>