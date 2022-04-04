import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value:'location-1',
}
export const counterSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    locationOne: (state) => {
      state.value = 'location-1'
    },
    locationTwo: (state) => {
      state.value = 'location-2'
    },
  },
})

// Action creators are generated for each case reducer function
export const { locationOne, locationTwo } = counterSlice.actions

export default counterSlice.reducer