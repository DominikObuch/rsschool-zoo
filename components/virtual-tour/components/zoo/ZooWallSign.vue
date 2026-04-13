<script setup lang="ts">
import { Text3D } from '@tresjs/cientos'
import zooConfig from '@virtual-tour/config/zooConfig'

const text = 'rs-school zoo'
const basePath = import.meta.env.BASE_URL ?? '/'
const normalizedBasePath = basePath.endsWith('/') ? basePath : `${basePath}/`
const fontPath = `${normalizedBasePath}fonts/helvetiker_bold.typeface.json`

const signPosition: [number, number, number] = [0, 3.05, -zooConfig.depth / 2 + 0.22]
const shadowLayerOffset = -0.08
</script>

<template>
  <TresGroup :position="signPosition">
    <Suspense>
      <Text3D
        :text="text"
        :font="fontPath"
        :size="1.55"
        :height="0.38"
        :curve-segments="8"
        :bevel-enabled="true"
        :bevel-thickness="0.03"
        :bevel-size="0.02"
        :bevel-segments="5"
        :position="[0, 0, shadowLayerOffset]"
        :scale="[1.04, 1.04, 1]"
        :center="true"
        cast-shadow
        receive-shadow
      >
        <TresMeshStandardMaterial
          color="#000000"
          emissive="#000000"
          :emissive-intensity="0.22"
          :roughness="0.45"
          :metalness="0.18"
        />
      </Text3D>
    </Suspense>

    <Suspense>
      <Text3D
        :text="text"
        :font="fontPath"
        :size="1.55"
        :height="0.30"
        :curve-segments="8"
        :bevel-enabled="true"
        :bevel-thickness="0.03"
        :bevel-size="0.02"
        :bevel-segments="5"
        :center="true"
        cast-shadow
        receive-shadow
      >
        <TresMeshStandardMaterial
          color="#FFD700"
          emissive="#7a6600"
          :emissive-intensity="0.35"
          :roughness="0.30"
          :metalness="0.20"
        />
      </Text3D>
    </Suspense>
  </TresGroup>
</template>
