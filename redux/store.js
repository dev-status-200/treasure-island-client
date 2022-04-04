import { configureStore } from '@reduxjs/toolkit'
import locationSlice from './Actions&Reducers/locationSlice'

export const store = configureStore({
  reducer: {
    location: locationSlice,
  },
})