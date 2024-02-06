<template>

<div class="group-creator-wrapper">
    <div class="group-creator">
        <h2>Opprett gruppe</h2>
        <input type="text" class="input-field" v-model="groupName" placeholder="Gruppenavn">
        <label for="file-upload" class="custom-button">Last opp logo</label>
        <input id="file-upload" type="file" @change="uploadImage" accept="image/jpeg" style="display:none;">
        <img :src="previewImage" class="uploading-image" v-if="previewImage">
        <button @click="createGroup" class="custom-button">Opprett gruppe</button>
    </div>
</div>

</template>

<script setup>
import { ref } from 'vue';
import store from '@/store.js';
import axios from 'axios';
import { useRouter } from 'vue-router';



const apiPort = ref(import.meta.env.VITE_API_KEY);
const previewImage = ref(null);
const base64value = ref(null);
const userId = ref('2');
const groupName = ref('');
const router = useRouter();

const createGroup = async () => {
    console.log('Creating group');

    try {
        const response = await axios.post(`${apiPort.value}/api/groups/createGroup/${userId.value}`, {
            name: groupName.value,
            logo: base64value.value,
        });
        if (response.status === 200) {
            console.log('Group created successfully:', response.status);
            router.push("/newDashboard")
        } else {
            console.error('Error creating group:', response.data);
        }
    } catch (error) {
        console.error('Error creating group:', error);
    }
};

const uploadImage = (e) => {
    const image = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = e => {
        base64value.value = e.target.result.split(',')[1];
        previewImage.value = e.target.result;
    };
};

</script>

<style scoped>

.input-field {
    width: 10rem;
    padding: 10px;
    background-color: transparent;
    border: none;
    border-bottom: 2px solid #cccccc;
    color: #ffffff;
    outline: none;
    transition: all 0.3s;
    text-align: center;
}
.custom-button {
    border: 1px solid #ccc;
    display: inline-block;
    padding: 6px 12px;
    cursor: pointer;
    color: white;
    background-color: #1a2438;
    border-radius: 5px;
    margin-top: 10px;
    transition: background-color 0.1s;
}

.custom-button:hover {
    background-color: #dbdbdb41;
}
.group-creator-wrapper {
    background-color: #1a2438;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    color: rgb(250, 250, 250);
}

.group-creator {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    justify-content: center;
    width: 15rem;
}

.uploading-image {
    width: 200px;
    height: 200px;
    object-fit:contain ;
    border-radius:10%;
}

</style>
