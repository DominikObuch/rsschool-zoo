<script setup lang="ts">
import { Suspense } from 'vue';
import { GLTFModel } from '@tresjs/cientos';
import zooConfig from '@virtual-tour/config/zooConfig';
import { DoubleSide } from 'three';

const props = defineProps<{
    position?: [number, number, number],
    rotation?: [number, number, number],
}>()
</script>

<template>
    <TresGroup :position="props.position || [0, 0, 0]" :rotation="props.rotation || [0, 0, 0]" >
         <slot/>
         <!-- GROUND-->
            <TresMesh :position="[0, 0, 0]" :rotation="[Math.PI / 2, 0, 0]">
                <TresPlaneGeometry :args="[zooConfig.enclousureSize, zooConfig.enclousureSize]" />
                <TresMeshStandardMaterial color="#FDEBC0" :side="DoubleSide" />
            </TresMesh>
         <Suspense>
             <TresGroup>
                 <GLTFModel :scale="1" path="/3dModels/terrain/bamboo.glb" :position="[-3.2, 0, 2.2]" cast-shadow receive-shadow />
                 <GLTFModel :scale="0.9" path="/3dModels/terrain/bamboo.glb" :position="[-2.5, 0, 1.6]" cast-shadow receive-shadow />
                 <GLTFModel :scale="0.7" path="/3dModels/terrain/bamboo.glb" :position="[-3.8, 0, 1.4]" cast-shadow receive-shadow />
                 <GLTFModel :scale="0.5" path="/3dModels/terrain/bamboo.glb" :position="[-2.9, 0, 2.9]" cast-shadow receive-shadow />
                 <GLTFModel :scale="0.8" path="/3dModels/terrain/bamboo.glb" :position="[-3.6, 0, 2.8]" cast-shadow receive-shadow />
             </TresGroup>
            </Suspense>
        </TresGroup>
</template>