<script setup lang="ts">
import { shallowRef, onMounted, onUnmounted } from 'vue'
import { useLoop } from '@tresjs/core'
import {
  ensurePhysicsWorld,
  refreshSolidCollider,
  registerSolidCollider,
  unregisterSolidCollider,
} from '@virtual-tour/states/usePlayerPhysics'
import type { Group } from 'three'

const wrapperRef = shallowRef<Group | null>(null)
let colliderSignature = ''

function getMeshSignature(group: Group) {
  let meshCount = 0

  group.traverse((child) => {
    const meshCandidate = child as { isMesh?: boolean }
    if (meshCandidate.isMesh) {
      meshCount += 1
    }
  })

  return `${meshCount}`
}

onMounted(() => {
  void ensurePhysicsWorld().then(() => {
    if (!wrapperRef.value) return

    registerSolidCollider(wrapperRef.value)
    colliderSignature = getMeshSignature(wrapperRef.value)
  })
})

onUnmounted(() => {
  if (!wrapperRef.value) return
  unregisterSolidCollider(wrapperRef.value)
})

const { onBeforeRender } = useLoop()

onBeforeRender(() => {
  if (!wrapperRef.value) return

  const newSignature = getMeshSignature(wrapperRef.value)
  if (newSignature !== colliderSignature) {
    refreshSolidCollider(wrapperRef.value)
    colliderSignature = newSignature
  }
})
</script>

<template>
  <TresGroup ref="wrapperRef">
    <slot />
  </TresGroup>
</template>