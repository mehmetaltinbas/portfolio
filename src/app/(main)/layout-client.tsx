'use client';

import LoadingSpinner from "@/components/LoadingSpinner";
import NavBar from "@/components/NavBar";
import { useAppDispatch } from "@/store/hooks";
import { isAdminActions } from "@/store/slices/is-admin-slice";
import { userActions } from "@/store/slices/user-slice";
import React, { useEffect, useState } from "react";

export default function LayoutClient(
    {
        children,
        isAuthorized
    }: {
        children: React.ReactNode,
        isAuthorized: boolean;
    }
){
    const dispatch = useAppDispatch();
    const [isReady, setIsReady] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            await dispatch(userActions.refresh());
            await dispatch(isAdminActions.set(isAuthorized));
            setIsReady(true);
        })();
    }, [dispatch, isAuthorized]);

    return (
        <div className="w-ful h-full flex flex-col justify-start items-center">
            <NavBar />
            {isReady ? (
                <div className="w-full h-full p-4 pt-[52px]">{children}</div>
            ): (
                <LoadingSpinner isHidden={false} />
            )}
        </div>
    );
}
