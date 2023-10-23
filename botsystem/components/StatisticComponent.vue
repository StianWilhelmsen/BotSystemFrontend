<template>
    <div class="stats-container">
        <h1 class="title">Statistikk</h1>
        <h3 class="sub-header">Totalt antall bøter: {{ totalFines }}</h3>
        <h3 class="sub-header">Største lovbryteren: {{ mostFines }}</h3>
        <h3 class="sub-header">Dine bøter: {{ yourFines }}</h3>
    </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';

export default {
    setup() {
        const totalFines = ref('')
        const mostFines = ref('')
        const yourFines = ref('')
        const apiPort = ref(import.meta.env.VITE_API_KEY);

        async function getStats() {
    try {
        const userId = localStorage.getItem('userId'); // Retrieve the user ID from localStorage
        const response = await axios.get(apiPort.value + "/api/fine/getStats", {
            params: { userId: userId }  // Pass the user ID as a query parameter
        });

        if (response.data) {
            totalFines.value = response.data.totalFines;
            mostFines.value = response.data.mostFinedUser;
            // Assuming the API returns the fines specific to the logged-in user in a field named 'yourFines'.
            yourFines.value = response.data.yourFines;
        }
    } catch (error) {
        console.error("Error fetching stats:", error);
    }
}


        onMounted(() => {
            getStats();
        })

        return {
            totalFines,
            mostFines,
            yourFines
        }
    }
}
</script>

<style scoped>
.stats-container {
    border: 0.5px solid rgb(180, 180, 180);
    max-width: 400px;
    margin: 0 auto;
    border-radius: 8px;
}

.title {
    font-size: 24px;
    text-align: center;
    margin-bottom: 20px;
    font-weight: bold;
}

.sub-header {
    font-size: 18px;
    margin-bottom: 15px;
    color: #dfdfdf;
    font-weight: 500;
    text-align: left;
}
</style>
