import React from 'react';

interface CompanyLogoProps {
    className?: string;
    /** optional image source to use instead of the inline SVG */
    src?: string;
    /** alt text for the image when `src` is provided */
    alt?: string;
}

// CompanyLogo: renders an inline SVG by default, or an <img> when `src` is provided
export const CompanyLogo: React.FC<CompanyLogoProps> = ({ className, src, alt }) => {
    const sizeClass = className || 'h-8 w-8';

    if (src) {
        return <img src={src} alt={alt ?? 'Company logo'} className={`${sizeClass} object-contain`} />;
    }

    return (
        <svg
            className={sizeClass}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <circle cx="32" cy="32" r="30" fill="url(#g)" />
            <defs>
                <linearGradient id="g" x1="0" x2="1">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
            </defs>
            <path d="M22 18c-6 6-6 16-2 24 4 8 14 6 14 6s10 2 14-6c4-8 4-18-2-24-6-6-12-2-12-2s-6-4-12 2z" fill="white" opacity="0.95" />
            <path d="M32 26c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4z" fill="#6B21A8" opacity="0.9" />
        </svg>
    );
};

export default CompanyLogo;
