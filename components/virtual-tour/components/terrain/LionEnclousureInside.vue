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
            <TresMesh :position="[0, 0, 0]" :rotation="[Math.PI/2, 0,0]">
                <TresPlaneGeometry :args="[zooConfig.enclousureSize, zooConfig.enclousureSize]" />
                <TresMeshStandardMaterial color="#FDEBC0" :side="DoubleSide" />
            </TresMesh>
         <Suspense>
             <GLTFModel
             path="/3dModels/terrain/tree_savanna.glb"
             :position=" [0/4, 0, 2]"
             :scale="0.48"
             cast-shadow
             receive-shadow />
            </Suspense>
        </TresGroup>
</template>