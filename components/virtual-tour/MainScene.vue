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
import PenguinEnclousureInside from './components/terrain/PenguinEnclousureInside.vue';
import LionEnclousureInside from './components/terrain/LionEnclousureInside.vue';
import zooConfig from './config/zooConfig';

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
          <AnimalEnclosure :position="zooConfig.pandaEnclousurePosition" >
            <Animal :rotation="[0, Math.PI, 0]" :animal="animalsConfig[EnumAnimal.PANDA]"></Animal>
          </AnimalEnclosure>
          <AnimalEnclosure :position="zooConfig.elephantEnclousurePosition" >
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
