import { createSlice } from "@reduxjs/toolkit";

// Load from localStorage
const loadUserData = () => {
  try {
    const savedData = localStorage.getItem("userData");
    return savedData ? JSON.parse(savedData) : null;
  } catch {
    return null;
  }
};

const initialState = {
  userData: loadUserData(),
  isAuthenticated: !!loadUserData(),
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("userData", JSON.stringify(action.payload));
    },

    clearUserData: (state) => {
      state.userData = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("userData");
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setUserData,
  clearUserData,
  setLoading,
  setError,
} = userSlice.actions;

export default userSlice.reducer;
