'use client';

import LoadingSpinner from "@/components/LoadingSpinner";
import NavBar from "@/components/NavBar";
import { useAppDispatch } from "@/store/hooks";
import { userActions } from "@/store/slices/user-slice";
import React, { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const [isReady, setIsReady] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            await dispatch(userActions.refresh());
            setIsReady(true);
        })();
    }, [dispatch]);

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
