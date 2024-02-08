<template>
  <App>
    <LandingView />
  </App>
</template>

<script>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import store from "@/store.js";
import LandingView from "../views/LandingView.vue";

export default {
  components: {
    LandingView,
  },
  setup() {
    const router = useRouter();
  },
};
</script>

<style>
* {
  font-style: normal;
  font-family: "Arial", sans-serif;
}
</style>
