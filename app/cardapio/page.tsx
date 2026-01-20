"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabase';

export default function Cardapio() {
    const [items, setItems] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [activeFilter, setActiveFilter] = useState({ id: 'all', name: 'Todos' });
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category_id: '',
        status: 'Ativo'
    });

    const fetchData = async () => {
        const [productsRes, categoriesRes] = await Promise.all([
            supabase.from('products').select('*').order('name', { ascending: true }),
            supabase.from('categories').select('*').order('name')
        ]);

        if (productsRes.data) setItems(productsRes.data);
        if (categoriesRes.data) {
            setCategories(categoriesRes.data);
            if (categoriesRes.data.length > 0 && !formData.category_id) {
                setFormData(prev => ({ ...prev, category_id: categoriesRes.data[0].id }));
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleStatus = async (id: string, currentStatus: string) => {
        const nextStatus = currentStatus === 'Ativo' ? 'Pausado' : 'Ativo';
        const { error } = await supabase.from('products').update({ status: nextStatus }).eq('id', id);
        if (error) {
            alert('Erro ao atualizar status: ' + error.message);
        } else {
            fetchData();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
            alert('Erro ao excluir: ' + error.message);
        } else {
            fetchData();
        }
    };

    const handleOpenModal = (item: any = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                description: item.description || '',
                price: item.price.toString().replace('.', ','),
                category_id: item.category_id,
                status: item.status
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category_id: categories[0]?.id || '',
                status: 'Ativo'
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const priceClean = formData.price.replace(',', '.');
        const payload = {
            name: formData.name,
            description: formData.description,
            price: parseFloat(priceClean),
            category_id: formData.category_id,
            status: formData.status
        };

        if (isNaN(payload.price)) {
            alert('Por favor, insira um preço válido.');
            return;
        }

        let error;
        if (editingItem) {
            const res = await supabase.from('products').update(payload).eq('id', editingItem.id);
            error = res.error;
        } else {
            const res = await supabase.from('products').insert([payload]);
            error = res.error;
        }

        if (error) {
            alert('Erro ao salvar: ' + error.message);
        } else {
            setIsModalOpen(false);
            fetchData();
        }
    };

    const getProductIcon = (item: any) => {
        const cat = categories.find(c => c.id === item.category_id);
        return cat?.icon || '🍔';
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-[#050505]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="flex h-screen p-4 gap-4 bg-[#050505] overflow-hidden">
            <Sidebar />

            <main className="flex-1 overflow-y-auto pr-2 space-y-6">
                <header className="flex justify-between items-center py-2">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Cardápio Digital 📜</h1>
                        <p className="text-sm text-gray-400">Gerencie seus produtos e preços.</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-indigo-600 px-5 py-2.5 rounded-xl font-bold text-white hover:bg-indigo-500 shadow-lg text-sm transition-all"
                    >
                        + Adicionar Item
                    </button>
                </header>

                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                    <button
                        onClick={() => setActiveFilter({ id: 'all', name: 'Todos' })}
                        className={`px-5 py-2 rounded-xl text-xs font-bold uppercase transition-all ${activeFilter.id === 'all' ? 'bg-white text-black' : 'glass text-gray-500 hover:text-white'}`}
                    >
                        Todos
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveFilter(cat)}
                            className={`px-5 py-2 rounded-xl text-xs font-bold uppercase flex items-center gap-2 transition-all ${activeFilter.id === cat.id ? 'bg-white text-black shadow-lg' : 'glass text-gray-500 hover:text-white'}`}
                        >
                            <span>{cat.icon}</span>
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className="glass overflow-hidden border border-white/5 rounded-2xl bg-white/5">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-gray-500 text-[10px] uppercase font-bold tracking-wider">
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
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
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
                                            className={`text-[9px] font-bold uppercase px-3 py-1 rounded-full transition-all border ${item.status === 'Ativo' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}
                                        >
                                            {item.status}
                                        </button>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center gap-3">
                                            <button onClick={() => handleOpenModal(item)} className="text-gray-400 hover:text-white transition-colors">✏️</button>
                                            <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* MODAL REFEITO - CORREÇÃO DE TAMANHO E SOBREPOSIÇÃO */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="glass w-full max-w-md bg-[#121212] overflow-hidden border border-white/10 shadow-2xl rounded-2xl animate-fade-in">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">
                                {editingItem ? 'Editar Produto' : 'Novo Produto'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white text-xl">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1.5 ml-1">Nome do Produto</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-600 transition-all text-sm font-medium"
                                        placeholder="Digite o nome..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1.5 ml-1">Preço (R$)</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-600 transition-all text-sm font-bold"
                                            placeholder="0,00"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1.5 ml-1">Categoria</label>
                                        <select
                                            value={formData.category_id}
                                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-600 transition-all text-sm font-bold appearance-none"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id} className="bg-[#121212]">{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1.5 ml-1">Descrição</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-600 transition-all text-xs font-medium h-24 resize-none"
                                        placeholder="Breve descrição do produto..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 glass py-3.5 rounded-xl font-bold text-xs uppercase text-gray-400 hover:text-white"
                                >Cancelar</button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-indigo-600 py-3.5 rounded-xl font-bold text-white shadow-lg hover:bg-indigo-500 uppercase text-xs"
                                >Salvar Produto</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
