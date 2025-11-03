'use client';

import store from '@/store/store';
import NavBar from '@/components/NavBar';
import { Provider } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { UserRow } from '@/types/db-row/user.row';
import RootBodyContent from '@/components/RootBodyContent';

export default function RootBody({ children, user }: { 
    children: React.ReactNode;
    user: UserRow;
}) {
    return (
        <Provider store={store}>
            <div className="flex flex-col justify-center items-center">
                <NavBar />
                <RootBodyContent user={user}>{children}</RootBodyContent>
            </div>
        </Provider>
    );
}
