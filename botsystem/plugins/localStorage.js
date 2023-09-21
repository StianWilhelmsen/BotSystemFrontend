export default {
  install: (app) => {
    const localStorageApi = {
      set(key, value) {
        if (process.client) {
          window.localStorage.setItem(key, value);
        }
      },
      get(key) {
        if (process.client) {
          return window.localStorage.getItem(key);
        }
        return null;
      },
      remove(key) {
        if (process.client) {
          window.localStorage.removeItem(key);
        }
      },
      clear() {
        if (process.client) {
          window.localStorage.clear();
        }
      },
    };

    app.config.globalProperties.$localStorage = localStorageApi;
  },
};