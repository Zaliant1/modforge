import { configureStore, createSlice } from '@reduxjs/toolkit'

const alertsSlice = createSlice({
  name: 'alerts',
  initialState: [],
  reducers: {
    addAlert: (state, action) => {
      state.push({ id: Date.now(), ...action.payload })
    },
    removeAlert: (state, action) => {
      return state.filter((alert) => alert.id !== action.payload)
    },
  },
})

export const { addAlert, removeAlert } = alertsSlice.actions

const store = configureStore({
  reducer: {
    alerts: alertsSlice.reducer,
  },
})

export const dispatchAlert = (alert) => store.dispatch(addAlert(alert))

export default store
