import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
};

const Button = ({
    children,
    variant = "primary",
    size = "md",
    className = "",
    ...props
}: ButtonProps) => {
    const variants = {
        primary: "btn-primary",
        secondary: "btn-secondary",
        outline: "btn-outline",
        ghost: "btn-ghost",
    };

    const sizes = {
        sm: "btn-sm",
        md: "",
        lg: "btn-lg",
    };

    return (
        <button
            className={`btn ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;