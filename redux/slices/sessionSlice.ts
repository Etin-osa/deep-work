import { createSlice } from "@reduxjs/toolkit";

type SessionType = {
    name: string
    hour: number
    minute: number
    slots: {
        id: number
        name: string
        type: "break" | "work"
        duration: number
    }[]
}

const initialState: SessionType[] = []

const sessionSlice = createSlice({
    name: "sessions",
    initialState,
    reducers: {
        addNewSession: (state, action) => {
            state.push(action.payload)
        }
    }
})

export const { addNewSession } = sessionSlice.actions
export const getAllSessions = (state: { sessions: SessionType[] }) => state.sessions
export default sessionSlice.reducer