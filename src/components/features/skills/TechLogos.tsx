'use client';

import React from 'react';

interface LogoProps {
  className?: string;
}

export const ReactLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="-11.5 -10.23174 23 20.46348" className={className}>
    <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
    <g stroke="#61DAFB" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
);

export const NextJsLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 180 180" className={className} fill="none">
    <mask height="180" id="mask0_next" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style={{ maskType: 'alpha' }}>
      <circle cx="90" cy="90" fill="black" r="90" />
    </mask>
    <g mask="url(#mask0_next)">
      <circle cx="90" cy="90" fill="currentColor" r="90" className="text-foreground" />
      <path
        d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
        fill="url(#paint0_linear_next)"
      />
      <rect fill="url(#paint1_linear_next)" height="72" width="12" x="115" y="54" />
    </g>
    <defs>
      <linearGradient id="paint0_linear_next" gradientUnits="userSpaceOnUse" x1="109" x2="144.5" y1="116.5" y2="160.5">
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="paint1_linear_next" gradientUnits="userSpaceOnUse" x1="121" x2="120.799" y1="54" y2="106.875">
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

export const TypeScriptLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 256 256" className={className}>
    <rect width="256" height="256" rx="40" fill="#3178C6" />
    <path
      d="M150.77 159.21c3.81 5.92 8.78 10.74 15.06 14.39 6.27 3.65 13.51 5.48 21.72 5.48 7.37 0 13.59-1.52 18.66-4.57 5.07-3.05 7.61-7.61 7.61-13.7 0-4.06-1.19-7.36-3.58-9.9-2.38-2.54-5.63-4.62-9.74-6.24-4.11-1.63-9.56-3.23-16.34-4.82-10.25-2.43-18.45-5.32-24.61-8.68-6.17-3.35-10.78-7.79-13.85-13.3-3.07-5.51-4.6-12.23-4.6-20.15 0-8.93 2.48-16.6 7.46-22.99 4.97-6.4 11.85-11.27 20.63-14.62 8.78-3.35 18.9-5.02 30.35-5.02 11.27 0 21.36 2.08 30.27 6.24 8.91 4.16 15.83 10.3 20.78 18.42l-18.11 11.72c-3.15-5.18-7.23-9.13-12.25-11.87-5.02-2.74-11.01-4.11-17.96-4.11-6.6 0-12.08 1.4-16.44 4.19-4.36 2.79-6.55 6.88-6.55 12.28 0 3.76 1.17 6.78 3.5 9.06 2.33 2.28 5.56 4.16 9.67 5.63 4.11 1.47 9.49 2.97 16.14 4.49 10.45 2.33 18.88 5.18 25.29 8.52 6.42 3.35 11.24 7.84 14.46 13.48 3.22 5.63 4.83 12.56 4.83 20.78 0 9.13-2.54 16.97-7.61 23.52-5.07 6.55-12.18 11.54-21.33 14.99-9.15 3.45-19.79 5.18-31.91 5.18-14.31 0-26.69-2.74-37.14-8.22-10.45-5.48-18.42-13.52-23.9-24.13l18.59-11.41zM50.44 87.52h64.83v20.08H85.49v94.66H62.77V107.6H50.44V87.52z"
      fill="#FFFFFF"
    />
  </svg>
);

