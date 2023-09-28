<template>
<div class="dashboard-wrapper">
    <div class="welcome-wrapper">
        <h1>Velkommen, {{ firstName }}</h1>
        <div class="menu-navigator">
          <button @click="currentView = 'fines'" class="menu-item">Bøter</button>
          <button @click="currentView = 'lovverk'" class="menu-item">Lovverk</button>
    </div>
    
    <BotComponent v-if="currentView === 'fines'" />
    <LovverkComponent v-if="currentView === 'lovverk'" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import store from '@/store.js';
import axios from 'axios';
import LovverkComponent from '@/components/LovverkComponent.vue'
import BotComponent from '@/components/BotComponent.vue'

export default {




  setup() {
    const router = useRouter();
    const firstName = ref(store.firstname);
    const apiPort = ref(import.meta.env.VITE_API_KEY);
    const currentView = ref('fines');


    onBeforeMount(() => {
      if (!store.isLoggedIn) {
        router.push('/login')
      }
    });

    return {
      firstName,
      currentView
    };
  },
};
</script>

<style scoped>


.menu-navigator .menu-item {
    background-color: #eb940a; /* Orange Background */
    color: #ffffff; /* White Text */
    padding: 10px 20px; /* Padding around the text */
    border: none; /* No border */
    border-radius: 5px; /* Rounded corners */
    cursor: pointer; /* Hand cursor on hover */
    transition: background-color 0.3s ease; /* Smooth transition */
    font-size: 16px; /* Font size */
    margin-right: 10px; /* Space between buttons */
    width: 7rem;
    border: rgb(87, 87, 87) 1px solid;
}

.menu-navigator .menu-item:hover {
    background-color: #cf830a; /* Darker Orange on Hover */
}

.menu-navigator .menu-item:active {
    background-color: #a76600; /* Even Darker Orange on Click */
}
.main-container input {
    padding: 10px;
    background-color: #eb940a;
    border: none;
    border-radius: 8px;
    color: #ffffff;
    outline: none;
    font-size: medium;
  }

.dashboard-wrapper {
    background-color: #cf830a;
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
    padding: 0 20px;
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
    padding: 0 10px; /* Adjusted padding */
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