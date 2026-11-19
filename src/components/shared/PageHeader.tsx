type PageHeaderProps = {
    title: string;
    subtitle?: string;
};

const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
    return (
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-base-content sm:text-3xl">
                {title}
            </h1>

            {subtitle && (
                <p className="mt-2 text-base text-base-content/60">
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default PageHeader;