import { reactive } from 'vue';

const store = reactive({
  isLoggedIn: false,
  firstname: '',
  lastname: '',
  loggedInUserId: 0,
  userRole: '',
});

export default store;