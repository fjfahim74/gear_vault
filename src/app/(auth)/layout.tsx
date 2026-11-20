import type { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
    return (
        <main className="flex min-h-screen flex-1 items-center justify-center bg-base-100">
            {children}
        </main>
    );
};

export default AuthLayout;