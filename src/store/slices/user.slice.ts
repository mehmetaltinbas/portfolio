import { UserRow } from '@/types/db-row/user.row';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: UserRow = {
    id: '',
    email: '',
    userName: '',
    passwordHash: '',
    fullName: '',
    headline: '',
    bio: '',
    about: '',
    location: '',
    skills: []
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        set(state, action: PayloadAction<UserRow>) {
            return action.payload;
        },
    },
});

export const userActions = userSlice.actions;

export const userReducer = userSlice.reducer;
