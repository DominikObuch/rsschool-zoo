<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { Vector3 } from 'three'
import { shallowRef } from 'vue'
import playerConfig from '@virtual-tour/config/playerConfig';
import { useLoop } from '@tresjs/core';
import { PerspectiveCamera } from 'three'
import { x } from 'vue-router/dist/index-BzEKChPW.js';
import { velocity } from 'three/tsl';

// MOVEMENT SECTION
const cameraRef = shallowRef<PerspectiveCamera | null>(null);
let velocityX = 0;
let velocityZ = 0;
const playerMovement = { x: 0, z: 0 };
const pressedKeys: Record<string, boolean> = {w: false, a: false, s: false, d: false}

const onKeyDown = (event: KeyboardEvent) => {
  const key = event.key.toLowerCase()
  if (key in pressedKeys) pressedKeys[key] = true
}

const onKeyUp = (event: KeyboardEvent) => {
  const key = event.key.toLowerCase()
  if (key in pressedKeys) pressedKeys[key] = false
}

onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
})

onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
})

const { onBeforeRender } = useLoop()

onBeforeRender(({delta}: { delta: number }) => {
    //acceleration movement
    if (!cameraRef.value) return;

    velocityX -= velocityX * playerConfig.movementFriction * delta;
    velocityZ -= velocityZ * playerConfig.movementFriction * delta;

    if (pressedKeys.a) velocityX -= playerConfig.movementAcceleration * delta;
    if (pressedKeys.w) velocityZ -= playerConfig.movementAcceleration * delta;
    if (pressedKeys.s) velocityZ += playerConfig.movementAcceleration * delta;
    if (pressedKeys.d) velocityX += playerConfig.movementAcceleration * delta;

    cameraRef.value.translateX(velocityX * delta );
    cameraRef.value.translateZ(velocityZ * delta );
    cameraRef.value.position.y = playerConfig.yPosition;
})

</script>

<template>
    <TresPerspectiveCamera ref="cameraRef" :position="[0, playerConfig.yPosition, 0]" />
</template>