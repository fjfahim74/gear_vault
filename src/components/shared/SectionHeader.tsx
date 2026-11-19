type SectionHeaderProps = {
    title: string;
    subtitle?: string;
};

const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => {
    return (
        <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-base-content sm:text-3xl">
                {title}
            </h2>

            {subtitle && (
                <p className="mx-auto mt-3 max-w-2xl text-base text-base-content/60">
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default SectionHeader;