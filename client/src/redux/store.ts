import { configureStore } from '@reduxjs/toolkit'
import alertSlice from './slice/alertSlice'
import confirmSlice from './slice/confirmSlice'
import loadingSlice from './slice/loadingSlice'
import modalSlice  from './slice/modalSlice'
import refetchSlice from './slice/refetchSlice'
import imageDetailSlice from './slice/imageDetailSlice'

export const store = configureStore({
  reducer: {
    alert: alertSlice,
    confirm: confirmSlice,
    loading: loadingSlice,
    modal: modalSlice,
    refetch: refetchSlice,
    imageDetail: imageDetailSlice,    
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch