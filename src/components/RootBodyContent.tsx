'use client';

import { useAppDispatch } from "@/store/hooks";
import { userActions } from "@/store/slices/user.slice";
import { UserRow } from "@/types/db-row/user.row";
import React from "react";

export default function RootBodyContent({ children, user }: {
    children: React.ReactNode;
    user: UserRow;
}) {
    const dispatch = useAppDispatch();
    dispatch(userActions.set(user));

    return (
        <div>
            {children}
        </div>
    );
}