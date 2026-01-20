"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabase';

const MENU_CATEGORIES = ['Todos', 'Lanches', 'Bebidas', 'Porções', 'Sobremesas'];

export default function PDV() {
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [tables, setTables] = useState<any[]>([]);
    const [cart, setCart] = useState<{ item: any, qty: number }[]>([]);
    const [selectedTable, setSelectedTable] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const [productsRes, tablesRes] = await Promise.all([
                supabase.from('products').select('*').eq('status', 'Ativo'),
                supabase.from('tables').select('*').order('id', { ascending: true })
            ]);

            if (productsRes.data) setMenuItems(productsRes.data);
            if (tablesRes.data) setTables(tablesRes.data);
        };
        fetchData();
    }, []);

    const addToCart = (item: any, quantity: number = 1) => {
        setCart(prev => {
            const existing = prev.find(c => c.item.id === item.id);
            if (existing) {
                return prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + quantity } : c);
            } else {
                return [...prev, { item, qty: quantity }];
            }
        });
    };

    const removeFromCart = (itemId: string) => {
        setCart(prev => prev.map(c => {
            if (c.item.id === itemId) return { ...c, qty: c.qty - 1 };
            return c;
        }).filter(c => c.qty > 0));
    };

    const total = cart.reduce((acc, curr) => acc + (curr.item.price * curr.qty), 0);

    const processVoiceCommand = (text: string) => {
        const words = text.toLowerCase();

        // 1. Table Matching
        const mesaMatch = words.match(/mesa (\d+)/);
        if (mesaMatch) {
            setSelectedTable(parseInt(mesaMatch[1]));
        }

        // 2. Quantity mapping
        const qtdMap: { [key: string]: number } = {
            'um': 1, 'uma': 1, 'dois': 2, 'duas': 2, 'três': 3, 'quatro': 4, 'cinco': 5,
            'seis': 6, 'sete': 7, 'oito': 8, 'nove': 9, 'dez': 10
        };

        // 3. Product matching with quantities
        menuItems.forEach(item => {
            const itemName = item.name.toLowerCase();
            if (words.includes(itemName)) {
                // Look for quantity before the product name
                const regex = new RegExp(`(\\w+)\\s+${itemName}|${itemName}`, 'g');
                let match;
                let foundAny = false;

                // Simple search for number keywords near product name
                Object.keys(qtdMap).forEach(key => {
                    if (words.includes(`${key} ${itemName}`) || words.includes(`${key} unidades de ${itemName}`)) {
                        addToCart(item, qtdMap[key]);
                        foundAny = true;
                    }
                });

                if (!foundAny) {
                    // Check for numeric digits
                    const digitMatch = words.match(new RegExp(`(\\d+)\\s+${itemName}`));
                    if (digitMatch) {
                        addToCart(item, parseInt(digitMatch[1]));
                    } else {
                        addToCart(item, 1);
                    }
                }
            }
        });
    };

    const finalizarPedido = async () => {
        if (!selectedTable || cart.length === 0) return;
        setIsSubmitting(true);

        try {
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    table_id: selectedTable,
                    status: 'fila',
                    total_amount: total
                })
                .select()
                .single();

            if (orderError) throw orderError;

            const itemsToInsert = cart.map(c => ({
                order_id: order.id,
                product_id: c.item.id,
                quantity: c.qty,
                unit_price: c.item.price
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(itemsToInsert);

            if (itemsError) throw itemsError;

            // Update table total (sum existing + new)
            const currentTable = tables.find(t => t.id === selectedTable);
            const newTotal = (parseFloat(currentTable?.total_amount || 0) + total);

            await supabase
                .from('tables')
                .update({ status: 'occupied', total_amount: newTotal })
                .eq('id', selectedTable);

            alert('Pedido enviado com sucesso para a cozinha! 🍳');
            setCart([]);
            setSelectedTable(null);
        } catch (error: any) {
            alert('Erro ao enviar pedido: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex h-screen p-4 gap-4 overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex gap-4">
                {/* Menu Section */}
                <section className="flex-1 flex flex-col gap-6">
                    <header className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-bold text-white">Novo Pedido 🍔</h1>
                            <button
                                onMouseDown={() => {
                                    const recognition = new (window as any).webkitSpeechRecognition();
                                    recognition.lang = 'pt-BR';
                                    recognition.start();
                                    (window as any).recognitionByVoz = recognition;
                                    document.getElementById('pdv-mic-status')?.classList.remove('hidden');
                                }}
                                onMouseUp={() => {
                                    const recognition = (window as any).recognitionByVoz;
                                    if (recognition) {
                                        recognition.stop();
                                        recognition.onresult = (event: any) => {
                                            const text = event.results[0][0].transcript;
                                            processVoiceCommand(text);
                                            document.getElementById('pdv-mic-status')?.classList.add('hidden');
                                        };
                                    }
                                }}
                                className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all text-white relative group"
                            >
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                                </span>
                                🎤
                            </button>
                            <span id="pdv-mic-status" className="hidden text-xs font-bold text-indigo-400 uppercase animate-pulse">Ouvindo Inteligência...</span>
                        </div>
                        <div className="flex gap-2">
                            {MENU_CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeCategory === cat ? 'bg-white text-black' : 'glass text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </header>

                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2 pb-4 scrollbar-hide">
                        {menuItems.filter(i => activeCategory === 'Todos' || i.category === activeCategory).map(item => (
                            <div
                                key={item.id}
                                onClick={() => addToCart(item)}
                                className="glass p-5 cursor-pointer hover:bg-white/5 active:scale-95 text-center flex flex-col items-center gap-4 group"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                                    {item.name.toLowerCase().includes('guaraná') || item.name.toLowerCase().includes('coca') ? '🥤' : '🍔'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-base">{item.name}</h4>
                                    <p className="text-indigo-400 font-bold mt-1">R$ {parseFloat(item.price).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Cart Section */}
                <aside className="w-80 md:w-96 glass flex flex-col overflow-hidden border-l border-white/5">
                    <div className="p-6 border-b border-white/5 bg-white/5">
                        <h3 className="font-bold text-xl text-white mb-4">Mesa Selecionada</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {tables.map(table => (
                                <button
                                    key={table.id}
                                    onClick={() => setSelectedTable(table.id)}
                                    className={`py-2 text-xs uppercase font-bold rounded-lg transition-all ${selectedTable === table.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40' :
                                            table.status === 'occupied' ? 'bg-red-500/10 text-red-500' :
                                                table.status === 'dirty' ? 'bg-yellow-500/10 text-yellow-500' :
                                                    'bg-white/5 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    {table.id}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {cart.map(c => (
                            <div key={c.item.id} className="flex justify-between items-center animate-fade-in">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">
                                        {c.item.name.toLowerCase().includes('guaraná') ? '🥤' : '🍔'}
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-bold text-white">{c.item.name}</h5>
                                        <p className="text-[10px] text-gray-500">R$ {parseFloat(c.item.price).toFixed(2)} un.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 glass p-1 rounded-lg">
                                    <button onClick={() => removeFromCart(c.item.id)} className="w-6 h-6 flex items-center justify-center font-bold text-red-400 hover:bg-red-500/10 rounded">-</button>
                                    <span className="text-sm font-bold text-white w-4 text-center">{c.qty}</span>
                                    <button onClick={() => addToCart(c.item)} className="w-6 h-6 flex items-center justify-center font-bold text-green-400 hover:bg-green-500/10 rounded">+</button>
                                </div>
                            </div>
                        ))}
                        {cart.length === 0 && (
                            <div className="text-center py-20 opacity-20 text-white">
                                <div className="text-6xl mb-4 text-indigo-500">🛒</div>
                                <p className="font-bold tracking-widest uppercase text-xs">Aguardando itens...</p>
                            </div>
                        )}
                    </div>

                    <div className="p-6 border-t border-white/5 bg-white/5 space-y-4">
                        <div className="flex justify-between items-center text-white">
                            <span className="text-gray-400 font-medium">Subtotal:</span>
                            <span className="text-3xl font-extrabold text-indigo-400">R$ {total.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <button
                            onClick={finalizarPedido}
                            disabled={cart.length === 0 || !selectedTable || isSubmitting}
                            className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-600/30 transition-all active:scale-95"
                        >
                            {isSubmitting ? 'ENVIANDO...' : 'LANÇAR PEDIDO'}
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}
