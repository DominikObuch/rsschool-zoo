<script setup lang="ts">
import { onMounted, shallowRef } from 'vue';
import ZooEnvironment from './components/zoo/ZooEnvironment.vue'
import { PCFShadowMap } from 'three';
import FpsScene from './components/FpsScene.vue';
import Lights from './components/Lights.vue';
import { animalsConfig } from './config/animalsConfig';
import { EnumAnimal } from './enums/EnumAnimals';
import Animal from './components/Animal.vue';
import { PointerLockControls } from '@tresjs/cientos';
import Fense from './components/terrain/Fense.vue';
import AnimalEnclosure from './components/terrain/AnimalEnclosure.vue';
import PenguinEnclousureInside from './components/terrain/PenguinEnclousureInside.vue';
import LionEnclousureInside from './components/terrain/LionEnclousureInside.vue';
import zooConfig from './config/zooConfig';
import PandaEnclousureInside from './components/terrain/PandaEnclousureInside.vue';
import ElephantEnclousureInside from './components/terrain/ElephantEnclousureInside.vue';
import ZooGround from './components/zoo/ZooGround.vue';
import { preloadHighResolutionTextureModels } from '@virtual-tour/states/useCachedGltfLoader';

const isSceneLoading = shallowRef(true)
const sceneLoadError = shallowRef<string | null>(null)

async function loadSceneTextures() {
  isSceneLoading.value = true
  sceneLoadError.value = null

  try {
    await preloadHighResolutionTextureModels()
  } catch (error) {
    sceneLoadError.value = error instanceof Error ? error.message : 'Failed to load texture data.'
  } finally {
    isSceneLoading.value = false
  }
}

function retrySceneLoad() {
  void loadSceneTextures()
}

onMounted(() => {
  void loadSceneTextures()
})

</script>

<template>
  <section class="virtual-tour" aria-label="3D virtual tour">
    <div class="virtual-tour__canvas-wrap">
        <div v-if="isSceneLoading" class="virtual-tour__overlay" role="status" aria-live="polite">
          <p class="virtual-tour__overlay-title">loading texture data...</p>
          <p class="virtual-tour__overlay-text">preparing high-resolution wall and floor surfaces.</p>
        </div>

        <div v-else-if="sceneLoadError" class="virtual-tour__overlay virtual-tour__overlay--error" role="alert">
          <p class="virtual-tour__overlay-title">textures could not be loaded.</p>
          <p class="virtual-tour__overlay-text">please retry to continue the virtual tour.</p>
          <button type="button" class="virtual-tour__retry" @click="retrySceneLoad">retry loading</button>
        </div>

        <TresCanvas
          v-else
          clear-color="#87ceeb"
          shadows
          :shadow-map-type="PCFShadowMap"
          :dpr="[1, 1.5]">
          <FpsScene />
          <PointerLockControls  />
          <Lights />
          <ZooEnvironment />
          <ZooGround />
          <AnimalEnclosure :position="zooConfig.pandaEnclousurePosition" >
            <PandaEnclousureInside :position="[0, 0, 0]" :rotation="[0, 0, 0]"/>
            <Animal :rotation="[0, Math.PI, 0]" :animal="animalsConfig[EnumAnimal.PANDA]"></Animal>
          </AnimalEnclosure>
          <AnimalEnclosure :position="zooConfig.elephantEnclousurePosition" >
            <ElephantEnclousureInside :position="[0, 0, 0]" :rotation="[0, Math.PI, 0]"/>
            <Animal :rotation="[0, Math.PI, 0]" :animal="animalsConfig[EnumAnimal.ELEPHANT]"></Animal>
          </AnimalEnclosure>
          <AnimalEnclosure :position="zooConfig.lionEnclousurePosition" >
            <LionEnclousureInside :position="[0, 0, 0]" :rotation="[0, Math.PI, 0]"/>
            <Animal :rotation="[0, Math.PI, 0]" :animal="animalsConfig[EnumAnimal.LION]"></Animal>
          </AnimalEnclosure>
          <AnimalEnclosure :position="zooConfig.penguinEnclousurePosition" >
            <PenguinEnclousureInside :position="[0, 0, 0]" :rotation="[0, Math.PI, 0]"/>
            <Animal :position="[0.2, 0.24, 0.2]" :animal="animalsConfig[EnumAnimal.PENGUIN]"/>
            <Animal :position="[0.3, 0.24, 0.4]" :animal="animalsConfig[EnumAnimal.PENGUIN]"/>
            <Animal :position="[0.5, 0.24, 0.5]" :animal="animalsConfig[EnumAnimal.PENGUIN]"/>
            <Animal :position="[0.2, 0.24, 0.6]" :animal="animalsConfig[EnumAnimal.PENGUIN]"/>
          </AnimalEnclosure>
        </TresCanvas>

    </div>
  </section>
</template>

<style scoped>
.virtual-tour {
  width: 100%;
  min-height: calc(100dvh - var(--app-header-height, 74px) - 1rem);
}

.virtual-tour__canvas-wrap {
  position: relative;
  width: 100%;
  height: calc(100dvh - var(--app-header-height, 74px) - 1rem);
  min-height: 520px;
  border-radius: 12px;
  overflow: hidden;
  background: #d7e6f5;
}

.virtual-tour__overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(165deg, #ffffff 0%, #d7e6f5 100%);
  color: #20113d;
}

.virtual-tour__overlay--error {
  background: linear-gradient(165deg, #ffffff 0%, #f3e2d3 100%);
}

.virtual-tour__overlay-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.virtual-tour__overlay-text {
  margin: 0;
  max-width: 31rem;
  line-height: 1.4;
}

.virtual-tour__retry {
  border: 0;
  border-radius: 999px;
  padding: 0.65rem 1.25rem;
  background: #f58021;
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  cursor: pointer;
  transition: filter 0.2s ease;
}

.virtual-tour__retry:hover {
  filter: brightness(0.95);
}

@media (max-width: 640px) {
  .virtual-tour {
    min-height: calc(100dvh - var(--app-header-height, 74px) - 0.5rem);
  }

  .virtual-tour__canvas-wrap {
    height: calc(100dvh - var(--app-header-height, 74px) - 0.5rem);
    min-height: 420px;
    border-radius: 8px;
  }

  .virtual-tour__overlay {
    padding: 1rem;
  }

  .virtual-tour__overlay-title {
    font-size: 0.88rem;
  }
}

</style>
