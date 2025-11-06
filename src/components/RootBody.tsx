'use client';

import store from "@/store/store";
import React from "react";
import { Provider } from "react-redux";

export default function RootBody({ children }: {
    children: React.ReactNode;
}) {
    return (
        <Provider store={store}>
            <div className="w-full h-full">
                {children}
            </div>
        </Provider>
    );
}
