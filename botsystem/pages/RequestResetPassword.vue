<template>
<div class="container">
    <div class="form">
      <h2>Glemt passord</h2>
        <input type="text" placeholder="Email" id="email" name="email" v-model="email"/>
        <button class="btn" @click="sendResetPasswordMail">Reset Passord</button>
        {{ statusText }}
    </div>

</div>

</template>


<script setup>
import axios from 'axios';

const apiPort = ref(import.meta.env.VITE_API_KEY);
const email = ref("");
const statusText = ref("")


async function sendResetPasswordMail() {
      try {
        const response = await axios.post(`${apiPort.value}/api/PasswordReset/resetPasswordMail`, {
          email: email.value
        });
        if (response.status === 200) {
          statusText.value = "En e-post med instruksjoner for å tilbakestille passordet ditt er sendt til din e-postadresse.";
          console.log('Success sending reset password mail:', response.status);
        } else {
          statusText.value = "Noe gikk galt. Vennligst prøv igjen.";
          console.error('Error sending reset password mail:', response.data);
        }
      } catch (error) {
        console.error('Error sending reset password mail:', error);
        statusText.value = "Noe gikk galt. Vennligst prøv igjen.";
      } finally {
        setTimeout(() => statusText.value = "", 8000);
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
</style>
