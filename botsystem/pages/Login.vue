<template>
  <div class="login-wrapper">
    <div class="overlay"></div>
    <img src="../images/gutta.jpg">
    <div class="login-form">
      <h2>Logg inn</h2>
      <div class="input-wrapper">
        <input
          type="text"
          id="email"
          name="email"
          v-model="email"
          required
          autocomplete="off"
          @keyup.enter="login"
        >
        <label for="email">Email</label>
      </div>
      <div class="input-wrapper">
        <input
          type="password"
          id="password"
          name="password"
          v-model="password"
          required
          autocomplete="off"
          
        >
        <label for="password">Password</label>
      </div>
      <div class="button-wrapper">
        <button @click="login">Login</button>
        <router-link to="/Register">
          <button>Registrer</button>
        </router-link>

      </div>
      {{ statusText }}
      <div>
        <router-link to="/RequestResetPassword">
          <h4 id="forgotten-password"><i>Glemt passord?</i></h4></router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import store from '@/store.js';
import Cookies from 'js-cookie';
import { strict } from 'assert';

    const email = ref('');
    const password = ref('');
    const router = useRouter();
    const apiPort = ref(import.meta.env.VITE_API_KEY);
    const statusText = ref('')


    async function login() {
  try {
    const response = await axios.post(apiPort.value + '/api/users/login', {
        email: email.value,
        password: password.value,
      }, {
        withCredentials: true
      });

    if (response.data.token) {
      Cookies.set('token', response.data.token, { expires: 999999, secure: true , samSite:'Strict'});
      router.push('/dashboard');
    } else {
    }
  } catch (error) {
    statusText.value = "Feil brukernavn eller passord.";
    console.error('Error during login:', error);
  }
}

function goToResetPassword() {
  router.push('/resetPassword');
}

onMounted(async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const response = await axios.get(`${apiPort.value}/api/users/verifySession`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.firstname) {
            store.isLoggedIn = true;
            store.firstname = response.data.firstname;
            store.lastname = response.data.lastname;
            store.loggedInUserId = response.data.userId;
            store.userRole = response.data.userRole;
            console.log("Session is valid");
            router.push('/dashboard');
          } else {
            throw new Error("Invalid session");
          }
        } catch (error) {
          console.error('Session verification failed:', error);
          store.isLoggedIn = false;
          router.push('/login');
        }
      } else {
        console.log("No token found, redirecting to login");
        router.push('/login');
      }
    });

</script>

  
  <style scoped>
  .login-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    overflow: hidden;
  }
  
  .login-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }
  
  .login-wrapper .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
  }
  
  .login-form {
    position: absolute;
    z-index: 1;
    background-color: rgba(36, 50, 78, 0.8); /* Dark blue background to match the modal */
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
  
  .login-form h2 {
    margin-bottom: 20px;
  }
  
  .login-form .input-wrapper {
    position: relative;
    width: 80%;
    margin-bottom: 20px;
  }
  
  .login-form input {
    width: 100%;
    padding: 10px;
    background-color: transparent;
    border: none;
    border-bottom: 2px solid #cccccc;
    color: #ffffff;
    outline: none;
    transition: all 0.3s;
  }

  
  .login-form label {
    position: absolute;
    top: -10px;
    left: 0;
    color: #cccccc;
    font-size: 12px;
    pointer-events: none;
    transition: all 0.3s;
  }
  
  .login-form input:focus + label,
  .login-form input:not(:placeholder-shown) + label {
    top: -20px;
    font-size: 12px;
    color: #cccccc;
  }
  
  .login-form button {
    padding: 10px 20px;
    background-color: transparent;
    color: #ffffff;
    border: 1px solid black;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin: 3px;
  }

  .login-form button:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
  

  .login-form input:-webkit-autofill {
  background-color: rgba(255, 255, 255, 0.1);
}

#forgotten-password {
  color: white;
  transition: color 0.1s;
  border-bottom: #ffffff 1px solid;
}

#forgotten-password:hover {
  color: #858585;
  cursor: pointer;
}


  </style>
  