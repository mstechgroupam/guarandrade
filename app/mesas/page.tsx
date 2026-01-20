"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabase';

export default function Mesas() {
    const router = useRouter();
    const [tables, setTables] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [receiptModal, setReceiptModal] = useState<any>(null);

    const fetchTables = async () => {
        const { data, error } = await supabase
            .from('tables')
            .select('*')
            .order('id', { ascending: true });

        if (!error && data) {
            setTables(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTables();

        const channel = supabase
            .channel('public:tables')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tables' }, () => {
                fetchTables();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleOpenReceipt = async (table: any) => {
        if (table.status !== 'occupied') return;

        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    *,
                    products (name)
                )
            `)
            .eq('table_id', table.id)
            .neq('status', 'finalizado');

        if (data && data.length > 0) {
            const allItems = data.flatMap(o => o.order_items);
            const totalAmount = data.reduce((acc, curr) => acc + Number(curr.total_amount), 0);

            setReceiptModal({
                table,
                order: { items: allItems, total_amount: totalAmount, originalOrders: data }
            });
        } else {
            alert('Não foi possível encontrar um pedido ativo para esta mesa.');
        }
    };

    const handleFecharConta = async () => {
        if (!receiptModal) return;

        const { table, order } = receiptModal;
        const orderIds = order.originalOrders.map((o: any) => o.id);

        try {
            await supabase
                .from('orders')
                .update({ status: 'finalizado' })
                .in('id', orderIds);

            await supabase
                .from('tables')
                .update({ status: 'dirty', total_amount: 0 })
                .eq('id', table.id);

            setReceiptModal(null);
            fetchTables();
            alert(`Mesa ${table.id} fechada com sucesso! 💰`);
        } catch (err) {
            alert('Erro ao fechar conta.');
        }
    };

    const handleLiberarMesa = async (id: number) => {
        const { error } = await supabase
            .from('tables')
            .update({ status: 'available' })
            .eq('id', id);

        if (!error) fetchTables();
    };

    const handleAddItems = (tableId: number) => {
        router.push(`/pdv?table=${tableId}`);
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-[#050505] text-white">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="flex h-screen p-4 gap-4 bg-[#050505] overflow-hidden">
            <Sidebar />

            <main className="flex-1 overflow-y-auto pr-2 space-y-6">
                <header className="flex justify-between items-center py-2">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1 uppercase tracking-tight italic">Gestão de Mesas 🍽️</h1>
                        <p className="text-xs text-gray-400">Gerencie a disponibilidade das mesas.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {tables.map(table => (
                        <div
                            key={table.id}
                            className="glass p-5 flex flex-col gap-4 relative overflow-hidden border border-white/5 bg-white/5 transition-all"
                        >
                            <div className={`absolute top-0 right-0 w-1.5 h-full ${table.status === 'occupied' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' :
                                table.status === 'dirty' ? 'bg-yellow-500' : 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                                }`} />

                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-white uppercase italic">{table.name}</h3>
                                    <span className={`text-[9px] font-bold uppercase tracking-widest ${table.status === 'occupied' ? 'text-red-400' :
                                        table.status === 'dirty' ? 'text-yellow-400' : 'text-green-400'
                                        }`}>
                                        {table.status === 'occupied' ? 'Ocupada' :
                                            table.status === 'dirty' ? 'Limpeza' : 'Livre'}
                                    </span>
                                </div>
                                <div className="text-3xl">
                                    {table.status === 'occupied' ? '🔥' : table.status === 'dirty' ? '🧹' : '🏠'}
                                </div>
                            </div>

                            <div className="flex-1">
                                {table.status === 'occupied' ? (
                                    <div className="space-y-1">
                                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Total Acumulado:</p>
                                        <p className="text-2xl font-bold text-indigo-400 tracking-tight">R$ {parseFloat(table.total_amount).toFixed(2).replace('.', ',')}</p>
                                    </div>
                                ) : (
                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tight opacity-40">Livre</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-2 mt-2">
                                {table.status === 'occupied' ? (
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => handleAddItems(table.id)}
                                            className="bg-indigo-600/10 text-indigo-400 py-2.5 rounded-xl font-bold text-[9px] uppercase border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all"
                                        >
                                            + Lançar Itens
                                        </button>
                                        <button
                                            onClick={() => handleOpenReceipt(table)}
                                            className="bg-red-600/10 text-red-400 py-2.5 rounded-xl font-bold text-[9px] uppercase border border-red-500/20 hover:bg-red-600 hover:text-white transition-all"
                                        >
                                            Ver / Fechar
                                        </button>
                                    </div>
                                ) : table.status === 'dirty' ? (
                                    <button
                                        onClick={() => handleLiberarMesa(table.id)}
                                        className="bg-yellow-600/10 text-yellow-400 py-2.5 rounded-xl font-bold text-[9px] uppercase border border-yellow-500/20 hover:bg-yellow-500 hover:text-black transition-all"
                                    >
                                        Liberar Mesa
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleAddItems(table.id)}
                                        className="bg-green-600/10 text-green-400 py-2.5 rounded-xl font-bold text-[9px] uppercase border border-green-500/20 hover:bg-green-600 hover:text-white transition-all shadow-lg shadow-green-600/10"
                                    >
                                        Abrir Mesa
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Receipt Modal */}
            {receiptModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
                >
                    <div className="glass w-full max-w-sm overflow-hidden animate-fade-in shadow-2xl border border-white/10 bg-[#0A0A0A] rounded-2xl">
                        <div className="p-6 border-b border-white/5 text-center relative">
                            <button
                                onClick={() => setReceiptModal(null)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-white"
                            >✕</button>
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight italic">Resumo Consumo</h2>
                            <p className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">{receiptModal.table.name}</p>
                        </div>

                        <div className="p-6 space-y-3 max-h-[40vh] overflow-y-auto scrollbar-hide">
                            {receiptModal.order.items.map((item: any, i: number) => (
                                <div key={i} className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                                    <div>
                                        <p className="text-white font-bold">{item.quantity}x {item.products.name}</p>
                                        <p className="text-[9px] text-gray-500">R$ {parseFloat(item.unit_price).toFixed(2).replace('.', ',')}</p>
                                    </div>
                                    <span className="text-white font-bold">R$ {(item.quantity * item.unit_price).toFixed(2).replace('.', ',')}</span>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 bg-white/5 space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest leading-none mb-1">Total:</span>
                                <span className="text-3xl font-bold text-white italic">R$ {parseFloat(receiptModal.order.total_amount).toFixed(2).replace('.', ',')}</span>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <button
                                    onClick={() => { handleAddItems(receiptModal.table.id); setReceiptModal(null); }}
                                    className="bg-indigo-600/10 text-indigo-400 py-3 rounded-xl font-bold text-[10px] uppercase border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition-all"
                                >
                                    + Adicionar Itens
                                </button>
                                <button
                                    onClick={() => handleFecharConta()}
                                    className="bg-green-600 py-4 rounded-xl font-bold text-white shadow-xl hover:bg-green-500 uppercase tracking-widest text-[11px]"
                                >
                                    Fechar Conta 💰
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
