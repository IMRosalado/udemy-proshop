import { createSlice } from "@reduxjs/toolkit";
import { User } from "../models/User";

const localStorageUser = localStorage.getItem('userInfo');

export type AuthState = {
  userInfo: User
}

const initialState = {
  userInfo: localStorageUser ? JSON.parse(localStorageUser):null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state, action) => {
      state.userInfo = null;
      localStorage.clear();
    }
  }
})

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;