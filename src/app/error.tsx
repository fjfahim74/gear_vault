"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

const Error = ({
    error,
}: {
    error: Error & { digest?: string };
}) => {
    const router = useRouter();

    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center bg-base-200 px-4 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-error/10 text-error">
                <AlertTriangle className="h-10 w-10" />
            </div>

            <h1 className="text-3xl font-extrabold text-base-content">
                Something Went Wrong!
            </h1>

            <p className="mt-3 max-w-md text-base text-base-content/60">
                An unexpected error occurred. Please try again.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button onClick={() => router.refresh()}>
                    <RefreshCw className="h-5 w-5" />
                    Try Again
                </button>

                <Link href="/" className="btn btn-outline">
                    <Home className="h-5 w-5" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default Error;