import React from 'react';
import type { NavItem } from './types';

// Icons for the new patient dashboard navigation
const DashboardIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" }));
const LogIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" }));
const ChatbotIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }));

export const NAV_ITEMS: NavItem[] = [
    { id: 'dashboard', title: 'Dashboard', icon: React.createElement(DashboardIcon) },
    { id: 'log', title: 'Daily Log', icon: React.createElement(LogIcon) },
    { id: 'assistant', title: 'AI Assistant', icon: React.createElement(ChatbotIcon) },
];

// Mock signup dataset for testing and development
export const MOCK_SIGNUP_USERS = [
    {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        phone: '5551234567',
        password: 'SecurePass123!',
        dateOfBirth: '1990-03-15',
        gender: 'Female',
        asthmaType: 'Allergic Asthma',
        severity: 'Moderate',
        createdAt: '2025-11-01T10:30:00Z',
    },
    {
        id: '2',
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        phone: '5559876543',
        password: 'Password456@',
        dateOfBirth: '1985-07-22',
        gender: 'Male',
        asthmaType: 'Exercise-Induced',
        severity: 'Mild',
        createdAt: '2025-11-02T14:15:00Z',
    },
    {
        id: '3',
        name: 'Emma Williams',
        email: 'emma.williams@example.com',
        phone: '5552223333',
        password: 'Emma@Secure789',
        dateOfBirth: '1995-12-08',
        gender: 'Female',
        asthmaType: 'Occupational Asthma',
        severity: 'Moderate',
        createdAt: '2025-11-03T08:45:00Z',
    },
    {
        id: '4',
        name: 'James Rodriguez',
        email: 'james.rodriguez@example.com',
        phone: '5554445555',
        password: 'JamesRod@2024',
        dateOfBirth: '1988-05-30',
        gender: 'Male',
        asthmaType: 'Seasonal Asthma',
        severity: 'Severe',
        createdAt: '2025-11-04T11:20:00Z',
    },
    {
        id: '5',
        name: 'Lisa Anderson',
        email: 'lisa.anderson@example.com',
        phone: '5556667777',
        password: 'LisaAnd@123',
        dateOfBirth: '1992-09-12',
        gender: 'Female',
        asthmaType: 'Allergic Asthma',
        severity: 'Mild',
        createdAt: '2025-11-05T16:00:00Z',
    },
];