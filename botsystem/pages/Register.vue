<template>
  <div class="register-wrapper">
    <div class="overlay"></div>
    <img src="../images/gutta.jpg" />
    <div class="register-form">
      <h2>Registering</h2>
      <div class="input-wrapper">
        <input
          type="text"
          id="firstname"
          name="firstname"
          required
          autocomplete="off"
          v-model="firstname"
        />
        <label for="firstname">Fornavn</label>
      </div>
      <div class="input-wrapper">
        <input
          type="text"
          id="lastname"
          name="lastname"
          required
          autocomplete="off"
          v-model="lastname"
        />
        <label for="lastname">Etternavn</label>
      </div>
      <div class="input-wrapper">
        <input
          type="text"
          id="email"
          name="email"
          required
          autocomplete="off"
          v-model="email"
        />
        <label for="email">Email</label>
      </div>
      <div class="input-wrapper">
        <input
          type="password"
          id="password"
          name="password"
          required
          autocomplete="off"
          v-model="password"
        />
        <label for="password">Password</label>
      </div>
      <p>{{ statusText }}</p>
      <button @click="registerUser">Registrer</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import store from "@/store.js";

export default {
  setup() {
    const statusText = ref("");
    const router = useRouter();
    const firstname = ref("");
    const lastname = ref("");
    const email = ref("");
    const password = ref("");
    const apiPort = ref(import.meta.env.VITE_API_KEY);

    function registerUser() {
      if (firstname.value && lastname.value && email.value && password.value) {
        if (!validateEmail(email.value)) {
          statusText.value = "Vennligst oppgi en gyldig e-postadresse.";
          setTimeout(() => (statusText.value = ""), 3000);
          return;
        }

        console.log("trying to register user");
        const user = {
          firstname: firstname.value,
          lastname: lastname.value,
          email: email.value,
          password: password.value,
        };

        axios
          .post(apiPort.value + "/api/users/register", user)
          .then((response) => {
            statusText.value = response.data;
            setTimeout(() => {
              router.push("/login");
            }, 2000);
          })
          .catch((error) => {
            console.log("Registration failed", error.response);
          });
      } else {
        statusText.value = "Vennligst fyll ut alle feltene.";
        setTimeout(() => {
          statusText.value = "";
        }, 5000);
      }
    }

    function validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    return {
      firstname,
      lastname,
      email,
      password,
      registerUser,
      statusText,
    };
  },
};
</script>
<style scoped>
.register-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
}

.register-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: fill;
}

.register-wrapper .overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
}

.register-form {
  position: absolute;
  z-index: 1;
  background-color: #a86a07b2;
  height: 50vh;
  width: 40vh;
  border-radius: 5%;
  text-align: center;
  color: #cccccc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.register-form h2 {
  margin-bottom: 20px;
}

.register-form .input-wrapper {
  position: relative;
  width: 80%;
  margin-bottom: 20px;
}

.register-form input {
  width: 100%;
  padding: 10px;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid #cccccc;
  color: #ffffff;
  outline: none;
  transition: all 0.3s;
}

.register-form input:focus {
  border-bottom-color: #a86a07;
  background-color: rgba(255, 255, 255, 0.1);
}

.register-form label {
  position: absolute;
  top: -10px;
  left: 0;
  color: #cccccc;
  font-size: 12px;
  pointer-events: none;
  transition: all 0.3s;
}

.register-form input:focus + label,
.reister-form input:not(:placeholder-shown) + label {
  top: -20px;
  font-size: 12px;
  color: #cccccc;
}

.register-form button {
  padding: 10px 20px;
  background-color: transparent;
  color: #ffffff;
  border: 1px solid black;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 3px;
}

.register-form button:hover {
  background-color: #d88808;
}
</style>
