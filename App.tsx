import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Chatbot } from './components/Chatbot';
// import { LoginPage } from './components/LoginPage';
import { DashboardPage } from './components/DashboardPage';
import { DailyLogPage } from './components/DailyLogPage';
import { Footer } from './components/Footer';
import { NAV_ITEMS } from './constants';
import type { PageId } from './types';
import LoginPage from './components/LoginPage';

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activePage, setActivePage] = useState<PageId>('dashboard');
    const [currentUser, setCurrentUser] = useState<any>(null);
    
    const handleLoginSuccess = (user: any) => {
        setCurrentUser(user);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
        setActivePage('dashboard'); // Reset to default page
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-100">
                <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10">
                    <LoginPage onLoginSuccess={handleLoginSuccess} />
                </main>
                <Footer />
            </div>
        );
    }

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return <DashboardPage />;
            case 'log':
                return <DailyLogPage />;
            case 'assistant':
                return (
                    <div className="max-w-4xl mx-auto">
                        <Chatbot />
                    </div>
                );
            default:
                return <DashboardPage />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-100">
            <Navbar 
                navItems={NAV_ITEMS} 
                activePage={activePage} 
                setActivePage={setActivePage}
                onLogout={handleLogout} 
            />
            <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10">
                {renderContent()}
            </main>
            <Footer />
        </div>
    );
};

export default App;