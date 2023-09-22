import { reactive } from 'vue';

const store = reactive({
  isLoggedIn: false,
  firstname: '',
  lastname: '',
});

export default store;