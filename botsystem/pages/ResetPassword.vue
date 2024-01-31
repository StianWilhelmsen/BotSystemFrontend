<template>
<div class="container">
    <div class="form">
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
        setTimeout(() => statusText.value = "", 3000);
      }
    }
</script>