export const JavaScriptLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 256 256" className={className}>
    <rect width="256" height="256" rx="40" fill="#F7DF1E" />
    <path
      d="M67.312 213.731l19.59-11.856c3.78 6.701 7.218 12.371 15.465 12.371 7.905 0 12.89-3.094 12.89-15.12v-81.798H139.5v82.141c0 24.917-14.606 36.259-35.916 36.259-19.245 0-30.416-9.967-36.272-21.997zm85.06-2.818l19.589-11.341c5.157 8.421 11.857 14.606 23.714 14.606 9.969 0 16.326-4.984 16.326-11.857 0-8.25-6.531-11.17-17.528-15.981l-6.013-2.58c-17.356-7.389-28.87-16.67-28.87-36.259 0-18.043 13.747-31.792 35.228-31.792 15.294 0 26.292 5.328 34.196 19.247l-18.731 12.03c-4.125-7.389-8.591-10.31-15.465-10.31-7.046 0-11.513 4.468-11.513 10.31 0 7.217 4.468 10.14 14.779 14.608l6.014 2.577c20.45 8.765 31.963 17.7 31.963 37.804 0 21.652-17.013 33.51-39.867 33.51-22.339 0-36.774-10.655-43.823-24.912z"
      fill="#000000"
    />
  </svg>
);

export const TailwindLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#06B6D4">
    <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.335 6.182 14.974 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.335 13.382 8.974 12 6.001 12z" />
  </svg>
);

export const FramerMotionLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" fill="#0055FF" />
  </svg>
);

export const ZustandLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#4338CA">
    <circle cx="12" cy="12" r="10" fill="#3730A3" />
    <circle cx="8" cy="10" r="2" fill="#FFFFFF" />
    <circle cx="16" cy="10" r="2" fill="#FFFFFF" />
    <circle cx="8" cy="10" r="1" fill="#1E1B4B" />
    <circle cx="16" cy="10" r="1" fill="#1E1B4B" />
    <path d="M9 15c1 1.5 5 1.5 6 0" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

export const Html5Logo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0z" fill="#E34F26" />
    <path d="M12 22l7.1-2.3L20.6 2H12v20z" fill="#EF652A" />
    <path d="M12 9.4H8.3l-.3-3.4H12V2.6H4.7l.8 10.2H12V9.4zm0 6.8l-.1.1-3.6-1-.2-2.7H4.7l.5 5.8 6.8 1.9v-4.1z" fill="#EBEBEB" />
    <path d="M12 2.6v3.4h3.7l-.3 3.4H12v3.4h7.1l-.8 9.3-6.3 1.7v4.1l6.8-1.9.1-.6 1.4-16.1.1-1.4.1-1.4H12z" fill="#FFFFFF" />
  </svg>
);

export const NodeJsLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="#339933">
    <path d="M16.002 1.503l-13.42 7.747v15.5l13.42 7.747 13.418-7.747v-15.5l-13.418-7.747zm0 2.887l10.916 6.302v12.616l-10.916 6.303-10.918-6.303v-12.616l10.918-6.302z" />
  </svg>
);

export const NestJsLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#E0234E">
    <path d="M11.996 0a12 12 0 0 0-3.8 23.385c.1-.482.253-1.077.37-1.492.21-.749.627-2.218 1.464-2.879.805-.636 1.657-.597 2.378-.328 1.488.556 2.678.027 3.518-.752 1.348-1.25 1.573-3.238.563-4.887-.768-1.253-2.124-2.029-3.593-1.92-2.17.16-3.88 1.83-4.048 3.99-.08.995.203 1.942.793 2.703-.31.393-.728.694-1.22.846-1.127.348-2.34-.144-2.863-1.16-.484-.94-.378-2.096.257-2.924.38-.495.942-.816 1.565-.892-.125-.975.148-1.956.76-2.732 1.107-1.405 2.87-2.155 4.67-1.97 2.676.275 4.84 2.253 5.343 4.887.494 2.585-.494 5.228-2.557 6.804-1.126.86-2.52 1.3-3.93 1.252a12.002 12.002 0 0 0 4.28-23.91z" />
  </svg>
);

