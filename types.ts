import React from 'react';

export interface NavItem {
    id: PageId;
    title: string;
    icon: React.ReactElement;
}

export type PageId = 'dashboard' | 'log' | 'assistant';

export interface ChatMessage {
    sender: 'user' | 'ai';
    text: string;
}

export interface Alert {
    id: number;
    level: 'red' | 'yellow' | 'green';
    title: string;
    description: string;
}