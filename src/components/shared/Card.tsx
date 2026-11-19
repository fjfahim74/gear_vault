import { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

const Card = ({ children, className = "", ...props }: CardProps) => {
    return (
        <div
            className={`card bg-base-100 border border-base-300 shadow-sm ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;