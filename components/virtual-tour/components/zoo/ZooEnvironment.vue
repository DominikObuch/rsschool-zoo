<script setup lang="ts">
import zooConfig from '@virtual-tour/config/zooConfig';
import FpsScene from '@virtual-tour/components/FpsScene.vue';
import { FrontSide, BackSide } from 'three';
import Solid from '@virtual-tour/components/utility/Solid.vue';
</script>
<template>


        <!-- Ground -->
        <TresMesh :position="[0, 0, 0]" :rotation="[-Math.PI/2,0, 0]" receive-shadow>
            <TresPlaneGeometry :args="[zooConfig.width, zooConfig.depth]"  />
            <TresMeshStandardMaterial color="#9ea3a8" />
        </TresMesh>
        <Solid>
            <!-- BEHIND WALL-->
            <TresMesh :position="[0, 0,zooConfig.depth/2]" :rotation="[Math.PI, 0,0]">
                <TresPlaneGeometry :args="[zooConfig.width, zooConfig.height]" />
                <TresMeshPhysicalMaterial color="#787d82" :side="FrontSide" />
            </TresMesh>
            <!-- FRONT WALL -->
            <TresMesh :position="[0, 0, -zooConfig.depth /2 ]" :rotation="[Math.PI, 0,0]">
                <TresPlaneGeometry :args="[zooConfig.width, zooConfig.height]" />
                <TresMeshPhysicalMaterial color="#787d82" :side="BackSide" />
            </TresMesh>
            <!-- LEFT WALL -->
            <TresMesh :position="[-zooConfig.width/2, 0, 0]" :rotation="[0, Math.PI /2, 0]" >
                <TresPlaneGeometry :args="[zooConfig.width, zooConfig.height]" />
            <TresMeshPhysicalMaterial color="#787d82" :side="FrontSide" />
            </TresMesh>
            <!-- RIGHT WALL -->
            <TresMesh :position="[zooConfig.width/2, 0, 0]" :rotation="[0, Math.PI /2, 0]" >
                <TresPlaneGeometry :args="[zooConfig.width, zooConfig.height]" />
                <TresMeshPhysicalMaterial color="#787d82" :side="BackSide" />
            </TresMesh>
        </Solid>
        <!-- HELPERS -->
        <TresAxesHelper />
        <TresGridHelper />
</template>