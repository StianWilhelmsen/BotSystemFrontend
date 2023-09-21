import { reactive } from 'vue';

const store = reactive({
  isLoggedIn: false,
  firstname: '',
  lastname: '',
  apiPort: 'https://beerfine-lads-4c3ab486ace8.herokuapp.com'
});

export default store;