<template>
    <div class="main-container">
        <div class="search-fine-wrapper">
            <button class="fine-button" @click="openModal">Meld bot</button>
        </div>
        <div class="filter-div">

        </div>
        <div class="fines-container">
          <ul>
            <li v-for="fine in fines" :key="fine.id">
              <div :class="{ 'expanded': fine.showDetails }" class="fine-item" @click="toggleFineDetails(fine)">
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
              
            </li>
          </ul>
          <div class="load-more-wrapper">
    <button @click="loadMoreFines">Last inn flere</button>
</div>
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
  <option value="" disabled selected>Velg et lovbrudd</option>
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
          <button @click="postFine()" :disabled="isSubmitting">Meld inn</button>
        </div>
        <p v-if="isSubmitting">Prøver å poste bot...</p>
        <p> {{ statusText }}</p>
      </div>
    </div>
    <div class="overlay" v-if="isModalOpen" @click="closeModal"></div>
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
    const apiPort = ref(import.meta.env.VITE_API_KEY);
    const isSubmitting = ref(false);
    const loggedInUserId = store.loggedInUserId;
    const isButtonVisible = ref(true);
    const currentPage = ref(0);
    const invalidDefence = ref(true);

    const modalSearchQuery = ref('');
    const modalShowUserList = ref(false);


    async function handleImageUpload(event) {
  const file = event.target.files[0];
  try {
    const compressedImage = await compressImage(file);
    imageFile.value = compressedImage;
  } catch (err) {
    console.error('Error compressing image', err);
  }
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


    function showDefenceTextarea(event, fine) {
      event.stopPropagation();
      fine.showDefenceInput = true;
      isButtonVisible.value = false;
      invalidDefence.value = false;

}

async function submitDefence(fine) {
  console.log(fine.id)
  try {
    const response = await axios.post(`${apiPort.value}/api/fine/addDefence?fineId=${fine.id}`, {
      defence: fine.tempDefence
    });
    
    if (response.status === 200) {
      fine.defence = fine.tempDefence;
      fine.showDefenceInput = false;
    } else {
      console.error("Error adding defence:", response.data);
    }
  } catch (error) {
    console.error("Error adding defence:", error);
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

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.5);
    };
    img.onerror = (err) => reject(err);
  });
}
async function retrieveFines(page = 0) {
    try {
        const response = await axios.get(apiPort.value + "/api/fine/getFines", {
            params: {
                page: page,
                size: 10
            }
        });
        if (page === 0) {
            fines.value = response.data;
        } else {
            fines.value = [...fines.value, ...response.data];
        }
    } catch (error) {
        console.error("Error retrieving fines", error);
    }
}

function loadMoreFines() {
    currentPage.value += 1;
    retrieveFines(currentPage.value);
}


    function toggleFineDetails(fine) {
  fine.showDetails = !fine.showDetails;
}

function hideFineDetails(fine) {
  fine.showDetails = false;
}

    async function retrieveFineTypes() {
      try {
        const response = await axios.get(apiPort.value + "/api/fine/fineTypes");
        fineTypes.value = response.data;
      } catch (error) {
        console.error("Error retrieving fine types:", error);
      }
    }

    async function retrieveUsers() {
      try {
        const response = await axios.get(apiPort.value +"/api/users/getUsers");
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

      if (!selectedFineType.value) {
        statusText.value = "Vennligst velg et lovbrudd.";
        return;
    }

    if (!recipientFirstname.value || !recipientLastname.value) {
        statusText.value = "Vennligst velg hvem som har begått lovbruddet.";
        return;
    }

    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
    if (imageFile.value && imageFile.value.size > MAX_IMAGE_SIZE) {
        statusText.value = "Bildet er for stort. Vennligst last opp et bilde som er mindre enn 5MB.";
        return;
    }
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
    isSubmitting.value = true;
    const response = await axios.post(apiPort.value+'/api/fine/postFine', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (response.status === 200) {
          statusText.value = "Bot meldt inn";
          recipientFirstname.value = '';
          recipientLastname.value = '';
          selectedFineType.value = '';
          weight.value = '';
          description.value = '';
          imageFile.value = null;
          searchQuery.value = '';
          retrieveFines()
          setTimeout(() => {
            closeModal()
          }, 2000)
      } else {
        statusText.value = "Noe gikk galt. Vennligst prøv igjen.";
      }
    } catch (error) {
        console.error('Error saving fine:', error);
        if (error.response && error.response.data && error.response.data.message) {
            statusText.value = error.response.data.message; 
          } else {
            statusText.value = "En feil oppstod under innsending. Vennligst prøv igjen.";
        }
    }
    isSubmitting.value = false;
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
      toggleFineDetails,
      isSubmitting,
      loggedInUserId,
      showDefenceTextarea,
      submitDefence,
      loadMoreFines,
      invalidDefence
    };
  },
};
</script>

