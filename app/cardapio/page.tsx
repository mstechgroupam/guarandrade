"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';

const INITIAL_MENU = [
    { id: 1, name: 'X-Tudo', price: 25.90, category: 'Lanches', description: 'Pão, carne, ovo, bacon, queijo, presunto, alface e tomate.', status: 'Ativo' },
    { id: 2, name: 'Guaraná 350ml', price: 6.00, category: 'Bebidas', description: 'Lata gelada.', status: 'Ativo' },
    { id: 3, name: 'Batata Média', price: 15.00, category: 'Porções', description: 'Porção crocante de 300g.', status: 'Pausado' },
];

export default function Cardapio() {
    const [items, setItems] = useState(INITIAL_MENU);
    const [filter, setFilter] = useState('Todos');

    const categories = ['Todos', 'Lanches', 'Bebidas', 'Porções', 'Sobremesas'];

    return (
        <div className="flex h-screen p-4 gap-4">
            <Sidebar />

            <main className="flex-1 overflow-y-auto pr-2 space-y-6">
                <header className="flex justify-between items-center py-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">Cardápio Digital 📜</h1>
                        <p className="text-gray-400">Gerencie seus produtos, preços e disponibilidade.</p>
                    </div>
                    <button className="bg-indigo-600 px-6 py-2 rounded-xl font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20">
                        + Adicionar Item
                    </button>
                </header>

                {/* Categories Bar */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${filter === cat ? 'bg-white text-black' : 'glass text-gray-400 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Menu Table/Grid */}
                <div className="glass overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest font-bold">
                                <th className="p-4">Produto</th>
                                <th className="p-4">Categoria</th>
                                <th className="p-4">Preço</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {items
                                .filter(i => filter === 'Todos' || i.category === filter)
                                .map((item) => (
                                    <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-600/20 flex items-center justify-center text-xl">
                                                    {item.category === 'Lanches' ? '🍔' : item.category === 'Bebidas' ? '🥤' : '🍟'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white">{item.name}</p>
                                                    <p className="text-xs text-gray-500">{item.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-gray-300 bg-white/5 px-2 py-1 rounded-md">{item.category}</span>
                                        </td>
                                        <td className="p-4 font-bold text-indigo-400">
                                            R$ {item.price.toFixed(2)}
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${item.status === 'Ativo' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-3">
                                                <button className="text-gray-400 hover:text-white transition-colors">✏️</button>
                                                <button className="text-gray-400 hover:text-red-400 transition-colors">🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {/* Menu Insight Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass p-6 border-l-4 border-indigo-500">
                        <h4 className="font-bold text-lg mb-2 text-white">Destaque da Semana ⭐</h4>
                        <p className="text-sm text-gray-400">Seu <strong>X-Tudo</strong> teve um aumento de 15% nas vendas esta semana. Considere criar um combo!</p>
                    </div>
                    <div className="glass p-6 border-l-4 border-secondary">
                        <h4 className="font-bold text-lg mb-2 text-white">Item sem Saída 📉</h4>
                        <p className="text-sm text-gray-400">O <strong>Pastel de Vento</strong> não foi pedido nos últimos 7 dias. Deseja pausar no cardápio?</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
