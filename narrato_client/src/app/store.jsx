import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./slice/authSlice"
import blogReducer from "./slice/blogSlice"
export const store = configureStore({
  reducer: {
    auth:authReducer,
    blog:blogReducer

  },
})

