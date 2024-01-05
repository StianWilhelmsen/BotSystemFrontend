<template>

    <UserFinesAdmin/>
</template>

<script setup>
import store from '@/store.js';
import { onMounted } from 'vue';
import UserFinesAdmin from '../components/UserFinesAdmin.vue';

const router = useRouter();


onMounted(async () => {
    if (!store.userRole == "ADMIN") {
        router.push('/dashboard')
    } else if (!store.isLoggedIn) {
        router.push('/login')
    }
})
</script>