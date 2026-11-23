import Link from "next/link";
import { Home, SearchX } from "lucide-react";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer";

const NotFound = () => {
    return (
        <>
            <Navbar />
            <div className="flex min-h-[70vh] flex-col items-center justify-center bg-base-200 px-4 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <SearchX className="h-10 w-10" />
                </div>

                <h1 className="text-7xl font-extrabold text-primary">
                    404
                </h1>

                <h2 className="mt-4 text-2xl font-bold text-base-content">
                    Page Not Found
                </h2>

                <p className="mt-3 max-w-md text-base text-base-content/60">
                    Sorry, the page you're looking for doesn't exist or may have
                    been moved.
                </p>

                <Link
                    href="/"
                    className="btn mt-8 border-none bg-primary text-primary-content shadow-sm hover:brightness-95"
                >
                    <Home className="h-5 w-5" />
                    Back to Home
                </Link>
            </div>
            <Footer />
        </>
    );
};

export default NotFound;