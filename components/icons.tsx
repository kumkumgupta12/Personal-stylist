
import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & { title?: string };

export const UploadIcon = ({ title, ...props }: IconProps) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    {title && <title>{title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

export const PersonIcon = ({ title, ...props }: IconProps) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

export const ShirtIcon = ({ title, ...props }: IconProps) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 16.5V13.5C16.5 11.0147 14.4853 9 12 9C9.51472 9 7.5 11.0147 7.5 13.5V16.5M16.5 16.5H7.5M16.5 16.5L18 21M7.5 16.5L6 21M12 9L15 3H9L12 9Z" />
    </svg>
);

export const PantsIcon = ({ title, ...props }: IconProps) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 16.5v4.5m0-4.5L7.5 3h9L15 16.5m-6 0h6m-6 0H4.5m1.5 4.5h12m-12 0H4.5m15 0h-1.5m-12 0v-4.5" />
    </svg>
);

export const TrashIcon = ({ title, ...props }: IconProps) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    {title && <title>{title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export const SparklesIcon = ({ title, ...props }: IconProps) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 13.5h.008v.008H18V13.5z" />
    </svg>
);

export const DownloadIcon = ({ title, ...props }: IconProps) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    {title && <title>{title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

export const DressIcon = ({ title, ...props }: IconProps) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    {title && <title>{title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 13-2.23-2.23a3.75 3.75 0 0 0-5.3 0L12 12.25l-1.47-1.48a3.75 3.75 0 0 0-5.3 0L3 13m18 0v7.5a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 20.5V13m18 0-4.5-9L12 2.25 7.5 4 3 13" />
  </svg>
);

export const ShoesIcon = ({ title, ...props }: IconProps) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5 6.436" />
    </svg>
);

export const SunglassesIcon = ({ title, ...props }: IconProps) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5C7.03 4.5 3 7.813 3 12c0 1.993.74 3.823 2 5.25M12 4.5c4.97 0 9 3.313 9 7.5 0 1.993-.74 3.823-2 5.25M12 4.5v15m0 0c-1.258 0-2.277-.38-3-1m3 1c1.258 0 2.277-.38 3-1m-6 0a2.25 2.25 0 0 1-2.25-2.25V15a2.25 2.25 0 0 1 2.25-2.25h.5a2.25 2.25 0 0 1 2.25 2.25v.75m-3 0h3m6 0a2.25 2.25 0 0 0 2.25-2.25V15a2.25 2.25 0 0 0-2.25-2.25h-.5a2.25 2.25 0 0 0-2.25 2.25v.75m3 0h-3" />
    </svg>
);

export const HatIcon = ({ title, ...props }: IconProps) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A5.25 5.25 0 0 1 12 4.5c-1.83 0-3.513.94-4.5 2.438m9 0a5.25 5.25 0 0 0-9 0m9 0c.39.39.754.824 1.078 1.298M6.362 5.214A5.25 5.25 0 0 1 9 6.938m0-1.724a5.25 5.25 0 0 0-2.638-1.724M12 21a2.25 2.25 0 0 0 2.25-2.25H9.75A2.25 2.25 0 0 0 12 21Zm0-12.75a5.25 5.25 0 0 1 5.25 5.25H6.75A5.25 5.25 0 0 1 12 8.25Z" />
    </svg>
);

export const NecklaceIcon = ({ title, ...props }: IconProps) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 0 0 9-9h-1.033A7.97 7.97 0 0 1 12 19.97V21Zm0-12a2.25 2.25 0 0 0-2.25 2.25c0 1.006.59 1.853 1.442 2.153a2.25 2.25 0 0 0 2.616 0A2.24 2.24 0 0 0 15 11.25 2.25 2.25 0 0 0 12 9Zm-9 3a9 9 0 0 0 9 9v-1.03A7.97 7.97 0 0 1 4.033 12H3Z" />
    </svg>
);

export const ArrowLeftIcon = ({ title, ...props }: IconProps) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    {title && <title>{title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);
