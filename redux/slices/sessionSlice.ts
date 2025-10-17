import { createSlice } from "@reduxjs/toolkit";

export type SlotType = 'work' | 'break';

export type SlotCard = {
    id: string;
    type: SlotType;
    duration: number; 
    label: string;
}

type SessionType = {
    label: string
    hour: number
    minute: number
    slots: SlotCard[]
}

const initialState: SessionType = {
    hour: 0,
    minute: 0,
    label: "",
    slots: []
}

const sessionSlice = createSlice({
    name: "sessions",
    initialState,
    reducers: {
        addNewSession: (state, action) => {
            state = action.payload
            return state
        }
    }
})

export const { addNewSession } = sessionSlice.actions
export const getAllSessions = (state: { sessions: SessionType }) => state.sessions
export default sessionSlice.reducer