<script setup lang="ts">
import Fense from './Fense.vue';

const props = defineProps<{
  position: [number, number, number]
}>()
</script>
<template>
    <TresGroup :position="position">
        <!-- RIGHT WALL-->
        <Fense :position="[4.5, 0, 0]" :rotation="[0, Math.PI /2 , 0]" />
        <Fense :position="[4.5, 0, 3]" :rotation="[0, Math.PI /2 , 0]" />
        <Fense :position="[4.5, 0, -3]" :rotation="[0, Math.PI /2 , 0]" />

        <!-- LEFT WALL -->
        <Fense :position="[-4.5, 0, 3]" :rotation="[0, Math.PI / 2, 0]"  />
        <Fense :position="[-4.5, 0, -3]" :rotation="[0, Math.PI / 2, 0]"  />
        <Fense :position="[-4.5, 0, 0]" :rotation="[0, Math.PI / 2, 0]"  />

        <slot/>

        <!-- BACK WALL-->
        <Fense :position="[0, 0, 4.5]" :rotation="[0, Math.PI, 0]"  />  
        <Fense :position="[3, 0, 4.5]" :rotation="[0, Math.PI, 0]"  />  
        <Fense :position="[-3, 0, 4.5]" :rotation="[0, Math.PI, 0]"  />  
        
        <!-- FRONT WALL-->
        <Fense :position="[0, 0, -4.5]" :rotation="[0, Math.PI, 0]"  />
        <Fense :position="[3, 0, -4.5]" :rotation="[0, Math.PI, 0]"  />        
        <Fense :position="[-3, 0, -4.5]" :rotation="[0, Math.PI, 0]"  />        
        
    </TresGroup>

</template>