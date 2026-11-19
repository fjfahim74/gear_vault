import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = ({ className = "", ...props }: InputProps) => {
    return (
        <input
            className={`input input-bordered w-full ${className}`}
            {...props}
        />
    );
};

export default Input;