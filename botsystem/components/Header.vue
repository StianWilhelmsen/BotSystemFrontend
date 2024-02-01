<template>
  <div class="header-wrapper">
    <div class="header-content">
      <div @click="goHome" class="header-title">
        <img class="imgLogo" src="../images/beerlogo.png">
        <h1>BeerFine</h1>
      </div>
      <ul class="header-options" :class="{ 'show-menu': showMenu }">
        <li v-if="store.userRole === 'ADMIN' && store.isLoggedIn">
          <NuxtLink :to="'/Admin'" class="custom-link">Admin</NuxtLink></li>
        <li v-if="store.userRole === 'ADMIN'">
          <NuxtLink :to="'/Dashboard'" class="custom-link">Dashboard</NuxtLink>
        </li>
        <li v-if="store.isLoggedIn" @click="logout">Logg ut</li>
        <li v-else>
          <NuxtLink :to="'/Login'" class="custom-link">Logg inn</NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import store from '@/store.js';
import axios from 'axios';
import Cookies from 'js-cookie';

const router = useRouter();
const isOpen = ref(false);
const showMenu = ref(false);
const apiPort = ref(import.meta.env.VITE_API_KEY);

function goHome() {
  if (store.isLoggedIn) {
    router.push('/dashboard');
  } else {
    router.push('/');
  }
}

async function logout() {
  try {
    await axios.post(apiPort.value + '/api/users/logout', {}, { withCredentials: true });
    store.isLoggedIn = false;
    Cookies.remove('token');
    router.push('/');
  } catch (error) {
    console.error('Error during logout:', error);
  }
}

function toggle() {
  isOpen.value = !isOpen.value;
  showMenu.value = !showMenu.value;
}
</script>

  <style scoped>
@import url(https://fonts.googleapis.com/css?family=Roboto:300,400);

.header-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: #24324e;
  padding: 1rem;
  height: 5rem;
  font-family: Roboto;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.header-title {
  color: #fff;
  font-size: 2rem;
  margin: 0;
  display: flex;
  align-items: center;
}

.header-title:hover {
  cursor: pointer;
}

.imgLogo {
  height: 3rem;
  margin-right: 2vh;
}

.header-options {
  list-style: none;
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
}

.header-options li {
  margin-left: 1rem;
  cursor: pointer;
  color: #fff;
  font-size: 1.2rem;
  position: relative;
  transition: color 0.3s, transform 0.3s;
}

.header-options li:before {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0%;
  height: 2px;
  background-color: #fff;
  transition: width 0.3s;
}

.header-options li:hover {
  color: #e0e0e0;
  transform: translateY(-2px);
}

.header-options li:hover:before {
  width: 100%;
}

.custom-link {
  color: #fff; 
  text-decoration: none; 
}

.custom-link:focus, .custom-link:active {
  outline: none;
}

@media screen and (max-width: 800px) {

  .bar-container {
  display: inline-block;
  cursor: pointer;
}

  .menu-icon {
    display: block;
    cursor: pointer;
    color: #fff;
    font-size: 1.5rem;
    margin-left: 1rem;
  }

  .show-menu .header-options {
    display: flex;
  }
}
 
@media screen and (max-width: 400px) {
  .imgLogo {
  height: 2rem;
}
.header-title {
  color: #fff;
  font-size: 1.2rem;
  margin: 0;
  display: flex;
  align-items: center;
}



.bar1,
.bar2,
.bar3 {
  width: 35px;
  height: 5px;
  background-color: #333;
  margin: 5px 0;
  margin-right: 5vh;
}

.show-menu {
    display: flex;
    flex-direction: column;
}

}



</style>
  