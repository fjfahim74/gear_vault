import { ReactNode } from "react";
import { Inbox } from "lucide-react";

type EmptyStateProps = {
    title: string;
    description?: string;
    action?: ReactNode;
};

const EmptyState = ({
    title,
    description,
    action,
}: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <Inbox className="mb-4 h-12 w-12 text-base-content/40" />

            <h3 className="text-lg font-semibold text-base-content">
                {title}
            </h3>

            {description && (
                <p className="mt-2 max-w-md text-sm text-base-content/60">
                    {description}
                </p>
            )}

            {action && <div className="mt-5">{action}</div>}
        </div>
    );
};

export default EmptyState;