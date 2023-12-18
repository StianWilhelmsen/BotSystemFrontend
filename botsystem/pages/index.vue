<template>
    <App>
        <LandingView/>
    </App>
</template>

<script>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import store from '@/store.js';
import LandingView from '../views/LandingView.vue';

export default {
    components: {
        LandingView
    },
    setup() {
        const router = useRouter();
        onMounted(() => {
            if (token) {
                store.isLoggedIn = true;
                store.firstname = localStorage.getItem('firstname') || '';
                store.lastname = localStorage.getItem('lastname') || '';
                store.loggedInUserId = parseInt(localStorage.getItem('userId'), 10) || 0;
                if (store.isLoggedIn) {
                    router.push('/dashboard');
                }
            }
        });
    }
}

</script>

<style>
* {
    font-style: normal;
    font-family: 'Arial', sans-serif;
}
</style>