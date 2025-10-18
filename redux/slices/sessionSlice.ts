import { createSlice } from "@reduxjs/toolkit";

export type SlotType = 'work' | 'break';

export type SlotCard = {
    id: string;
    type: SlotType;
    duration: number; 
    label: string;
    status?: "skipped" | "completed"
    skipTime?: number
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
        },
        updateSession: (state, action) => {
            state.slots = action.payload
        },
        addNewSessionOnActive: (state, action) => {
            state.slots.push(action.payload)
        }
    }
})

export const { addNewSession, updateSession, addNewSessionOnActive } = sessionSlice.actions
export const getAllSessions = (state: { sessions: SessionType }) => state.sessions
export default sessionSlice.reducer