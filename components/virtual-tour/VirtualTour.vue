<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { DoubleSide, PCFShadowMap, Vector3 } from 'three'
import { OrbitControls, GLTFModel } from '@tresjs/cientos'

type Vec3 = [number, number, number]

type AnimalInfo = {
  id: string
  name: string
  modelPath: string
  modelScale: number
  position: Vec3
  floorColor: string
  wallColor: string
  videoId: string
}

type TresControlsLike = {
  target?: Vector3
  update?: () => void
}

const animals = ref<AnimalInfo[]>([
  {
    id: 'lion',
    name: 'Lion',
    modelPath: '/3dModels/lion.glb',
    modelScale: 0.25,
    position: [0, 0, -8],
    floorColor: '#DAA520',
    wallColor: '#808080',
    videoId: 'https://www.youtube.com/embed/5kozt0uDaXg',
  },
  {
    id: 'penguin',
    name: 'Penguin',
    modelPath: '/3dModels/pingwin.glb',
    modelScale: 0.005,
    position: [8, 0, 0],
    floorColor: '#F0F8FF',
    wallColor: '#ADD8E6',
    videoId: 'https://www.youtube.com/embed/5Vv-E6gnS6M',
  },
  {
    id: 'elephant',
    name: 'Elephant',
    modelPath: '/3dModels/elephant.glb',
    modelScale: 0.45,
    position: [0, 0, 8],
    floorColor: '#8B5A2B',
    wallColor: '#654321',
    videoId: 'https://www.youtube.com/embed/45W6M8s4BMc',
  },
  {
    id: 'panda',
    name: 'Panda',
    modelPath: '/3dModels/panda.glb',
    modelScale: 1,
    position: [-8, 0, 0],
    floorColor: '#32CD32',
    wallColor: '#006400',
    videoId: 'https://www.youtube.com/embed/dqT-UlYlg1s',
  },
])

const isModalOpen = ref(false)
const activeAnimal = ref<AnimalInfo | null>(null)
const hoveredKioskId = ref<string | null>(null)
const GROUND_CAMERA_Y = 1.7
const cameraPosition = ref<Vec3>([10, GROUND_CAMERA_Y, 12])
const controlsRef = ref<TresControlsLike | null>(null)

const pressedKeys = new Set<string>()
const WALK_SPEED = 0.16
let walkingRafId: number | null = null

function getControlsInstance(): TresControlsLike | null {
  const controlsCandidate = controlsRef.value as unknown as { value?: TresControlsLike } | null
  if (controlsCandidate?.value) return controlsCandidate.value
  return controlsRef.value
}

function onKeyDown(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null
  if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
  pressedKeys.add(event.code)
}

function onKeyUp(event: KeyboardEvent) {
  pressedKeys.delete(event.code)
}

function walkStep() {
  let dx = 0
  let dz = 0

  if (pressedKeys.has('KeyW')) dz -= WALK_SPEED
  if (pressedKeys.has('KeyS')) dz += WALK_SPEED
  if (pressedKeys.has('KeyA')) dx -= WALK_SPEED
  if (pressedKeys.has('KeyD')) dx += WALK_SPEED

  if (dx !== 0 || dz !== 0) {
    const [x, , z] = cameraPosition.value
    cameraPosition.value = [x + dx, GROUND_CAMERA_Y, z + dz]

    const controls = getControlsInstance()
    if (controls?.target) {
      controls.target.x += dx
      controls.target.y = GROUND_CAMERA_Y
      controls.target.z += dz
      controls.update?.()
    }
  }

  walkingRafId = window.requestAnimationFrame(walkStep)
}

const activeVideoSrc = computed(() => {
  if (!activeAnimal.value?.videoId) return ''
  return activeAnimal.value.videoId.startsWith('http')
    ? activeAnimal.value.videoId
    : `https://www.youtube.com/embed/${activeAnimal.value.videoId}`
})

function openModal(animal: AnimalInfo) {
  activeAnimal.value = animal
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

function onKioskPointerEnter(id: string) {
  hoveredKioskId.value = id
  document.body.style.cursor = 'pointer'
}

function onKioskPointerLeave() {
  hoveredKioskId.value = null
  document.body.style.cursor = ''
}

onBeforeUnmount(() => {
  if (walkingRafId !== null) {
    window.cancelAnimationFrame(walkingRafId)
    walkingRafId = null
  }
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  pressedKeys.clear()
  document.body.style.cursor = ''
})

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  const controls = getControlsInstance()
  if (controls?.target) {
    controls.target.y = GROUND_CAMERA_Y
    controls.update?.()
  }
  walkingRafId = window.requestAnimationFrame(walkStep)
})
</script>

