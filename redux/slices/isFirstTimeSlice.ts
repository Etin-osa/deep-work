import { createSlice } from "@reduxjs/toolkit"

const initialState = true

const isFirstTimeSlice = createSlice({
    name: 'isFirstTime',
    initialState,
    reducers: {
        setFirstTime: (state) => { 
            state = false
            return state
        }
    }
})

export const { setFirstTime } = isFirstTimeSlice.actions
export const getIsFirstTime = (state: { isFirstTime: boolean }) => state.isFirstTime
export default isFirstTimeSlice.reducer