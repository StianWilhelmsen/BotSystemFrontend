<template>bruva</template>

<script setup>
import axios from 'axios';


onMounted(async () => {
    try {
        const response = await axios.get(apiPort.value + 'api/groups')
    }
})
</script>

<style scoped></style>
