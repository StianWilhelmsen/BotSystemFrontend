<template>
  <div class="dashboard-wrapper">
    <div class="welcome-wrapper">
      <div class="menu-navigator">
        <button @click="currentView = 'fines'" :class="{ 'active': currentView === 'fines' }" class="menu-item">Bøter</button>
        <button @click="currentView = 'lovverk'" :class="{ 'active': currentView === 'lovverk' }" class="menu-item">Lovverk</button>
      </div>
    
      <BotComponent v-if="currentView === 'fines'" />
      <LovverkComponent v-if="currentView === 'lovverk'" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import store from '@/store.js';
import LovverkComponent from '@/components/LovverkComponent.vue'
import BotComponent from '@/components/BotComponent.vue'

export default {




  setup() {
    const router = useRouter();
    const firstName = ref(store.firstname);
    const apiPort = ref(import.meta.env.VITE_API_KEY);
    const currentView = ref('fines');
    onMounted(async () => {


});
    
    return {
      firstName,
      currentView
    };
  },
};
</script>

<style scoped>

.stats-div {
  margin-bottom: 2vh;
}

.menu-navigator .menu-item {
  border: none;
  background-color: transparent;
  color: #ffffff;
  padding: 10px 20px;
  margin: 0 5px;
  width: 6rem;
  margin-bottom: 1rem;
}

.menu-navigator:hover .menu-item:hover {
  color: #a3a3a3; /* Dark blue text for contrast on hover */
  cursor: pointer;
}

.menu-item.active {
  color: rgb(50, 197, 247); 
  border-bottom: 1px solid rgb(50, 197, 247); /* Optional: if you want a bottom border */
}



.main-container input {
    background-color: #1a2438;
    border: none;
    border-radius: 8px;
    color: #ffffff;
    outline: none;
    font-size: medium;
  }

  .dashboard-wrapper {
  background-color: #1a2438;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.welcome-wrapper {
    text-align: center;
    color: rgb(231, 231, 231);
    margin-top: 4vh;
    margin-bottom: 10vh;
}

.welcome-wrapper h1 {
    margin: 0;
}

.main-container {
    display: flex;
    width: 40vh;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
  }



input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

@media only screen and (max-width: 600px) {
  .welcome-wrapper h1 {
    font-size: 1.5rem;
  }

  .main-container {
    max-width: 100%;
  }
}

@media only screen and (max-width: 600px) {
  .modal {
    width: 90%; /* Adjusted width */
    padding: 10px; /* Adjusted padding */
  }

  .modal textarea,
  .modal input,
  .modal select {
    width: calc(100% - 20px); /* Adjusted width */
    font-size: 0.8rem; /* Adjusted font size */
  }

  .input-row {
    margin: 15px 0; /* Adjusted margin */
  }

  .modal-footer button {
    padding: 8px 16px; /* Adjusted padding */
  }

  .main-container {
    width: 100%; /* Adjusted width */
  }

  .welcome-wrapper h1 {
    font-size: 1.5rem; /* Adjusted font size */
  }

  .fine-button,
  .fine-details button {
    padding: 8px 16px; /* Adjusted padding */
  }

  .user-list li {
    padding: 6px 10px; /* Adjusted padding */
  }
}



</style>