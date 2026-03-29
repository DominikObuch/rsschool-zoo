<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, onUnmounted, ref } from 'vue'
import { BackSide, DoubleSide, FrontSide, PCFShadowMap, Vector3 } from 'three'
import { shallowRef } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import FpsScene from './components/FpsScene.vue'
import { PointerLockControls } from '@tresjs/cientos'
import playerConfig from './config/playerConfig'
import { useLoop } from '@tresjs/core'
import zooConfig from './config/zooConfig'
import ZooEnvironment from './components/zoo/ZooEnvironment.vue'


type Vec3 = [number, number, number]

type TresControlsLike = {
  target?: Vector3
  update?: () => void
}

// const animals = ref<AnimalInfo[]>([
//   {
//     id: 'lion',
//     name: 'Lion',
//     modelPath: '/3dModels/lion.glb',
//     modelScale: 0.25,
//     position: [0, 0, -8],
//     floorColor: '#DAA520',
//     wallColor: '#808080',
//     videoId: 'https://www.youtube.com/embed/5kozt0uDaXg',
//   },
//   {
//     id: 'penguin',
//     name: 'Penguin',
//     modelPath: '/3dModels/pingwin.glb',
//     modelScale: 0.005,
//     position: [8, 0, 0],
//     floorColor: '#F0F8FF',
//     wallColor: '#ADD8E6',
//     videoId: 'https://www.youtube.com/embed/5Vv-E6gnS6M',
//   },
//   {
//     id: 'elephant',
//     name: 'Elephant',
//     modelPath: '/3dModels/elephant.glb',
//     modelScale: 0.45,
//     position: [0, 0, 8],
//     floorColor: '#8B5A2B',
//     wallColor: '#654321',
//     videoId: 'https://www.youtube.com/embed/45W6M8s4BMc',
//   },
//   {
//     id: 'panda',
//     name: 'Panda',
//     modelPath: '/3dModels/panda.glb',
//     modelScale: 1,
//     position: [-8, 0, 0],
//     floorColor: '#32CD32',
//     wallColor: '#006400',
//     videoId: 'https://www.youtube.com/embed/dqT-UlYlg1s',
//   },
// ])


</script>

<template>
  <section class="virtual-tour" aria-label="3D virtual tour">
    <div class="virtual-tour__canvas-wrap">
      <ZooEnvironment />
    </div>
  </section>
</template>

<style scoped>
.virtual-tour {
  width: 100%;
}

.virtual-tour__canvas-wrap {
  width: 100%;
  height: calc(100vh - 150px);
  min-height: 520px;
  border-radius: 16px;
  overflow: hidden;
  background: #d7e6f5;
}

</style>