export const PostgreSqlLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#4169E1">
    <path d="M12.02 0C5.38 0 0 5.38 0 12.02c0 6.64 5.38 12.02 12.02 12.02 6.64 0 12.02-5.38 12.02-12.02C24.04 5.38 18.66 0 12.02 0zm5.17 17.65c-.71.55-1.57.85-2.47.85-1.35 0-2.58-.67-3.32-1.78l-1.07 1.07c-.43.43-1.02.68-1.63.68-.62 0-1.2-.25-1.63-.68l-.48-.48c-.9-.9-.9-2.36 0-3.26l2.3-2.3c.43-.43 1.02-.68 1.63-.68.62 0 1.2.25 1.63.68l.84.84c.64-.53 1.45-.82 2.3-.82 1.03 0 2 .42 2.7 1.12.75.75 1.16 1.76 1.16 2.82 0 .73-.2 1.43-.56 2.05-.12.19-.28.37-.47.53z" />
  </svg>
);

export const PrismaLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#2D3748">
    <path d="M22.046 17.37L13.784 1.11C13.43.414 12.636 0 11.758 0c-.878 0-1.672.414-2.026 1.11L1.24 18.636c-.407.8-.32 1.757.228 2.476.547.72 1.44 1.138 2.378 1.138h16.308c.938 0 1.83-.418 2.378-1.138.548-.72.635-1.676.228-2.476l-.714-1.266zm-9.336-12.87l6.63 13.05H5.29l6.702-13.05h.718z" fill="#5A67D8" />
  </svg>
);

export const MongoDbLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M12.02 0c-.23 0-.46.06-.66.19C10.74.58 4.7 4.54 4.7 13.06c0 5.48 3.86 9.4 6.78 10.77.2.1.4.15.6.17.2-.02.4-.07.6-.17 2.92-1.37 6.78-5.29 6.78-10.77C19.46 4.54 13.42.58 12.8.19c-.22-.13-.48-.19-.78-.19zm-.06 2.05c.02 0 .04.01.06.01 4.53 3.65 5.56 8.35 5.56 11 0 4.14-2.8 7.37-5.07 8.65-.24-.95-.49-2.06-.49-3.23 0-2.31.95-4.48.95-6.66 0-3.32-1.01-6.75-1.01-9.77z" fill="#47A248" />
  </svg>
);

export const PythonLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 256 255" className={className}>
    <defs>
      <linearGradient id="python_a" x1="12.96" y1="12.04" x2="79.99" y2="79.08" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#387EB8" />
        <stop offset="1" stopColor="#366994" />
      </linearGradient>
      <linearGradient id="python_b" x1="174.5" y1="174.5" x2="242.5" y2="242.5" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#FFE052" />
        <stop offset="1" stopColor="#FFC331" />
      </linearGradient>
    </defs>
    <path d="M126.92 0C60.27 0 64.38 28.94 64.38 28.94L64.47 58.89H128V67.89H36.31C3.89 67.89 0 88.58 0 118.89C0 149.2 21.6 150.31 21.6 150.31H42.74V120.47C42.74 91.24 67.24 88.24 67.24 88.24H129.56C153.94 88.24 156.44 65.74 156.44 65.74V28.94C156.44 28.94 159.27 0 126.92 0ZM92.8 17.62C98.54 17.62 103.18 22.27 103.18 28C103.18 33.74 98.53 38.38 92.8 38.38C87.06 38.38 82.42 33.74 82.42 28C82.42 22.26 87.06 17.62 92.8 17.62Z" fill="url(#python_a)" />
    <path d="M129.08 254.99C195.73 254.99 191.62 226.05 191.62 226.05L191.53 196.1H128V187.1H219.69C252.11 187.1 256 166.41 256 136.1C256 105.79 234.4 104.68 234.4 104.68H213.26V134.52C213.26 163.75 188.76 166.75 188.76 166.75H126.44C102.06 166.75 99.56 189.25 99.56 189.25V226.05C99.56 226.05 96.73 254.99 129.08 254.99ZM163.2 237.37C157.46 237.37 152.82 232.72 152.82 226.99C152.82 221.25 157.47 216.61 163.2 216.61C168.94 216.61 173.58 221.25 173.58 226.99C173.58 232.73 168.94 237.37 163.2 237.37Z" fill="url(#python_b)" />
  </svg>
);

