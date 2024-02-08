<template>
  <div class="stats-container">
    <h1 class="title">Statistikk</h1>
    <h3 class="sub-header">Totalt antall bøter: {{ totalFines }}</h3>
    <h3 class="sub-header">Største lovbryteren: {{ mostFines }}</h3>
    <h3 class="sub-header">Botpolitiet: {{ policeFine }}</h3>
    <h3 class="sub-header">Dine bøter: {{ yourFines }}</h3>
    <h3 class="sub-header">Bøter per pers: {{ averageFines }}</h3>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, computed, onMounted } from "vue";
import store from "@/store.js";

const totalFines = ref("");
const mostFines = ref("");
const yourFines = ref("");
const policeFine = ref("");
const averageFines = ref("");
const apiPort = import.meta.env.VITE_API_KEY;
let hasFetchedStats = false;

// Define a ref for userId that will be reactive
const userId = ref(null);

// Ensure that we only try to access localStorage when on the client
if (process.client) {
  userId.value = store.loggedInUserId;
}

async function getStats() {
  if (hasFetchedStats) return;
  hasFetchedStats = true;
  try {
    const response = await axios.get(`${apiPort}/api/fine/getStats`, {
      params: { userId: userId.value },
    });
    if (response.data) {
      totalFines.value = response.data.totalFines;
      mostFines.value = response.data.mostFinedUser;
      yourFines.value = response.data.yourFines;
      policeFine.value = response.data.mostGivenFines;
      averageFines.value = response.data.averageFines;
    }
  } catch (error) {
    console.error("Error fetching stats:", error);
  }
}

onMounted(() => {
  getStats();
});
</script>

<style scoped>
.stats-container {
  border: 0.5px solid rgb(180, 180, 180);
  max-width: 300px;
  margin: 0 auto;
  border-radius: 8px;
  padding: 5px 10px;
}

.title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
}

.sub-header {
  font-size: 15px;
  margin-bottom: 15px;
  color: #dfdfdf;
  font-weight: 500;
  text-align: left;
}
</style>
