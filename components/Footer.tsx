import React from 'react';

export const Footer: React.FC = () => {
    const year = new Date().getFullYear();
    return (
        <footer className="bg-white border-t border-slate-200 mt-8">
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold">AH</div>
                    <div>
                        <div className="text-sm font-semibold text-slate-900">Asthma Health</div>
                        <div className="text-xs text-slate-500">Better breathing through daily tracking</div>
                    </div>
                </div>

                <nav className="flex items-center gap-4">
                    <a className="text-xs text-slate-600 hover:text-slate-900" href="#">About</a>
                    <a className="text-xs text-slate-600 hover:text-slate-900" href="#">Privacy</a>
                    <a className="text-xs text-slate-600 hover:text-slate-900" href="#">Support</a>
                    <a className="text-xs text-slate-600 hover:text-slate-900" href="#">Contact</a>
                </nav>

                <div className="flex items-center gap-4">
                    <div className="text-sm text-slate-500">© {year} Asthma Health — All rights reserved</div>
                    <a
                        href="https://example.org/donate"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 inline-flex items-center px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        aria-label="Donate to support Asthma Health (opens in new tab)"
                    >
                        Donate
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
