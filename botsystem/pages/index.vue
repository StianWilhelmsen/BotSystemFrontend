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
            const token = localStorage.getItem('jwtToken');
            if (token) {
                store.isLoggedIn = true;
                store.firstname = localStorage.getItem('firstname') || '';
                store.lastname = localStorage.getItem('lastname') || '';
                store.loggedInUserId = parseInt(localStorage.getItem('userId'), 10) || 0;

                console.log('Store Values:');
                console.log('isLoggedIn:', store.isLoggedIn);
                console.log('firstname:', store.firstname);
                console.log('lastname:', store.lastname);
                console.log('loggedInUserId:', store.loggedInUserId);

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