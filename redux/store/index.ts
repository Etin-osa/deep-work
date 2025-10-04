import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import AsyncStorage from '@react-native-async-storage/async-storage';
import isFirstTime from "../slices/isFirstTimeSlice";
import session from "../slices/sessionSlice";

const persistConfig = {
    key: 'root',
    version: 1,
    storage: AsyncStorage
}

const reducers = combineReducers({
    isFirstTime,
    session
})

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    }).concat([]),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch