<template>
    <div class="user-fines-container">
      <div 
        v-for="(userWithFine, index) in usersWithFines" 
        :key="index" 
        class="user-fine-container"
        @click="toggleExpansion(index)"
      >
        <div class="user-details">
          <div class="user-name">{{ userWithFine.user.firstname }} {{ userWithFine.user.lastname }}</div>
          <div class="user-fine">{{ userWithFine.totalWeight }}</div>
        </div>
        <div v-if="expandedIndex === index" class="fine-details">
            <div v-if="loadingStates.get(userWithFine.user.id)" class="spinner"></div> <!-- Loading spinner -->
            <div v-else v-for="(fine, fIndex) in userFinesDetails.get(userWithFine.user.id)" :key="fIndex" class="fine-item" @click.stop="toggleFineDetails(fine)">
          <span>{{ fine.recipient.firstname }} {{ fine.recipient.lastname }} <strong>{{ fine.weight }}</strong></span>
          <p>§ {{ fine.fineType.fineName }}</p>
          <span>{{ formatTimestamp(fine.timestamp) }}</span>
          <div v-if="fine.showDetails" class="fine-expanded-details">
                <h5 class="fineInfo">Gitt av: {{ fine.issuer.firstname }} {{ fine.issuer.lastname }}</h5>
                  <p class="descriptionText">Begrunnelse:</p>
                  <p class="descriptionText">{{ fine.description }}</p>
                  <img v-if="fine.image" :src="'data:image/jpeg;base64,' + fine.image" alt="Ingen bildebevis funnet" class="fine-image" />

                  <div v-if="fine.recipient.id === loggedInUserId && !fine.defence">
                    <button v-if="invalidDefence" class="defence-button" @click.prevent.stop="showDefenceTextarea($event, fine)">Legg til forsvar</button>
                    <textarea class="defenceText" v-if="fine.showDefenceInput" v-model="fine.tempDefence" @click.stop></textarea>
                    <button class="defence-button" v-if="fine.showDefenceInput" @click.prevent.stop="submitDefence(fine)">Send inn forsvar</button>
                 </div>
                 <div class="defence-container" id="defence-title" v-if="fine.defence">
                  <div class="title"><b>Forsvar fra den tiltalte:</b></div>
                  <div class="defence-given">
                    {{ fine.defence }}
                  </div>
                </div>
              </div>
              </div>
          <div v-if="!userFinesDetails.get(userWithFine.user.id)" class="fine-details-placeholder">
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup>
    import { ref, onMounted } from 'vue';
    import axios from 'axios';
    import store from '@/store.js';

  
  const apiPort = ref(import.meta.env.VITE_API_KEY);
  const usersWithFines = ref([]);
  const expandedIndex = ref(null);
  const userFinesDetails = reactive(new Map());
  const loadingStates = reactive(new Map());
  const loggedInUserId = store.loggedInUserId;
  
  async function retrieveUsersWithFines() {
    try {
      const response = await axios.get(apiPort.value + "/api/users/getUsersWithFines");
      usersWithFines.value = response.data;
    } catch (error) {
      console.error("Error retrieving users with fines", error);
    }
  }
  
  async function toggleExpansion(index) {
  const userId = usersWithFines.value[index].user.id;
  if (expandedIndex.value !== index) {
    expandedIndex.value = index;
    if (!userFinesDetails.has(userId)) {
      loadingStates.set(userId, true); // Start loading
      try {
        const response = await axios.get(`${apiPort.value}/api/fine/${userId}/fines`);
        userFinesDetails.set(userId, response.data.reverse());
      } catch (error) {
        console.error("Error retrieving fines for user", error);
      } finally {
        loadingStates.set(userId, false); // End loading
      }
    }
  } else {
    expandedIndex.value = null;
  }
}

function formatTimestamp(timestamp) {
  if (timestamp) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const formattedDate = new Date(timestamp).toLocaleString('en-GB', options);
    return formattedDate;
  }
  return '';
}

function toggleFineDetails(fine) {
  fine.showDetails = !fine.showDetails;
}
  
  onMounted(retrieveUsersWithFines);
  </script>

<style scoped>

.fine-image {
    max-width: 100%;
    height: auto;
    object-fit: contain;
    display: block; 
    margin: 0 auto; 
}
.user-fine-container {
  border: 1px solid rgba(107, 107, 107, 0.5);
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: stretch; /* Stretch children to fill the width */
}

.user-details {
  display: flex;
  justify-content: space-between; /* Keeps items spaced between start and end of container */
  align-items: center; /* Centers items vertically */
  padding: 4px 16px;
  border-bottom: 1px solid rgba(107, 107, 107, 0.3); /* Separator line */
}

.user-name {
  font-weight: bold;
}

.user-fine {
  font-size: 1.5rem;
}


.user-fines-container {
  width: 100%;
}

.fine-details {
  margin-top: 20px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center; /* Centers the fine items horizontally */
}

.fine-details h3 {
  margin: 0;
}


  .fine-item {
    background-color: transparent;
    color: #d6d6d6;
    padding: 10px;
    margin: 10px 0;
    border: #d6d6d6 0.5px solid;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s, box-shadow 0.3s;
    width: 250px;
    box-shadow: 0 0 0px rgba(228, 228, 228, 0);
    list-style-type:none;
  }


  .fine-item:hover {
    box-shadow: 0 0 10px rgba(228, 228, 228, 0.2);
  }

  .fine-item span {
    display: block;
    margin-bottom: 5px;
  }

  .descriptionText {
  font-size: 0.9rem;
  text-align: left;
}

.fineInfo {
  text-align: left;
}

#defence-title {
  font-size: 0.8rem;
}



.defenceText {
  resize: none;
  font-size: 0.8rem;
  font-style: normal;
  font-family: 'Arial', sans-serif; /* Using Arial as a base font */
  width: 90%;
}

.defence-button {
    color: #ffffff; 
    padding: 10px 20px; 
    border-radius: 5px; 
    cursor: pointer; 
    transition: background-color 0.3s, transform 0.3s; 
    background-color: transparent;
    color: #d6d6d6;
    padding: 10px;
    margin: 10px 0;
    border: #d6d6d6 0.5px solid;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s, box-shadow 0.3s;
    box-shadow: 0 0 0px rgba(228, 228, 228, 0);
    width: 90%;
}

.defence-button:hover {
 /* Darkened gradient for hover effect */
    transform: scale(1.05); /* Slightly enlarge the button on hover for a subtle effect */
}

.descriptionText {
  font-size: 0.9rem;
  text-align: left;
}

.fineInfo {
  text-align: left;
}

textarea {
  background-color: #24324e; /* Dark blue background to match the modal */
  border: 1px solid #4a6fa1; /* Lighter blue border for visibility */
  border-radius: 8px;
  color: #ffffff; /* White text for contrast */
  font-style: normal;
    font-family: 'Arial', sans-serif; /* Using Arial as a base font */
    font-size: 16px; /* Adjust for readability */
    padding: 10px; /* Padding for better text alignment */
    line-height: 1.5; /* Spacing between lines for readability */
    transition: border-color 0.3s, box-shadow 0.3s; /* Smooth transition for focus effect */
}

textarea:focus {
    border-color: #4a6fa1; /* or any other color you prefer */
    outline: none; /* to remove the default browser outline */
    box-shadow: none; /* if you want to remove any potential shadow */
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #fff;
  width: 40px;
  height: 40px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
