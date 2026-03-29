<script setup lang="ts">

</script>
<template>
    <TresAmbientLight :intensity="0.32" />
    <TresHemisphereLight
    :args="['#cbe8ff', '#7b8a6a', 0.55]"
    />
    <TresDirectionalLight
    :position="[8, 14, 10]"
    :intensity="1.1"
    cast-shadow
    :shadow-mapSize-width="2048"
    :shadow-mapSize-height="2048"
    :shadow-camera-near="0.5"
    :shadow-camera-far="80"
    :shadow-camera-left="-22"
    :shadow-camera-right="22"
    :shadow-camera-top="22"
    :shadow-camera-bottom="-22"
    :shadow-bias="-0.00015"
    />
    <TresDirectionalLight
    :position="[-10, 8, -6]"
    :intensity="0.45"
    />
    <TresSpotLight
    :position="[0, 16, -12]"
    :intensity="0.35"
    :angle="0.9"
    :penumbra="0.8"
    :distance="70"
    />
</template>