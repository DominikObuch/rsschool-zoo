<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { shallowRef } from 'vue';
import playerConfig from '@virtual-tour/config/playerConfig';
import { useLoop } from '@tresjs/core';
import { PerspectiveCamera, Raycaster, Vector3 } from 'three';
import { collidableObjects } from '@virtual-tour/states/useCollisions';

const cameraRef = shallowRef<PerspectiveCamera | null>(null);
let velocityX = 0;
let velocityZ = 0;
const pressedKeys: Record<string, boolean> = {w: false, a: false, s: false, d: false};
const raycaster = new Raycaster();
const forwardDir = new Vector3();
const rightDir = new Vector3();
const leftDir = new Vector3();
const backDir = new Vector3();

const forwardRightDir = new Vector3().addVectors(forwardDir, rightDir).normalize()
const forwardLeftDir = new Vector3().addVectors(forwardDir, leftDir).normalize()
const backwardRightDir = new Vector3().addVectors(backDir, rightDir).normalize()
const backwardLeftDir = new Vector3().addVectors(backDir, leftDir).normalize()

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
    //Acceleration movement
    if (!cameraRef.value) return;
    if(velocityX > playerConfig.maxSpeed || velocityX < -playerConfig.maxSpeed) velocityX = Math.sign(velocityX) * playerConfig.maxSpeed
    if(velocityZ > playerConfig.maxSpeed || velocityZ < -playerConfig.maxSpeed) velocityZ = Math.sign(velocityZ) * playerConfig.maxSpeed

    velocityX -= velocityX * playerConfig.movementFriction * delta;
    velocityZ -= velocityZ * playerConfig.movementFriction * delta;

    if (pressedKeys.a) velocityX -= playerConfig.movementAcceleration * delta;
    if (pressedKeys.w) velocityZ -= playerConfig.movementAcceleration * delta;
    if (pressedKeys.s) velocityZ += playerConfig.movementAcceleration * delta;
    if (pressedKeys.d) velocityX += playerConfig.movementAcceleration * delta;

    cameraRef.value.getWorldDirection(forwardDir);
    rightDir.crossVectors(forwardDir, cameraRef.value.up);
    leftDir.copy(rightDir).negate();
    backDir.copy(forwardDir).negate();
    const checkHit = (direction: Vector3) => {
        raycaster.set(cameraRef.value!.position, direction);
        const hits = raycaster.intersectObjects(collidableObjects.value, true)
        return hits.length > 0 && hits[0].distance < playerConfig.colisionDistance;
    }
    // Moving Forward (Negative Z)
    if (velocityZ < 0 && checkHit(forwardDir)) velocityZ = 0
    
    // Moving Backward (Positive Z)
    if (velocityZ > 0 && checkHit(backDir)) velocityZ = 0
    
    // Moving Right (Positive X)
    if (velocityX > 0 && checkHit(rightDir)) velocityX = 0
    
    // Moving Left (Negative X)
    if (velocityX < 0 && checkHit(leftDir)) velocityX = 0

    if (velocityZ < 0 && velocityX > 0 && checkHit(forwardRightDir)) { velocityZ = 0; velocityX = 0 }
    if (velocityZ < 0 && velocityX < 0 && checkHit(forwardLeftDir)) { velocityZ = 0; velocityX = 0 }
    if (velocityZ > 0 && velocityX > 0 && checkHit(backwardRightDir)) { velocityZ = 0; velocityX = 0 }
    if (velocityZ > 0 && velocityX < 0 && checkHit(backwardLeftDir)) { velocityZ = 0; velocityX = 0 }

    cameraRef.value.translateX(velocityX * delta );
    cameraRef.value.translateZ(velocityZ * delta );
    cameraRef.value.position.y = playerConfig.yPosition;
})

</script>

<template>
    <TresPerspectiveCamera ref="cameraRef" :position="[0, playerConfig.yPosition, 0]" />
</template>