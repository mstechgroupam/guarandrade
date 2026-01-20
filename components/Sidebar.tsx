"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard', path: '/', icon: '📊' },
        { name: 'Mesas', path: '/mesas', icon: '🍽️' },
        { name: 'Cozinha', path: '/cozinha', icon: '🍳' },
        { name: 'Cardápio', path: '/cardapio', icon: '📜' },
        { name: 'Financeiro', path: '/financeiro', icon: '💰' },
        { name: 'Configurações', path: '/configuracoes', icon: '⚙️' },
    ];

    return (
        <aside className="w-20 md:w-64 glass flex flex-col p-4 gap-6 sticky top-4 h-[calc(100vh-2rem)]">
            <div className="flex items-center gap-3 px-2 mb-8">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/30 text-white">
                        G
                    </div>
                    <span className="hidden md:block font-bold text-xl tracking-tight text-white">Guarandrade</span>
                </Link>
            </div>

            <nav className="flex flex-col gap-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.path}
                        className={`flex items-center gap-4 p-3 rounded-xl transition-all ${pathname === item.path
                                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <div className="w-6 text-xl flex justify-center">
                            {item.icon}
                        </div>
                        <span className="hidden md:block font-medium">{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="mt-auto">
                <div className="glass p-3 rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500" />
                    <div className="hidden md:block overflow-hidden">
                        <p className="text-sm font-semibold truncate text-white">Admin User</p>
                        <p className="text-xs text-gray-400 truncate">Gerente</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
