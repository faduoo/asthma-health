import React from 'react';
import CompanyLogo from './CompanyLogo';
import lungsLogo from '../lungs.png';
import type { NavItem, PageId } from '../types';

interface NavbarProps {
    navItems: NavItem[];
    activePage: PageId;
    setActivePage: (id: PageId) => void;
    onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ navItems, activePage, setActivePage, onLogout }) => {
    const SignOutIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    );

    const AIIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2M7.05 5.636l1.414 1.414M3 12h2M5.636 16.95l1.414-1.414M12 19v2M16.95 18.364l-1.414-1.414M19 12h2M18.364 7.05l-1.414 1.414M8 12a4 4 0 108 0 4 4 0 00-8 0z" />
        </svg>
    );

    return (
        <header className="w-full bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-3">
                            <div className="p-1 bg-white rounded-full shadow-sm ring-1 ring-slate-100">
                                <CompanyLogo src={lungsLogo} className="h-12 w-12" alt="Asthma Health logo" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-extrabold text-slate-800">ASTHMA HEALTH</h1>
                                <div className="text-xs text-slate-500">Clinical Respiratory Dashboard</div>
                            </div>
                        </div>
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                            <AIIcon />
                            <span className="ml-1">AI</span>
                        </span>
                    </div>
                    <div className="hidden md:flex items-center space-x-2">
                        <nav className="flex items-center space-x-2">
                            {navItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActivePage(item.id)}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                                        ${activePage === item.id
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'text-gray-600 hover:bg-slate-100 hover:text-gray-800'
                                        }`}
                                >
                                    {item.icon}
                                    <span>{item.title}</span>
                                </button>
                            ))}
                        </nav>
                         <div className="w-px h-6 bg-slate-200 mx-2"></div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-slate-500">Contact: <span className="font-medium text-slate-700">+91 97555-60123</span></div>
                            <button
                                onClick={onLogout}
                                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 transition-colors duration-200"
                                aria-label="Sign out"
                            >
                                <SignOutIcon />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                     <div className="md:hidden">
                        {/* Mobile menu button can be added here, for now we show all controls at bottom */}
                    </div>
                </div>
            </div>
             {/* Mobile navigation menu */}
            <nav className="md:hidden flex items-center justify-around p-2 border-t border-slate-200">
                 {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActivePage(item.id)}
                        className={`flex flex-col items-center space-y-1 p-2 rounded-md text-xs font-medium transition-colors duration-200 w-full
                            ${activePage === item.id
                                ? 'text-blue-600'
                                : 'text-gray-600'
                            }`}
                    >
                        {item.icon}
                        <span>{item.title}</span>
                    </button>
                ))}
                <button
                    onClick={onLogout}
                    className="flex flex-col items-center space-y-1 p-2 rounded-md text-xs font-medium text-gray-600 w-full"
                    aria-label="Sign out"
                >
                    <SignOutIcon />
                    <span>Sign Out</span>
                </button>
            </nav>
        </header>
    );
};