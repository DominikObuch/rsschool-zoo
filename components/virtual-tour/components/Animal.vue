<script setup lang="ts">
import { GLTFModel } from '@tresjs/cientos';
import type { AnimalInfo } from '@virtual-tour/models/Animal'
const props = defineProps<{
  animal: AnimalInfo
}>()
</script>
<template>
          <Suspense>
            <GLTFModel
              :path="animal.modelPath"
              :position="animal.position"
              :scale="animal.modelScale"
              cast-shadow
              receive-shadow
            />
            </Suspense>
</template>