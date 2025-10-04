import { createSlice } from "@reduxjs/toolkit"

export type firstTimeJourney = {
    journey: "completed" | ""
}

const initialState: firstTimeJourney = { journey: "" }

const isFirstTimeSlice = createSlice({
    name: 'isFirstTime',
    initialState,
    reducers: {
        setFirstTime: (state, action) => { 
            state.journey = action.payload
        }
    }
})

export const { setFirstTime } = isFirstTimeSlice.actions
export const getIsFirstTime = (state: { isFirstTime: firstTimeJourney }) => state.isFirstTime
export default isFirstTimeSlice.reducer