<template>
    <div class="container">
      <div class="form">
        <h2>Reset Passord</h2>
        <input type="password" placeholder="New Password" id="newPassword" name="newPassword" v-model="newPassword"/>
        <input type="password" placeholder="Confirm New Password" id="confirmPassword" name="confirmPassword" v-model="confirmPassword"/>
        <button class="btn" @click="resetPassword">Reset Password</button>
        {{ statusText }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  
  const apiPort = ref(import.meta.env.VITE_API_KEY);
  const newPassword = ref("");
  const confirmPassword = ref("");
  const statusText = ref("");
  const route = useRoute();
  const token = route.query.token;
  
  async function resetPassword() {
    if (newPassword.value !== confirmPassword.value) {
      statusText.value = "Passordene matcher ikke.";
      return;
    }
  
    try {
      const response = await axios.post(`${apiPort.value}/api/PasswordReset/setNewPassword`, {
        token: token,
        newPassword: newPassword.value
      });
      if (response.status === 200) {
        statusText.value = "Ditt passord har blitt tilbakestilt.";
        console.log('Password reset successfully:', response.status);
      } else {
        statusText.value = "Noe gikk galt. Vennligst prøv igjen.";
        console.error('Error resetting password:', response.data);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      statusText.value = "Noe gikk galt. Vennligst prøv igjen.";
    }
  }
  </script>
  

  <style scoped>
  .container {
    background-color: #1a2438;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .form {
    display: flex;
    flex-direction: column;
    gap: 20px; /* This will add space between each child of .form */
    color: white;
    align-items: center;
    width: 15rem;
  }
  
  .form input, .form button {
    margin-bottom: 10px; /* This will add space below each input and button */
  }
  
  .form button {
    margin-top: 10px; /* Additional space above the button, if needed */
  }
  
  .form input {
    width: 100%;
      padding: 10px;
      background-color: transparent;
      border: none;
      border-bottom: 2px solid #cccccc;
      color: #ffffff;
      outline: none;
      transition: all 0.3s;
  }
  
  .form button {
    padding: 10px 20px;
      background-color: transparent;
      color: #ffffff;
      border: 1px solid black;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s;
      margin: 3px;
  }

  .form button:hover {
  background-color: rgba(255, 255, 255, 0.5);

}
  </style>
  