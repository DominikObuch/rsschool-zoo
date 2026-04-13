<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef } from 'vue'
import playerConfig from '@virtual-tour/config/playerConfig'
import { useLoop } from '@tresjs/core'
import { Vector3 } from 'three'
import type { PerspectiveCamera } from 'three'
import {
    computePlanarVelocityFromCamera,
    disposePhysicsWorld,
    ensurePhysicsWorld,
    setPlayerPlanarVelocity,
    stepPhysicsWorld,
    syncCameraToPlayer,
    teleportPlayer,
} from '@virtual-tour/states/usePlayerPhysics'

const cameraRef = shallowRef<PerspectiveCamera | null>(null)
let velocityX = 0;
let velocityZ = 0;
const pressedKeys: Record<string, boolean> = { w: false, a: false, s: false, d: false }
const cameraStartPosition = new Vector3(0, playerConfig.yPosition, 0)
let physicsReady = false

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

    void ensurePhysicsWorld().then(() => {
        physicsReady = true

        if (cameraRef.value) {
            cameraStartPosition.copy(cameraRef.value.position)
            teleportPlayer(cameraStartPosition)
        }
    })
})

onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    disposePhysicsWorld()
})

const { onBeforeRender } = useLoop()

onBeforeRender(({ delta }: { delta: number }) => {
    if (!cameraRef.value || !physicsReady) return

    if (Math.abs(velocityX) > playerConfig.maxSpeed) {
        velocityX = Math.sign(velocityX) * playerConfig.maxSpeed
    }

    if (Math.abs(velocityZ) > playerConfig.maxSpeed) {
        velocityZ = Math.sign(velocityZ) * playerConfig.maxSpeed
    }

    velocityX -= velocityX * playerConfig.movementFriction * delta
    velocityZ -= velocityZ * playerConfig.movementFriction * delta

    if (pressedKeys.a) velocityX -= playerConfig.movementAcceleration * delta
    if (pressedKeys.w) velocityZ -= playerConfig.movementAcceleration * delta
    if (pressedKeys.s) velocityZ += playerConfig.movementAcceleration * delta
    if (pressedKeys.d) velocityX += playerConfig.movementAcceleration * delta

    velocityX = Math.abs(velocityX) < playerConfig.minSpeed ? 0 : velocityX
    velocityZ = Math.abs(velocityZ) < playerConfig.minSpeed ? 0 : velocityZ

    const worldVelocity = computePlanarVelocityFromCamera(
        cameraRef.value,
        velocityX,
        velocityZ,
    )

    setPlayerPlanarVelocity(worldVelocity.x, worldVelocity.z)
    stepPhysicsWorld(delta)
    syncCameraToPlayer(cameraRef.value)
})

</script>

<template>
    <TresPerspectiveCamera ref="cameraRef" :position="[0, playerConfig.yPosition, 0]" />
</template>