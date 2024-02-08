import store from "../store";

export default function ({ redirect }) {
  // If the user is not authenticated
  if (!store.isLoggedIn) {
    return redirect("/login");
  }
}
