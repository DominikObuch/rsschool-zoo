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
                 <GLTFModel path="/3dModels/terrain/cut_watermelon.glb" :position="[-1.05, 0.4, 2.0]" :rotation="[0, 0, Math.PI /3]" cast-shadow receive-shadow />
                 <GLTFModel path="/3dModels/terrain/cut_watermelon.glb" :position="[-1.5, 0.4, 1.6]" :rotation="[Math.PI / 1.9, 0, Math.PI / 0.9]" cast-shadow receive-shadow />
                 <GLTFModel path="/3dModels/terrain/cut_watermelon.glb" :position="[-2.4, 0.4, 1.4]" :rotation="[Math.PI / 0.9, 0, Math.PI / 0.9]" cast-shadow receive-shadow />
                 <GLTFModel path="/3dModels/terrain/cut_watermelon.glb" :position="[-2.9, 0.4, 2.9]" :rotation="[Math.PI / 0.9, 0, 0]" cast-shadow receive-shadow />
                 <GLTFModel path="/3dModels/terrain/cut_watermelon.glb" :position="[-1.8, 0.4, 2.8]" :rotation="[0, 0, Math.PI / 3]" cast-shadow receive-shadow />
             </TresGroup>
            </Suspense>
        </TresGroup>
</template>