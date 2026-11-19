type SkeletonProps = {
    className?: string;
};

const Skeleton = ({ className = "" }: SkeletonProps) => {
    return (
        <div
            className={`skeleton ${className}`}
            aria-hidden="true"
        />
    );
};

export default Skeleton;