export const GitLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#F05032">
    <path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l3.291 3.292c.643-.22 1.386-.077 1.903.44.78.78.78 2.047 0 2.827-.781.78-2.047.78-2.828 0-.547-.547-.683-1.332-.408-1.99l-3.08-3.08v5.427c.43.283.746.73.87 1.26.24.974-.254 1.986-1.187 2.37-1.02.42-2.19-.07-2.61-1.09-.42-1.02.07-2.19 1.09-2.61.34-.14.71-.17 1.07-.1v-5.58c-.36-.07-.73-.04-1.07.1-1.02.42-2.19-.07-2.61-1.09-.42-1.02.07-2.19 1.09-2.61.51-.21 1.07-.22 1.58-.04L8.71 2.626 1.066 10.27c-.604.604-.604 1.582 0 2.188l10.48 10.478c.604.604 1.582.604 2.186 0l9.814-9.814c.604-.604.604-1.582 0-2.188z" />
  </svg>
);

export const DockerLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#2496ED">
    <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.714h2.118a.186.186 0 00.186-.185V9.006a.185.185 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186H8.1a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.136a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m-2.928 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H2.208a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m21.737-.348c-.31-.18-.95-.27-1.58-.09-.13-.76-.63-1.42-1.28-1.78l-.52-.29-.35.48c-.46.64-.69 1.4-.69 2.18 0 .42.07.84.21 1.23-.42.23-1.19.34-2.17.34H.216c-.12 0-.216.096-.216.216 0 1.9.38 3.73 1.13 5.44 1.09 2.5 2.94 3.74 5.51 3.74 5.73 0 10.02-3.26 12.18-8.79.97.06 1.95-.17 2.76-.66.86-.53 1.38-1.32 1.48-2.22.04-.37-.08-.73-.34-.99z" />
  </svg>
);

export const VercelLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M24 22.525H0l12-21.05 12 21.05z" />
  </svg>
);

export const AwsLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#FF9900">
    <path d="M18.793 14.868a8.625 8.625 0 01-5.698 1.402c-2.853 0-5.181-.976-6.99-2.926-.2-.218-.046-.462.204-.32 2.052 1.164 4.382 1.748 6.786 1.748 2.03 0 4.146-.425 6.347-1.275.297-.116.536.194.351.371v-.001zm1.258-.874c-.244-.313-1.614-.148-2.231-.073-.188.023-.217-.14-.047-.258 1.097-.768 2.894-.547 3.104-.287.21.26-.06 2.062-1.098 2.906-.159.13-.298.06-.219-.111.26-.563.736-1.864.491-2.177zM6.924 10.686c0-1.127.31-2.008.928-2.645.619-.637 1.464-.955 2.535-.955 1.05 0 1.883.313 2.498.94.614.627.922 1.51.922 2.65 0 1.14-.308 2.028-.922 2.665-.615.637-1.448.955-2.498.955-1.071 0-1.916-.318-2.535-.955-.618-.637-.928-1.525-.928-2.64zm1.536 0c0 .81.163 1.42.489 1.83.326.41.802.615 1.428.615.616 0 1.087-.205 1.413-.615.326-.41.489-1.02.489-1.83 0-.81-.163-1.418-.489-1.823-.326-.406-.797-.609-1.413-.609-.626 0-1.102.203-1.428.609-.326.405-.489 1.013-.489 1.823z" />
  </svg>
);

export const GcpLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" fill="#4285F4" />
  </svg>
);

