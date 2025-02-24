import { SCREEN } from '@/enum/setting'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: ImageDetailState = {
  isOpen: false,
  title: 'Image title',
  image: '',
  screen: SCREEN.BASE
}

export const imageDetailSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    closeImageDetail: (state) => {
      state.isOpen = false
      state.title = ''
      state.image = ''
      state.screen = SCREEN.BASE
    },
    openImageDetail: (state, action: PayloadAction<ImageDetailState>) => {
      state.isOpen = true
      state.title = action.payload.title
      state.image = action.payload.image
      state.screen = action.payload.screen ? action.payload.screen : SCREEN.BASE
    },
  },
})

// Action creators are generated for each case reducer function
export const { closeImageDetail, openImageDetail } = imageDetailSlice.actions

export default imageDetailSlice.reducer