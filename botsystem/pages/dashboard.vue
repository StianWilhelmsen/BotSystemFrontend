<template>
<div class="dashboard-wrapper">
    <div class="welcome-wrapper">
        <h1>Velkommen, {{ firstName }}</h1>
    </div>
    <div class="main-container">
        <div class="search-fine-wrapper">
            <button class="fine-button" @click="openModal">Meld bot</button>
        </div>
        <div class="fines-container">
          <ul>
            <li v-for="fine in fines" :key="fine.id">
              <div class="fine-item" @click="toggleFineDetails(fine)">
                <span>{{ fine.recipient.firstname }} {{ fine.recipient.lastname }} <strong>{{ fine.weight }}</strong></span>
                <span>{{ formatTimestamp(fine.timestamp) }}</span>
              </div>
              <div v-if="fine.showDetails" class="fine-details">
                <h4>{{ fine.recipient.firstname }} {{ fine.recipient.lastname }} {{ fine.weight }}</h4>
                <h5>Gitt av: {{ fine.issuer.firstname }} {{ fine.issuer.lastname }}</h5>
                <p>Begrunnelse: {{ fine.description }}</p>
                <img :src="'data:image/jpeg;base64,' + fine.image" alt="Ingen bildebevis funnet" class="fine-image" />
                <button @click="hideFineDetails(fine)">Skjul detaljer</button>
              </div>
            </li>
          </ul>
        </div>
    </div>

    <div class="modal" v-if="isModalOpen">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <div class="modal-header">
          <h2>Bot innmelding</h2>
        </div>
        <div class="input-row">
        <div class="dropdown">
          <input
            type="text"
            placeholder="Hvem har begått lovbruddet"
            v-model="searchQuery"
            @input="handleSearchInput"
            @click="showUserList = true"
          >
          <ul class="user-list" v-if="showUserList && searchQuery && filteredUsers.length > 0">
            <li v-for="user in filteredUsers" :key="user" @click="selectUser(user)">{{ user }}</li>
          </ul>
        </div>
      </div>
        <div class="input-row">
            <select id="fineType" v-model="selectedFineType" class="fine-type-select">
  <option value="" disabled selected>Lovbrudd</option>
  <option v-for="fineType in fineTypes" :key="fineType.fineType" :value="fineType">{{ fineType }}</option>
</select>
        </div>
        <div class="input-row">
          <input type="number" placeholder="Vekting" v-model="weight">
        </div>
        <div class="input-row">
          <textarea placeholder="Begrunnelse for bøtelegging" v-model="description"></textarea>
        </div>
        <input type="file" accept="image/*" @change="handleImageUpload" />
        <div class="modal-footer">
          <button @click="postFine()">Meld inn</button>
        </div>
        <p> {{ statusText }}</p>
      </div>
    </div>
    <div class="overlay" v-if="isModalOpen" @click="closeModal"></div>
</div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import store from '@/store.js';
import axios from 'axios';

