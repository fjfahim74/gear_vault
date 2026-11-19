import { Cog } from "lucide-react";

const Loading = () => {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 bg-base-200 px-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-content shadow-md">
                <Cog className="h-9 w-9 animate-spin" />
            </div>

            <div className="text-center">
                <h2 className="text-xl font-bold text-base-content">
                    GearVault
                </h2>

                <p className="mt-2 text-sm text-base-content/60">
                    Getting everything ready for you...
                </p>
            </div>
        </div>
    );
};

export default Loading;