export const KubernetesLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#326CE5">
    <path d="M11.968 0a1.868 1.868 0 00-.913.25L2.348 5.25a1.87 1.87 0 00-.936 1.621v9.998a1.87 1.87 0 00.936 1.621l8.707 5a1.87 1.87 0 001.87 0l8.707-5a1.87 1.87 0 00.936-1.621V6.871a1.87 1.87 0 00-.936-1.621l-8.707-5a1.87 1.87 0 00-.957-.25zm.032 3.12l6.504 3.734-1.92 1.11-4.584-2.632-4.583 2.632-1.92-1.11L12 3.12zm-7.666 5.48l1.92 1.11v5.263l-1.92 1.11V8.6zm15.332 0v7.483l-1.92-1.11v-5.263l1.92-1.11zM12 11.233l3.652 2.096-3.652 2.097-3.652-2.097L12 11.233zm-4.583 3.905l4.583 2.633 4.584-2.633 1.92 1.11-6.504 3.734-6.503-3.734 1.92-1.11z" />
  </svg>
);

export const PyTorchLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#EE4C2C">
    <path d="M12.63 0a11.96 11.96 0 00-6.19 1.72l4.8 4.8a5.2 5.2 0 014.28 1.48 5.24 5.24 0 010 7.41 5.24 5.24 0 01-7.41 0 5.24 5.24 0 010-7.41l1.7-1.7-4.8-4.8A12.01 12.01 0 000 12c0 6.63 5.37 12 12 12s12-5.37 12-12c0-6.42-5.04-11.66-11.37-12z" />
  </svg>
);

export const OpenAiLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 0010.596.5a6.046 6.046 0 00-5.772 4.195 5.979 5.979 0 00-3.991 2.9 6.046 6.046 0 00.743 7.097 5.98 5.98 0 00.51 4.911 6.051 6.051 0 006.515 2.9A5.985 5.985 0 0013.404 23.5a6.051 6.051 0 005.772-4.195 5.98 5.98 0 003.991-2.9 6.05 6.05 0 00-.885-6.584zm-8.878 12.18a4.524 4.524 0 01-2.735-.916l.11-.063 4.555-2.63a.774.774 0 00.387-.671v-6.42l1.928 1.113v5.82a4.54 4.54 0 01-4.245 3.767zm-8.948-4.228a4.51 4.51 0 01-.527-2.836l.11.065 4.555 2.63a.775.775 0 00.774 0l5.56-3.21v2.227l-5.04 2.91a4.543 4.543 0 01-5.432-1.786zm-1.684-9.378a4.524 4.524 0 012.208-1.92l-.001.127v5.26a.775.775 0 00.387.671l5.56 3.21-1.928 1.114-5.04-2.91a4.542 4.542 0 01-1.186-5.552zm15.42 3.19l-4.555-2.63a.775.775 0 00-.774 0l-5.56 3.21V9.948l5.04-2.91a4.544 4.544 0 015.85 7.337v-.792zm2.213-3.19a4.524 4.524 0 01-2.208 1.92V4.868a.775.775 0 00-.387-.671L12.25 1.012l1.928-1.113 5.04 2.91a4.542 4.542 0 011.186 5.552zM10.865 13.5l-2.433-1.405 2.433-1.405 2.434 1.405-2.434 1.405z" />
  </svg>
);

export const GeminiLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="gemini_g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1BA1E3" />
        <stop offset="50%" stopColor="#5B7FFF" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
    </defs>
    <path
      d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
      fill="url(#gemini_g)"
    />
  </svg>
);

export const FlutterLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#02569B">
    <path d="M14.314 0L2.3 12 6 15.7 21.684 0h-7.37zm7.37 11.488h-7.37L8.43 17.372 14.314 24h7.37l-5.885-6.628 5.885-5.884z" fill="#0175C2" />
  </svg>
);

export const DartLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#0175C2">
    <path d="M4.1 0L0 4.1l14.7 14.7L24 9.5 4.1 0zm15.8 19.9l-4.1 4.1-9.5-9.5 4.1-4.1 9.5 9.5z" />
  </svg>
);