<template>
  <section class="virtual-tour" aria-label="3D virtual tour">
    <div class="virtual-tour__canvas-wrap">
      <TresCanvas
        clear-color="#87ceeb"
        shadows
        :shadow-map-type="PCFShadowMap"
        :dpr="[1, 1.5]"
      >
        <TresPerspectiveCamera
          :position="cameraPosition"
          :fov="50"
        />

        <OrbitControls
          ref="controlsRef"
          :enable-damping="true"
          :enable-zoom="false"
          :min-polar-angle="Math.PI / 2"
          :max-polar-angle="Math.PI / 2"
        />

        <TresAmbientLight :intensity="0.65" />
        <TresDirectionalLight
          :position="[8, 12, 6]"
          :intensity="1.05"
          cast-shadow
        />

        <TresMesh :position="[0, -0.2, 0]" receive-shadow>
          <TresCylinderGeometry :args="[20, 20, 0.4, 96]" />
          <TresMeshStandardMaterial color="#9ea3a8" />
        </TresMesh>

        <TresMesh :position="[0, 3, 0]">
          <TresCylinderGeometry :args="[21, 21, 6, 128, 1, true]" />
          <TresMeshStandardMaterial color="#787d82" :side="DoubleSide" />
        </TresMesh>

        <TresGroup
          v-for="animal in animals"
          :key="animal.id"
          :position="animal.position"
        >
          <TresMesh :position="[0, -0.05, 0]" receive-shadow>
            <TresCylinderGeometry :args="[2.2, 2.2, 0.1, 40]" />
            <TresMeshStandardMaterial :color="animal.floorColor" />
          </TresMesh>

          <TresMesh :position="[0, 0.16, 0]" :rotation="[Math.PI / 2, 0, 0]" receive-shadow>
            <TresTorusGeometry :args="[2.3, 0.18, 18, 72]" />
            <TresMeshStandardMaterial :color="animal.wallColor" />
          </TresMesh>

          <Suspense>
            <GLTFModel
              :path="animal.modelPath"
              :position="[0, 0, 0]"
              :scale="animal.modelScale"
              cast-shadow
              receive-shadow
            />
            <template #fallback>
              <TresMesh :position="[0, 0.55, 0]" cast-shadow>
                <TresSphereGeometry :args="[0.5, 16, 16]" />
                <TresMeshStandardMaterial :color="animal.floorColor" />
              </TresMesh>
            </template>
          </Suspense>

          <TresMesh
            :position="[3, 0.5, 0]"
            cast-shadow
            @click="openModal(animal)"
            @pointer-enter="onKioskPointerEnter(animal.id)"
            @pointer-leave="onKioskPointerLeave"
          >
            <TresBoxGeometry :args="[0.5, 1, 0.25]" />
            <TresMeshStandardMaterial :color="hoveredKioskId === animal.id ? '#f58021' : '#3f4a54'" />
          </TresMesh>
        </TresGroup>
      </TresCanvas>

      <div
        v-if="isModalOpen"
        class="virtual-tour__modal-overlay"
        role="dialog"
        aria-modal="true"
      >
        <div class="virtual-tour__modal" @click.stop>
          <button
            class="virtual-tour__modal-close"
            type="button"
            aria-label="Close modal"
            @click="closeModal"
          >
            ×
          </button>

          <h2 class="virtual-tour__modal-title">{{ activeAnimal?.name }}</h2>

          <div class="virtual-tour__video-wrap">
            <iframe
              v-if="activeVideoSrc"
              :src="activeVideoSrc"
              title="Animal video"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
            <div v-else class="virtual-tour__video-placeholder">
              YouTube iframe placeholder
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.virtual-tour {
  width: 100%;
}

.virtual-tour__canvas-wrap {
  position: relative;
  width: 100%;
  height: min(78vh, 860px);
  min-height: 420px;
  border-radius: 16px;
  overflow: hidden;
  background: #87ceeb;
}

.virtual-tour__modal-overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgb(0 0 0 / 55%);
  z-index: 5;
}

.virtual-tour__modal {
  position: relative;
  width: min(720px, 100%);
  background: #fff;
  color: #20113d;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 18px 48px rgb(0 0 0 / 35%);
}

.virtual-tour__modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 50%;
  background: #f0f0f0;
  color: #000;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
}

.virtual-tour__modal-title {
  margin: 0 0 14px;
  padding-right: 36px;
  font-size: 1.5rem;
}

.virtual-tour__video-wrap {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 10px;
  overflow: hidden;
  background: #dfe3e7;
}

.virtual-tour__video-wrap iframe,
.virtual-tour__video-placeholder {
  width: 100%;
  height: 100%;
}

.virtual-tour__video-placeholder {
  display: grid;
  place-items: center;
  color: #475569;
  font-size: 0.95rem;
}

@media (max-width: 640px) {
  .virtual-tour__canvas-wrap {
    min-height: 360px;
    border-radius: 12px;
  }

  .virtual-tour__modal {
    padding: 16px;
  }

  .virtual-tour__modal-title {
    font-size: 1.25rem;
  }
}
</style>
