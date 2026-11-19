import { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

type ErrorStateProps = {
    title?: string;
    description?: string;
    action?: ReactNode;
};

const ErrorState = ({
    title = "Something went wrong",
    description = "We couldn't load the information. Please try again.",
    action,
}: ErrorStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="mb-4 h-12 w-12 text-error" />

            <h3 className="text-lg font-semibold text-base-content">
                {title}
            </h3>

            <p className="mt-2 max-w-md text-sm text-base-content/60">
                {description}
            </p>

            {action && <div className="mt-5">{action}</div>}
        </div>
    );
};

export default ErrorState;