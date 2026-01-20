"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard', path: '/', icon: '📊' },
        { name: 'PDV', path: '/pdv', icon: '🛒' },
        { name: 'Mesas', path: '/mesas', icon: '🍽️' },
        { name: 'Cozinha', path: '/cozinha', icon: '🍳' },
        { name: 'Cardápio', path: '/cardapio', icon: '📜' },
        { name: 'Financeiro', path: '/financeiro', icon: '💰' },
        { name: 'QR Codes', path: '/qrcodes', icon: '📱' },
        { name: 'Ajustes', path: '/configuracoes', icon: '⚙️' },
    ];

    return (
        <aside className="w-16 md:w-56 glass flex flex-col p-3 gap-4 sticky top-4 h-[calc(100vh-2rem)] z-50 print:hidden overflow-y-auto scrollbar-hide">
            <div className="flex items-center gap-2 px-1 mb-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/30 text-white">
                        G
                    </div>
                    <span className="hidden md:block font-bold text-base tracking-tight text-white uppercase italic">Guarandrade</span>
                </Link>
            </div>

            <nav className="flex flex-col gap-1">
                {menuItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.path}
                        className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${pathname === item.path
                            ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <div className="w-5 text-lg flex justify-center">
                            {item.icon}
                        </div>
                        <span className="hidden md:block font-bold text-[11px] uppercase tracking-wider">{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="mt-auto">
                <div className="glass p-2.5 rounded-xl flex items-center gap-2 border border-white/5 bg-white/5">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500" />
                    <div className="hidden md:block overflow-hidden">
                        <p className="text-[10px] font-bold truncate text-white uppercase italic leading-none">Admin</p>
                        <p className="text-[8px] text-gray-500 truncate uppercase mt-0.5">Online</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
