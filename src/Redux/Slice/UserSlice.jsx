import { createSlice } from "@reduxjs/toolkit";

// Redux slice for managing user authentication state and token
const initialState = {
  user: null, // Stores logged-in user's profile
  token: null, // Stores JWT or session token
  isAuthenticated: false, // Indicates if user is logged in
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Set user and token on successful login
    login(state, action) {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
    },

    // Clear all user data on logout and remove token from localStorage
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
