"use client";

import React from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

export default function Home() {
    const stats = [
        { label: 'Pedidos Hoje', value: '42', icon: '📝', color: 'text-blue-400' },
        { label: 'Mesas Ativas', value: '8/12', icon: '🍽️', color: 'text-green-400' },
        { label: 'Faturamento de Hoje', value: 'R$ 1.250,00', icon: '💰', color: 'text-purple-400' },
        { label: 'Tempo Médio', value: '18 min', icon: '⏱️', color: 'text-orange-400' },
    ];

    const tables = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        status: i % 3 === 0 ? 'occupied' : i % 5 === 0 ? 'dirty' : 'available',
        orders: i % 3 === 0 ? Math.floor(Math.random() * 5) + 1 : 0,
    }));

    return (
        <div className="flex h-screen p-4 gap-4">
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pr-2 space-y-6">
                {/* Header */}
                <header className="flex justify-between items-center py-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">Boas-vindas, Admin! 👋</h1>
                        <p className="text-gray-400">Aqui está o resumo do que está acontecendo no Guarandrade agora.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/pdv" className="glass px-4 py-2 text-sm font-medium hover:bg-white/10 text-white">Novo Pedido</Link>
                        <div className="glass w-10 h-10 flex items-center justify-center cursor-pointer text-white">🔔</div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <div key={i} className="glass p-5 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-2xl">{stat.icon}</div>
                                <div className={`text-xs font-bold uppercase tracking-wider ${stat.color}`}>+12%</div>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                            <p className="text-gray-400 text-sm">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Tables Grid */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Status das Mesas</h2>
                        <div className="flex gap-2 text-xs">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Livre</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Ocupada</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Limpeza</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {tables.map((table) => (
                            <div
                                key={table.id}
                                className={`glass p-4 text-center cursor-pointer hover:scale-105 active:scale-95 border-t-4 ${table.status === 'occupied' ? 'border-t-red-500' :
                                    table.status === 'dirty' ? 'border-t-yellow-500' : 'border-t-green-500'
                                    }`}
                            >
                                <div className="text-2xl mb-1 text-white">🪑</div>
                                <div className="font-bold text-lg mb-1 text-white">Mesa {table.id}</div>
                                {table.orders > 0 ? (
                                    <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                        {table.orders} Itens
                                    </span>
                                ) : (
                                    <span className="text-gray-500 text-[10px] uppercase font-bold">Livre</span>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-4">
                    {/* Recent Orders */}
                    <div className="glass p-5 lg:col-span-2">
                        <h3 className="text-lg font-bold mb-4 text-white">Pedidos Recentes</h3>
                        <div className="space-y-3">
                            {[1, 2, 3].map((order) => (
                                <div key={order} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">🍔</div>
                                        <div>
                                            <p className="font-semibold text-sm text-white">X-Tudo Especial + Guaraná</p>
                                            <p className="text-xs text-gray-400">Mesa 0{order} • 14:20</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm text-white">R$ 42,90</p>
                                        <p className="text-[10px] text-green-400 font-bold uppercase">Preparando</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions / Voice Order */}
                    <div className="glass p-5 bg-gradient-to-br from-indigo-600/10 to-transparent">
                        <h3 className="text-lg font-bold mb-4 text-white">Pedir por Voz 🎙️</h3>
                        <p className="text-sm text-gray-400 mb-6">Mantenha pressionado para falar um pedido rapidamente.</p>
                        <div className="flex flex-col items-center justify-center gap-4 py-4">
                            <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-3xl shadow-xl shadow-indigo-500/40 cursor-pointer hover:scale-110 active:scale-95 transition-all text-white">
                                🎤
                            </div>
                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest animate-pulse">Ouvindo...</span>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx>{`
        .glass-inner {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
        }
      `}</style>
        </div>
    );
}
