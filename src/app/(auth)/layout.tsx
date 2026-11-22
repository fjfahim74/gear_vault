import type { ReactNode } from "react";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer";

const AuthLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Navbar />

            <main className="flex min-h-screen flex-1 items-center justify-center bg-base-100">
                {children}
            </main>
            <Footer />
        </>
    );
};

export default AuthLayout;