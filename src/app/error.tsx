"use client";

import Link from "next/link";
import { AlertTriangle, Home, RefreshCw, Info } from "lucide-react";

const Error = ({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) => {
    return (
        <main className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-10">
            <div className="flex w-full max-w-xl flex-col items-center text-center">

                {/* Error Icon */}
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-500/15 text-red-600 ring-8 ring-red-500/5">
                    <AlertTriangle className="h-12 w-12" />
                </div>

                {/* Error Message */}
                <h1 className="text-3xl font-extrabold text-base-content sm:text-4xl">
                    Something Went Wrong!
                </h1>

                <p className="mt-3 max-w-md text-base text-base-content/60">
                    An unexpected error occurred. Please try again.
                </p>

                {/* Action Buttons */}
                <div className="mt-7 flex flex-wrap justify-center gap-3">

                    <button
                        onClick={() => reset()}
                        className="btn border-none bg-primary text-primary-content hover:brightness-95"
                    >
                        <RefreshCw className="h-5 w-5" />
                        Try Again
                    </button>

                    <Link href="/" className="btn btn-outline">
                        <Home className="h-5 w-5" />
                        Back to Home
                    </Link>
                </div>

                {/* Information Card */}
                <div className="mt-10 w-full overflow-hidden rounded-2xl border border-warning/30 bg-base-100 text-left shadow-lg">

                    {/* Card Header */}
                    <div className="flex items-center gap-3 border-b border-warning/20 bg-warning/10 px-5 py-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warning/20 text-warning">
                            <Info className="h-5 w-5" />
                        </div>

                        <div>
                            <h2 className="font-bold text-base-content">
                                Possible Temporary Connection Issue
                            </h2>
                            <p className="mt-0.5 text-xs text-base-content/50">
                                A little information about this error
                            </p>
                        </div>
                    </div>

                    {/* Card Content */}
                    <div className="space-y-4 p-5">
                        <p className="text-sm leading-relaxed text-base-content/70">
                            This error may be related to a temporary database
                            connection issue, such as{" "}
                            <span className="font-semibold text-warning">
                                MongoTopologyClosedError
                            </span>.
                        </p>

                        <div>
                            <h3 className="mb-2 text-sm font-bold text-base-content">
                                What should you do?
                            </h3>

                            <ul className="space-y-2 text-sm text-base-content/70">
                                Try refreshing the page using{" "}
                                <span className="inline-flex items-center gap-1 whitespace-nowrap">
                                    <span className="rounded border border-base-content/20 bg-base-200 px-2 py-1 text-xs font-semibold text-base-content">
                                        Ctrl
                                    </span>
                                    +
                                    <span className="rounded border border-base-content/20 bg-base-200 px-2 py-1 text-xs font-semibold text-base-content">
                                        Shift
                                    </span>
                                    +
                                    <span className="rounded border border-base-content/20 bg-base-200 px-2 py-1 text-xs font-semibold text-base-content">
                                        R
                                    </span>
                                </span>.
                            </ul>
                        </div>

                        <div className="border-t border-base-300 pt-3">
                            <p className="text-xs leading-relaxed text-base-content/50">
                                We apologize for the inconvenience and
                                appreciate your patience.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Error;