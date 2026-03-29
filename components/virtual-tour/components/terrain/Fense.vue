<script setup lang="ts">
import { GLTFModel } from '@tresjs/cientos';
import Solid from '@virtual-tour/components/utility/Solid.vue';

const props = defineProps<{
    position: [number, number, number],
    rotation?: [number, number, number],
}>()

</script>
<template>
    <Suspense>
        <Solid>
            <GLTFModel               
                path="/3dModels/fense.glb"
                :position="props.position"
                :scale="2.3"
                :rotation="props.rotation "
                 cast-shadow
                receive-shadow />
        </Solid>
    </Suspense>
</template>