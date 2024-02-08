<template>
  <div class="dashboard-wrapper">
    <div class="group-wrapper">
      <div class="group-header">
        <h2>Grupper</h2>
      </div>
      <div class="group-list">
        <div
          class="group-item"
          v-for="group in groups"
          :key="group.id"
          @click="openGroup(group.id)"
        >
          <h3>{{ group.name }}</h3>
          <img
            v-if="group.logo"
            :src="`data:image/jpeg;base64,${group.logo}`"
            alt="Group Logo"
            class="group-logo"
          />
        </div>
        <NuxtLink :to="'/GroupCreator'">
          <button class="custom-button">Opprett gruppe</button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import store from "@/store.js";
import { useRouter } from "vue-router";

const apiPort = ref(import.meta.env.VITE_API_KEY);
const groups = ref([]);
const userId = store.loggedInUserId;
const router = useRouter();

onMounted(async () => {
  console.log("Fetching groups");
  console.log(userId);
  const response = await axios.get(
    `${apiPort.value}/api/groups/getGroups/${userId}`,
  );
  if (response.status === 200) {
    console.log("Groups fetched successfully:", response.data);
    groups.value = response.data;
  } else {
    console.error("Error fetching groups:", response.data);
  }
});

const openGroup = (groupId) => {
  console.log("Opening group:", groupId);
  store.currentGroupId = groupId;
  router.push("/GroupDashboard");
};
</script>

<style scoped>
.group-logo {
  height: 4rem;
  object-fit: contain;
  border-radius: 20%;
}

.dashboard-wrapper {
  background-color: #1a2438;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  color: white;
  text-align: center;
}

.group-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border: 1px solid white;
  border-radius: 10px;
  background-color: #5a5a5a34;
  width: 12rem;
  height: 9rem;
  box-shadow: 0 0 10px 0 rgba(255, 255, 255, 0.205);
  transition: background-color 0.15s;
}

.group-item:hover {
  background-color: #5a5a5aa1;
  cursor: pointer;
}

.group-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  margin-top: 2rem;
}

.custom-button {
  border: 1px solid #ccc;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
  color: white;
  background-color: #1a2438;
  border-radius: 5px;
  margin-top: 10px;
  transition: background-color 0.1s;
}

.custom-button:hover {
  background-color: #dbdbdb41;
}
</style>
