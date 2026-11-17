const Footer = () => {
    return (
        <footer className="border-t border-base-300 bg-base-100">
            <div className="mx-auto max-w-7xl px-4 py-10">

                <div className="grid grid-cols-1 gap-8 md:grid-cols-4 items-start">

                    {/* Column 1: Logo and Description */}
                    <div className="flex flex-col items-start space-y-3">
                        <h2 className="text-xl font-bold leading-none text-green-700">
                            Eventify
                        </h2>

                        <p className="text-sm text-base-content/70">
                            Together, we can make a difference in our community.
                        </p>

                        <div className="flex items-center gap-1.5 text-xs text-base-content/65 pt-1">
                            <span>📍</span>
                            <span>Nationwide Impact</span>
                        </div>
                    </div>

                    {/* Column 2: Explore Platform */}
                    <div className="flex flex-col space-y-3">
                        <h3 className="text-xs font-bold tracking-wider text-base-content uppercase">
                            Explore Platform
                        </h3>

                        <div className="flex flex-col space-y-2 text-sm">
                            <a href="/" className="text-base-content/70 hover:text-emerald-500 transition-colors">
                                Home
                            </a>
                            <a href="/upcoming-events" className="text-base-content/70 hover:text-emerald-500 transition-colors">
                                Upcoming Events
                            </a>
                            <a href="/sign-up" className="text-base-content/70 hover:text-emerald-500 transition-colors">
                                Join Us
                            </a>
                        </div>
                    </div>

                    {/* Column 3: Active Causes */}
                    <div className="flex flex-col space-y-3">
                        <h3 className="text-xs font-bold tracking-wider text-base-content uppercase">
                            Active Causes
                        </h3>

                        <div className="flex flex-col space-y-2 text-sm text-base-content/70">
                            <span>🟢 Winter Clothes & Blanket Relief</span>
                            <span>🟢 City Clean-up & Waste Segregation</span>
                            <span>🟠 Underprivileged Meal Sharing</span>
                        </div>
                    </div>

                    {/* Column 4: Community */}
                    <div className="flex flex-col space-y-3">
                        <h3 className="text-xs font-bold tracking-wider text-base-content uppercase">
                            Community Spirit
                        </h3>

                        <p className="text-sm text-base-content/70">
                            Every small action counts. Connect with local volunteers and turn compassion into direct community aid.
                        </p>

                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">
                                🌍 100% Volunteer Driven
                            </span>
                        </div>
                    </div>

                </div>

                {/* Divider */}
                <div className="mt-8 border-t border-base-200 pt-6"></div>

                {/* Copyright */}
                <div className="flex items-center justify-center text-center text-xs text-base-content/60">
                    <p>© 2026 Eventify. All rights reserved.</p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;