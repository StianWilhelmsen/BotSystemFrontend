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
      <div button-wrapper>
        <button @click="login">Login</button>
        <router-link to="/Register">
          <button>Registrer</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import store from '@/store.js';
export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const router = useRouter();
    const isAutofilled = ref(false);
    const apiPort = ref('')

    async function login() {
      try {
        const response = await axios.post(apiPort.value + '/api/users/login', {
          email: email.value,
          password: password.value,
        });

        const token = response.data.token;
        const firstName = response.data.firstname;
        const lastName = response.data.lastname;

        localStorage.setItem('jwtToken', token);
        store.isLoggedIn = true;
        store.firstname = firstName;
        store.lastname = lastName;

        router.push('/dashboard');
      } catch (error) {
        console.error('Error during login:', error);
      }
    }

    onMounted(() => {
      apiPort.value = import.meta.env.API_KEY.trim()
      if (email.value !== '') {
        isAutofilled.value = true;
      }
      if (password.value !== '') {
        isAutofilled.value = true;
      }
    });
    

    return {
      email,
      password,
      login,
      router
    };
  },
};
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
  
  .login-form input:focus {
    border-bottom-color: #a86a07;
    background-color: rgba(255, 255, 255, 0.1);
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
    background-color: #d88808;
  }

  .login-form input:-webkit-autofill {
  background-color: rgba(255, 255, 255, 0.1);
}
  </style>
  