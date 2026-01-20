"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';

const MENU_CATEGORIES = ['Todos', 'Lanches', 'Bebidas', 'Porções', 'Sobremesas'];

const MENU_ITEMS = [
    { id: 1, name: 'X-Tudo', price: 25.90, category: 'Lanches', icon: '🍔' },
    { id: 2, name: 'X-Bacon', price: 22.90, category: 'Lanches', icon: '🥓' },
    { id: 3, name: 'Guaraná Antarctica 350ml', price: 6.00, category: 'Bebidas', icon: '🥤' },
    { id: 4, name: 'Suco Natural Laranja', price: 10.00, category: 'Bebidas', icon: '🍊' },
    { id: 5, name: 'Batata Frita M', price: 15.00, category: 'Porções', icon: '🍟' },
    { id: 6, name: 'Calabresa Acebolada', price: 28.00, category: 'Porções', icon: '🍖' },
    { id: 7, name: 'Pudim de Leite', price: 12.00, category: 'Sobremesas', icon: '🍮' },
    { id: 8, name: 'Milk Shake Ovomaltine', price: 18.00, category: 'Sobremesas', icon: '🥤' },
];

export default function PDV() {
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [cart, setCart] = useState<{ item: any, qty: number }[]>([]);
    const [selectedTable, setSelectedTable] = useState<string | null>(null);

    const addToCart = (item: any) => {
        const existing = cart.find(c => c.item.id === item.id);
        if (existing) {
            setCart(cart.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c));
        } else {
            setCart([...cart, { item, qty: 1 }]);
        }
    };

    const removeFromCart = (itemId: number) => {
        setCart(cart.map(c => {
            if (c.item.id === itemId) return { ...c, qty: c.qty - 1 };
            return c;
        }).filter(c => c.qty > 0));
    };

    const total = cart.reduce((acc, curr) => acc + (curr.item.price * curr.qty), 0);

    const filteredItems = activeCategory === 'Todos'
        ? MENU_ITEMS
        : MENU_ITEMS.filter(i => i.category === activeCategory);

    return (
        <div className="flex h-screen p-4 gap-4 overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex gap-4">
                {/* Menu Section */}
                <section className="flex-1 flex flex-col gap-6">
                    <header className="flex justify-between items-center py-2">
                        <h1 className="text-3xl font-bold text-white">Novo Pedido 🍔</h1>
                        <div className="flex gap-2">
                            {MENU_CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeCategory === cat ? 'bg-white text-black' : 'glass text-gray-400'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </header>

                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2 pb-4">
                        {filteredItems.map(item => (
                            <div
                                key={item.id}
                                onClick={() => addToCart(item)}
                                className="glass p-4 cursor-pointer hover:bg-white/5 active:scale-95 text-center flex flex-col items-center gap-3"
                            >
                                <div className="text-4xl">{item.icon}</div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">{item.name}</h4>
                                    <p className="text-indigo-400 font-bold">R$ {item.price.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Cart Section */}
                <aside className="w-80 md:w-96 glass flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-white/5">
                        <h3 className="font-bold text-xl text-white mb-4">Resumo do Pedido</h3>
                        <div className="flex gap-2 mb-2">
                            {['Mesa 01', 'Mesa 02', 'Mesa 03', 'Mesa 04'].map(m => (
                                <button
                                    key={m}
                                    onClick={() => setSelectedTable(m)}
                                    className={`flex-1 py-1 text-[10px] uppercase font-bold rounded ${selectedTable === m ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400'
                                        }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {cart.map(c => (
                            <div key={c.item.id} className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-lg">{c.item.icon}</div>
                                    <div>
                                        <h5 className="text-sm font-bold text-white">{c.item.name}</h5>
                                        <p className="text-[10px] text-gray-400">R$ {c.item.price.toFixed(2)} x {c.qty}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => removeFromCart(c.item.id)} className="w-6 h-6 glass flex items-center justify-center font-bold text-red-400">-</button>
                                    <span className="text-sm font-bold">{c.qty}</span>
                                    <button onClick={() => addToCart(c.item.item || c.item)} className="w-6 h-6 glass flex items-center justify-center font-bold text-green-400">+</button>
                                </div>
                            </div>
                        ))}
                        {cart.length === 0 && (
                            <div className="text-center py-20 opacity-30">
                                <div className="text-4xl mb-2">🛒</div>
                                <p>Carrinho vazio</p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-white/5 bg-white/5 space-y-4">
                        <div className="flex justify-between items-center text-white">
                            <span className="text-gray-400">Total:</span>
                            <span className="text-2xl font-bold">R$ {total.toFixed(2)}</span>
                        </div>
                        <button
                            disabled={cart.length === 0 || !selectedTable}
                            className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20"
                        >
                            FINALIZAR PEDIDO
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}
