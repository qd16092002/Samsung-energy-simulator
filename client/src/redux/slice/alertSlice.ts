import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: AlertState = {
  isOpen: false,
  title: 'Error',
  message: 'This is an error',
  type: 'error'
}

export const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    closeAlert: (state) => {
      state.isOpen = false
      state.type = 'error'
      state.title = 'Error'
      state.message = 'This is an error'
    },
    openAlert: (state, action: PayloadAction<AlertState>) => {
      state.isOpen = true
      state.title = action.payload.title
      state.message = action.payload.message
      state.type = action.payload.type
    },
  },
})

// Action creators are generated for each case reducer function
export const { openAlert, closeAlert } = alertSlice.actions

export default alertSlice.reducer