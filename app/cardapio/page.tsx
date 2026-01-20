"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabase';

export default function Cardapio() {
    const [items, setItems] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [activeFilter, setActiveFilter] = useState({ id: 'all', name: 'Todos' });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        const [productsRes, categoriesRes] = await Promise.all([
            supabase.from('products').select('*').order('name', { ascending: true }),
            supabase.from('categories').select('*').order('name')
        ]);

        if (productsRes.data) setItems(productsRes.data);
        if (categoriesRes.data) setCategories(categoriesRes.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleStatus = async (id: string, currentStatus: string) => {
        const nextStatus = currentStatus === 'Ativo' ? 'Pausado' : 'Ativo';
        await supabase.from('products').update({ status: nextStatus }).eq('id', id);
        fetchData();
    };

    const getProductIcon = (item: any) => {
        const cat = categories.find(c => c.id === item.category_id);
        return cat?.icon || '🍔';
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-black">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
        </div>
    );

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
                    <button
                        onClick={() => setActiveFilter({ id: 'all', name: 'Todos' })}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeFilter.id === 'all' ? 'bg-white text-black' : 'glass text-gray-400 hover:text-white'}`}
                    >
                        Todos
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveFilter(cat)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${activeFilter.id === cat.id ? 'bg-white text-black' : 'glass text-gray-400 hover:text-white'}`}
                        >
                            <span>{cat.icon}</span>
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Menu Table/Grid */}
                <div className="glass overflow-hidden border border-white/5">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                                <th className="p-4">Produto</th>
                                <th className="p-4">Preço</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {items.filter(i => activeFilter.id === 'all' || i.category_id === activeFilter.id).map((item) => (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                                {getProductIcon(item)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm">{item.name}</p>
                                                <p className="text-xs text-gray-500 line-clamp-1 max-w-xs">{item.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 font-bold text-indigo-400 whitespace-nowrap">
                                        R$ {parseFloat(item.price).toFixed(2).replace('.', ',')}
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => toggleStatus(item.id, item.status)}
                                            className={`text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-tighter transition-all ${item.status === 'Ativo' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                }`}
                                        >
                                            {item.status}
                                        </button>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center gap-4">
                                            <button className="text-gray-500 hover:text-white transition-colors">✏️</button>
                                            <button className="text-gray-500 hover:text-red-500 transition-colors">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