export default {




  setup() {
    const router = useRouter();
    const firstName = ref(store.firstname);
    const recipientFirstname = ref('')
    const recipientLastname = ref('')
    const isModalOpen = ref(false);
    const userList = ref([]);
    const fineTypes = ref([]);
    const selectedFineType = ref('');
    const searchQuery = ref('');
    const showUserList = ref(false);
    const weight = ref();
    const description = ref('');
    const statusText = ref('')
    const fines = ref(null);
    const selectedFine = ref(null)
    const timestamp = new Date().toISOString();
    const imageFile = ref(null);

    function handleImageUpload(event) {
    imageFile.value = event.target.files[0];
}

    onBeforeMount(() => {
      if (!store.isLoggedIn) {
        router.push('/login')
      }
    });

    onMounted(() => {
      retrieveUsers();
      retrieveFineTypes();
      retrieveFines();
    });


    
    function formatTimestamp(timestamp) {
      if (timestamp) {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const formattedDate = new Date(timestamp).toLocaleString('en-US', options);
        return formattedDate;
      }
      return '';
    }


    async function retrieveFines() {
      try {
        const response = await axios.get(store.apiPort +"/api/fine/getFines");
        fines.value = response.data;
      } catch (error) {
        console.error("Error retrieving fines", error);
      }
    }

    function toggleFineDetails(fine) {
  fine.showDetails = !fine.showDetails;
}

function hideFineDetails(fine) {
  fine.showDetails = false;
}

    async function retrieveFineTypes() {
      try {
        const response = await axios.get(store.apiPort + "/api/fine/fineTypes");
        fineTypes.value = response.data;
      } catch (error) {
        console.error("Error retrieving fine types:", error);
      }
    }

    async function retrieveUsers() {
      try {
        const response = await axios.get(store.apiPort +"/api/users/getUsers");
        userList.value = response.data;
      } catch (error) {
        console.error("Error retrieving users", error);
      }
    }

    function openModal() {
        isModalOpen.value = true;
    }

    function closeModal() {
        isModalOpen.value = false;
    }

    const filteredUsers = computed(() => {
        const query = searchQuery.value.trim().toLowerCase();
        if (!query) return userList.value;
        return userList.value.filter(user => user.toLowerCase().includes(query));
    });

    function handleSearchInput(event) {
        searchQuery.value = event.target.value;
    }

    function selectUser(user) {
    const names = user.split(' ');
    if(names.length > 1) {
        recipientFirstname.value = names.slice(0, -1).join(' ');
        recipientLastname.value = names[names.length - 1]; 
    } else {
        recipientFirstname.value = names[0]; 
        recipientLastname.value = ''; 
    }
    searchQuery.value = user;
    showUserList.value = false;
}

    async function postFine() {
    try {
        const formData = new FormData();

        formData.append('issuer', JSON.stringify({
            firstname: store.firstname,
            lastname: store.lastname
        }));
        formData.append('recipient', JSON.stringify({
            firstname: recipientFirstname.value,
            lastname: recipientLastname.value
        }));
        formData.append('fineType', JSON.stringify(selectedFineType.value));
        formData.append('weight', weight.value);
        formData.append('description', description.value);
        formData.append('timestamp', timestamp);

        if (imageFile.value) {
            formData.append('image', imageFile.value);
        }

        const response = await axios.post(store.apiPort+'/api/fine/postFine', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        statusText.value = "Bot meldt inn";
        retrieveFines()
        setTimeout(() => {
          closeModal()
        }, 2000)
        } catch (error) {
            console.error('Error saving fine:', error);
        }
    }
    

    return {
      firstName,
      isModalOpen,
      openModal,
      closeModal,
      userList,
      selectedFineType,
      fineTypes,
      searchQuery,
      filteredUsers,
      handleSearchInput,
      selectUser,
      showUserList,
      recipientFirstname,
      recipientLastname,
      postFine,
      description,
      weight,
      statusText,
      fines,
      selectedFine,
      hideFineDetails,
      formatTimestamp,
      handleImageUpload,
      toggleFineDetails
    };
  },
};
</script>

<style scoped>

.fine-image {
    max-width: 100%;
    height: auto;
}

.fines-container {
  width: 90%;
  background-color: #eb940a;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  margin-top: 20px;
  cursor: pointer;
}

.fines-container li {
  display: flex;
  align-items: center;
  justify-content: center;
}

.fine-details {
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.fine-details h3 {
  margin: 0;
}

.fine-details button {
  padding: 10px 20px;
  background-color: #d88808;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.fine-details button:hover {
  background-color: #ffaa37;
}

  .fine-item {
    background-color: #fff;
    padding: 10px;
    margin: 10px 0;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: background-color 0.3s;
    width: 100%;
  }

  .fine-item:hover {
    background-color: #f0f0f0;
  }

  .fine-item span {
    display: block;
    margin-bottom: 5px;
  }

  ul {
    margin: 0px;
    padding: 0;
  }
.modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #a86a07;
    border-radius: 8px;
    padding: 18px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 9999;
}

.modal textarea {
    width: 20rem;
    height: 13rem;
}

.modal-content {
    color: #ffffff;
}

.modal-header, .modal-footer {
    align-items: center;
    justify-content: center;
    display: flex;
}

.modal-footer button {
  padding: 10px 20px;
  background-color: #d88808;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.modal input {
    padding: 10px;
    background-color: #eb940a;
    border: none;
    border-radius: 8px;
    color: #ffffff;
    outline: none;
    font-size: medium;
}

.input-row {
  margin: 30px 0;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9998;
}

.close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    cursor: pointer;
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
    height: 87vh;
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
    flex-direction: column;
    align-items: center;
    max-width: 600px; 
    margin: 0 auto;
    padding: 0 20px;
  }

.fine-button {
  padding: 10px 20px;
  width: 8rem;
  background-color: #d88808;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.fine-button:hover {
  background-color: #ffaa37;
}

.dropdown {
  position: relative;
}

.user-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #ffffff;
  color: black;
  border: 1px solid #ccc;
  border-radius: 4px;
  list-style: none;
  padding: 0;
  margin: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 999;
}

.user-list li {
  padding: 8px 12px;
  cursor: pointer;
}

.user-list li:hover {
  background-color: #f0f0f0;
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


</style>