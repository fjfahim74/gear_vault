import { ReactNode } from "react";

const Section = ({ children }: { children: ReactNode }) => {
    return (
        <section className="py-12 sm:py-16">
            {children}
        </section>
    );
};

export default Section;