export const FirebaseLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M3.89 15.67L6.25.96a.54.54 0 011.02-.15l3.24 6.1-6.62 8.76z" fill="#FFA000" />
    <path d="M13.82 8.52l2.12-4.04a.54.54 0 01.98.05l3.19 11.14-6.29-7.15z" fill="#F57C00" />
    <path d="M3.89 15.67l8.13 4.58a.54.54 0 00.52 0l7.57-4.58-6.3-7.15-9.92 7.15z" fill="#FFCA28" />
  </svg>
);

export const GsapLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#0AE448">
    <circle cx="12" cy="12" r="10" fill="#111" />
    <path d="M17 12c0 2.76-2.24 5-5 5s-5-2.24-5-5 2.24-5 5-5c1.4 0 2.65.57 3.55 1.48l-1.42 1.42A2.99 2.99 0 0012 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3h-3v-2h5z" fill="#0AE448" />
  </svg>
);

export const OpenCVLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <circle cx="12" cy="6" r="4" fill="#E2231A" />
    <circle cx="6" cy="16" r="4" fill="#00A859" />
    <circle cx="18" cy="16" r="4" fill="#1E88E5" />
    <circle cx="12" cy="6" r="2" fill="#FFFFFF" />
    <circle cx="6" cy="16" r="2" fill="#FFFFFF" />
    <circle cx="18" cy="16" r="2" fill="#FFFFFF" />
  </svg>
);

export const getBrandLogo = (name: string, className = 'w-4.5 h-4.5 shrink-0') => {
  const n = name.toLowerCase();

  if (n.includes('next.js')) return <NextJsLogo className={className} />;
  if (n.includes('react native')) return <ReactLogo className={className} />;
  if (n.includes('react')) return <ReactLogo className={className} />;
  if (n.includes('typescript')) return <TypeScriptLogo className={className} />;
  if (n.includes('javascript')) return <JavaScriptLogo className={className} />;
  if (n.includes('tailwind')) return <TailwindLogo className={className} />;
  if (n.includes('framer') || n.includes('motion')) return <FramerMotionLogo className={className} />;
  if (n.includes('zustand')) return <ZustandLogo className={className} />;
  if (n.includes('html') || n.includes('css')) return <Html5Logo className={className} />;
  if (n.includes('node')) return <NodeJsLogo className={className} />;
  if (n.includes('nest')) return <NestJsLogo className={className} />;
  if (n.includes('postgres') || n.includes('sql')) return <PostgreSqlLogo className={className} />;
  if (n.includes('prisma')) return <PrismaLogo className={className} />;
  if (n.includes('mongo')) return <MongoDbLogo className={className} />;
  if (n.includes('python')) return <PythonLogo className={className} />;
  if (n.includes('git')) return <GitLogo className={className} />;
  if (n.includes('docker') || n.includes('container')) return <DockerLogo className={className} />;
  if (n.includes('vercel') || n.includes('render')) return <VercelLogo className={className} />;
  if (n.includes('aws') || n.includes('s3')) return <AwsLogo className={className} />;
  if (n.includes('google cloud') || n.includes('azure') || n.includes('gcp')) return <GcpLogo className={className} />;
  if (n.includes('kubernetes') || n.includes('terraform')) return <KubernetesLogo className={className} />;
  if (n.includes('pytorch') || n.includes('tensorflow')) return <PyTorchLogo className={className} />;
  if (n.includes('openai')) return <OpenAiLogo className={className} />;
  if (n.includes('gemini')) return <GeminiLogo className={className} />;
  if (n.includes('flutter')) return <FlutterLogo className={className} />;
  if (n.includes('dart')) return <DartLogo className={className} />;
  if (n.includes('firebase')) return <FirebaseLogo className={className} />;
  if (n.includes('gsap')) return <GsapLogo className={className} />;
  if (n.includes('opencv') || n.includes('mediapipe') || n.includes('yolo') || n.includes('onnx')) return <OpenCVLogo className={className} />;

  // Default clean code symbol
  return <ReactLogo className={className} />;
};
