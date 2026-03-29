<script setup lang="ts">
import { shallowRef, onMounted, onUnmounted } from 'vue'
import { collidableObjects } from '@virtual-tour/states/useCollisions'
import type { Group } from 'three'

const wrapperRef = shallowRef<Group | null>(null)

onMounted(() => {
  if (wrapperRef.value) {
    collidableObjects.value.push(wrapperRef.value)
  }
})

onUnmounted(() => {
  if (wrapperRef.value) {
    collidableObjects.value = collidableObjects.value.filter(
      (obj) => obj !== wrapperRef.value
    )
  }
})
</script>

<template>
  <TresGroup ref="wrapperRef">
    <slot />
  </TresGroup>
</template>