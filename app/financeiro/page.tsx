"use client";

import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function Financeiro() {
    const transactions = [
        { id: 1, type: 'receita', value: 42.90, method: 'PIX', date: 'Hoje, 14:20' },
        { id: 2, type: 'receita', value: 125.00, method: 'Cartão de Crédito', date: 'Hoje, 13:45' },
        { id: 3, type: 'despesa', value: 350.00, method: 'Fornecedor Carnes', date: 'Hoje, 11:00' },
        { id: 4, type: 'receita', value: 18.00, method: 'Dinheiro', date: 'Hoje, 10:30' },
    ];

    return (
        <div className="flex h-screen p-4 gap-4">
            <Sidebar />

            <main className="flex-1 overflow-y-auto pr-2 space-y-6">
                <header className="flex justify-between items-center py-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">Financeiro 💰</h1>
                        <p className="text-gray-400">Controle seu fluxo de caixa, despesas e lucros.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="glass px-4 py-2 text-sm font-bold text-red-400">Lançar Despesa</button>
                        <button className="bg-indigo-600 px-6 py-2 rounded-xl font-bold text-white">Relatório Mensal</button>
                    </div>
                </header>

                {/* Charts Mockup Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass p-6 flex flex-col items-center justify-center text-center gap-2">
                        <span className="text-gray-400 text-xs uppercase font-bold tracking-widest">Saldo Atual</span>
                        <h3 className="text-4xl font-bold text-white">R$ 4.250,80</h3>
                        <span className="text-green-400 text-xs font-bold">+R$ 850,20 hoje</span>
                    </div>
                    <div className="glass p-6 flex flex-col items-center justify-center text-center gap-2">
                        <span className="text-gray-400 text-xs uppercase font-bold tracking-widest">Contas a Pagar</span>
                        <h3 className="text-4xl font-bold text-red-400">R$ 1.120,00</h3>
                        <span className="text-gray-500 text-xs">Vencendo nos próximos 3 dias</span>
                    </div>
                    <div className="glass p-6 flex flex-col items-center justify-center text-center gap-2">
                        <span className="text-gray-400 text-xs uppercase font-bold tracking-widest">Lucro Estimado</span>
                        <h3 className="text-4xl font-bold text-green-400">32.5%</h3>
                        <span className="text-gray-500 text-xs">Margem média do mês</span>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="glass">
                    <div className="p-4 border-b border-white/5 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-white">Transações Recentes</h3>
                        <button className="text-indigo-400 text-sm font-bold">Ver Tudo</button>
                    </div>
                    <div className="divide-y divide-white/5">
                        {transactions.map(t => (
                            <div key={t.id} className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${t.type === 'receita' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {t.type === 'receita' ? '↑' : '↓'}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{t.method}</h4>
                                        <p className="text-xs text-gray-500">{t.date}</p>
                                    </div>
                                </div>
                                <div className={`font-bold ${t.type === 'receita' ? 'text-green-400' : 'text-red-400'}`}>
                                    {t.type === 'receita' ? '+' : '-'} R$ {t.value.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
