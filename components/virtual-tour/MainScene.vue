<script setup lang="ts">
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

</script>

<template>
  <section class="virtual-tour" aria-label="3D virtual tour">
    <div class="virtual-tour__canvas-wrap">
        <TresCanvas
          clear-color="#87ceeb"
          shadows
          :shadow-map-type="PCFShadowMap"
          :dpr="[1, 1.5]">
          <FpsScene />
          <PointerLockControls  />
          <Lights />
          <ZooEnvironment />
          <AnimalEnclosure />
          <!-- <Animal :animal="animalsConfig[EnumAnimal.PANDA]"></Animal> -->
        </TresCanvas>

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
