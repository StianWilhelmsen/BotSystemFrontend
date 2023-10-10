import { reactive } from 'vue';

const store = reactive({
  isLoggedIn: false,
  firstname: '',
  lastname: '',
  loggedInUserId: 0,
});

export default store;