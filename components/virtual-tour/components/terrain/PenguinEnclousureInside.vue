<script setup lang="ts">
import { Suspense } from 'vue';
import { GLTFModel } from '@tresjs/cientos';
import { DoubleSide, FrontSide } from 'three';
import zooConfig from '@virtual-tour/config/zooConfig';

const props = defineProps<{
    position?: [number, number, number],
    rotation?: [number, number, number],
}>()
</script>

<template>
    <TresGroup :position="props.position || [0, 0, 0]" :rotation="props.rotation || [0, 0, 0]" >
         <slot/>
         <!-- LEFT WALL-->
         <TresMesh :position="[zooConfig.enclousureSize/2, -2, 0]" :rotation="[0, Math.PI /2,0]">
                <TresPlaneGeometry :args="[zooConfig.enclousureSize, 5]" />
                <TresMeshPhysicalMaterial color="#FFF" :side="DoubleSide" />
            </TresMesh>
            <!-- RIGHT WALL -->
            <TresMesh :position="[zooConfig.enclousureSize/2 * -1 , -2, 0]" :rotation="[0, Math.PI /2 ,0]">
                <TresPlaneGeometry :args="[zooConfig.enclousureSize, 5]" />
                <TresMeshPhysicalMaterial color="#FFF" :side="DoubleSide" />
            </TresMesh>
            <TresMesh :position="[0, -2, zooConfig.enclousureSize /2 ]" :rotation="[0, 0,0]">
                <TresPlaneGeometry :args="[zooConfig.enclousureSize, 5]" />
                <TresMeshPhysicalMaterial color="#FFF" :side="DoubleSide" />
            </TresMesh>
            <TresMesh :position="[0, -2, zooConfig.enclousureSize /2 * -1]" :rotation="[0, 0,0]">
                <TresPlaneGeometry :args="[zooConfig.enclousureSize, 5]" />
                <TresMeshPhysicalMaterial color="#FFF" :side="DoubleSide" />
            </TresMesh>
         <Suspense>
             <GLTFModel
             path="/3dModels/terrain/iceberg_scene.glb"
             :position="props.position || [0, 0, 0]"
             :scale="0.78"
             cast-shadow
             receive-shadow />
            </Suspense>
        </TresGroup>
</template>