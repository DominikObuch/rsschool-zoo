<script setup lang="ts">
import { Text3D } from '@tresjs/cientos'
import zooConfig from '@virtual-tour/config/zooConfig'

const wallZOffset = 0.18
const blackLayerOffset = -0.06
const signPosition: [number, number, number] = [0, 3.1, -zooConfig.depth / 2 + wallZOffset]
const signRotation: [number, number, number] = [0, 0, 0]

const text = 'rs-school zoo'
const fontPath = '/fonts/helvetiker_bold.typeface.json'
</script>

<template>
  <TresGroup :position="signPosition" :rotation="signRotation">
    <Suspense>
      <Text3D
        :text="text"
        :font="fontPath"
        :size="1.45"
        :height="0.28"
        :curve-segments="8"
        :bevel-enabled="true"
        :bevel-thickness="0.03"
        :bevel-size="0.015"
        :bevel-segments="6"
        :position="[0, 0, blackLayerOffset]"
        :scale="[1.05, 1.05, 1]"
        :center="true"
        cast-shadow
        receive-shadow
      >
        <TresMeshStandardMaterial
          color="#000000"
          emissive="#000000"
          :emissive-intensity="0.2"
          :roughness="0.45"
          :metalness="0.2"
        />
      </Text3D>
    </Suspense>

    <Suspense>
      <Text3D
        :text="text"
        :font="fontPath"
        :size="1.45"
        :height="0.24"
        :curve-segments="8"
        :bevel-enabled="true"
        :bevel-thickness="0.03"
        :bevel-size="0.015"
        :bevel-segments="6"
        :center="true"
        cast-shadow
        receive-shadow
      >
        <TresMeshStandardMaterial
          color="#FFD700"
          emissive="#7a6600"
          :emissive-intensity="0.35"
          :roughness="0.3"
          :metalness="0.2"
        />
      </Text3D>
    </Suspense>
  </TresGroup>
</template>
