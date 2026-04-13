<script setup lang="ts">
import { GLTFModel } from '@tresjs/cientos';
import type { AnimalInfo } from '@virtual-tour/models/Animal'
const props = defineProps<{
  animal: AnimalInfo
  position?: [number, number, number]
  rotation?: [number, number, number]
}>()
</script>
<template>
  <TresGroup :position="position || [0, 0, 0]" :rotation="rotation || [0, 0, 0]">
          <Suspense>
            <GLTFModel
              :path="animal.modelPath"
              :position="animal.position"
              :scale="animal.modelScale"
              cast-shadow
              receive-shadow
            />
            </Suspense>
  </TresGroup>
</template>