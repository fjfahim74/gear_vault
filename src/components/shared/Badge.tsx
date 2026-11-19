import { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
    variant?: "primary" | "success" | "warning" | "error" | "info" | "neutral";
};

const Badge = ({
    children,
    variant = "neutral",
    className = "",
    ...props
}: BadgeProps) => {
    const variants = {
        primary: "badge-primary",
        success: "badge-success",
        warning: "badge-warning",
        error: "badge-error",
        info: "badge-info",
        neutral: "badge-neutral",
    };

    return (
        <span
            className={`badge ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
};

export default Badge;