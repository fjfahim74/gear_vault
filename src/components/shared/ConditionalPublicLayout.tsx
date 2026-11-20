"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer";

const ConditionalPublicLayout = ({
    children,
}: {
    children: ReactNode;
}) => {
    const pathname = usePathname();

    const isDashboard = pathname.startsWith("/dashboard");

    if (isDashboard) {
        return <main className="flex-1">{children}</main>;
    }

    return (
        <>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </>
    );
};

export default ConditionalPublicLayout;