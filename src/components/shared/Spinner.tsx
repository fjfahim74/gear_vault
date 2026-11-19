type SpinnerProps = {
    size?: "sm" | "md" | "lg";
};

const Spinner = ({ size = "md" }: SpinnerProps) => {
    const sizes = {
        sm: "loading-sm",
        md: "loading-md",
        lg: "loading-lg",
    };

    return (
        <span
            className={`loading loading-spinner ${sizes[size]}`}
            role="status"
            aria-label="Loading"
        />
    );
};

export default Spinner;