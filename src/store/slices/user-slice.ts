import { ExtendedUserRow } from '@/types/db/extended-user-row';
import { ReadExtendedUserByIdResponse } from '@/types/response/user/read-extended-user-by-id-response';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const refresh = createAsyncThunk('user/refresh', async () => {
    const response: ReadExtendedUserByIdResponse = await (await fetch('/api/visitor/user/read', {
        method: 'GET'
    })).json();
    return response.user;
});

const initialState: ExtendedUserRow = {
    id: '',
    email: '',
    userName: '',
    passwordHash: '',
    fullName: '',
    headline: '',
    bio: '',
    about: '',
    location: '',
    skills: [],
    contacts: [],
    experiences: [],
    educations: [],
    portfolioItems: [],
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        set(state, action: PayloadAction<ExtendedUserRow>) {
            return action.payload;
        },
    },
    extraReducers(builder) {
        builder.addCase(refresh.fulfilled, (state, action) => {
            if (action.payload) return action.payload;
            return undefined;
        });
    }
});

export const userActions = {
    ...userSlice.actions,
    refresh
};

export const userReducer = userSlice.reducer;