<style scoped>

#defence-title {
  font-size: 0.8rem;
}

.defence-container {
  font-size: 0.7rem;
  font-style: normal;
  font-family: 'Arial', sans-serif;
  border: #d6d6d6 0.5px solid;
    color: #ffffff; /* White text for contrast */
    padding: 10px 20px; /* Adjust as needed */
    text-align: left;
    line-height: 1.5;
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



.fine-type-select {
    width: 100%; /* Full width within its container */
    padding: 10px;
    background-color: #24324e; /* Dark blue background to match the modal */
    border: 1px solid #4a6fa1; /* Lighter blue border for visibility */
    border-radius: 8px;
    color: #ffffff; /* White text for contrast */
    font-size: 16px; /* Adjust font size for readability */
    appearance: none; /* Remove default appearance */
    outline: none; /* Remove focus outline */
    cursor: pointer; /* Hand cursor for dropdown */
}


.fine-expanded-details {
  background-color: transparent;
  overflow: hidden;
  transition: max-height 0.5s ease-in-out, opacity 0.5s ease-in-out;
  max-height: 0;
  opacity: 0;
}

.expanded .fine-expanded-details {
  max-height: fit-content; /* Adjust as needed */
  opacity: 1;
  max-width: 40vh;
}
.fine-image {
    max-width: 100%;
    height: auto;
    object-fit: contain;
    display: block; 
    margin: 0 auto; 
}

.fines-container {
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
  cursor: pointer;
  min-width: 100%;
  max-width: 250px;
}

.fines-container li {
  display: flex;
  align-items: center;
  justify-content: center;
}

.fines-container::-webkit-scrollbar {
    display: none;
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
  }

  .fine-item:hover {
    box-shadow: 0 0 10px rgba(228, 228, 228, 0.2);
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
    background-color: #24324e;
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
  background-color: transparent;
  border: 0.5px solid rgb(180, 180, 180);
  color: #ffffff;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.modal input {
    width: 90%; /* Full width within its container */
    padding: 10px;
    background-color: transparent;
    border: 0.5px solid rgb(180, 180, 180);
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

.fine-button {
  padding: 10px 20px;
  width: 8rem;
  border: 0.5px solid rgb(180, 180, 180);
  color: rgb(218, 218, 218);
  background-color: transparent;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.fine-button:hover {

}

.dropdown {
  position: relative;
}

.filter-div input{
  margin-top: 10px;
  padding: 10px;
  background-color: transparent;
  border: 0.5px solid rgb(180, 180, 180);
  border-radius: 8px;
  color: #ffffff;
  outline: none;
  font-size: medium;
}

.user-list {
  position: absolute;
  text-align: left;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #24324e; /* Dark blue background to match the modal */
  border: 1px solid #4a6fa1; /* Lighter blue border for visibility */
  border-radius: 8px;
  color: #ffffff; /* White text for contrast */
  font-size: 16px; /* Adjust font size for readability */
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
  background-color: #4a6fa1;
  border-radius: 7px;
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