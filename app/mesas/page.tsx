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
            .neq('status', 'finalizado')
            .single();

        if (data) {
            setReceiptModal({ table, order: data });
        } else {
            alert('Não foi possível encontrar um pedido ativo para esta mesa.');
        }
    };

    const handleFecharConta = async () => {
        if (!receiptModal) return;

        const { table, order } = receiptModal;

        // 1. Finalizar Pedido
        await supabase
            .from('orders')
            .update({ status: 'finalizado' })
            .eq('id', order.id);

        // 2. Marcar Mesa para Limpeza
        await supabase
            .from('tables')
            .update({ status: 'dirty', total_amount: 0 })
            .eq('id', table.id);

        setReceiptModal(null);
        alert(`Mesa ${table.id} fechada com sucesso! 💰`);
    };

    const handleLiberarMesa = async (id: number) => {
        const { error } = await supabase
            .from('tables')
            .update({ status: 'available' })
            .eq('id', id);

        if (!error) fetchTables();
    };

    const handleTableClick = (table: any) => {
        if (table.status === 'occupied') {
            handleOpenReceipt(table);
        } else if (table.status === 'dirty') {
            handleLiberarMesa(table.id);
        } else {
            router.push('/pdv');
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-black text-white">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl"></div>
                <p className="font-bold tracking-widest uppercase text-xs">Carregando Guarandrade...</p>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen p-4 gap-4">
            <Sidebar />

            <main className="flex-1 overflow-y-auto pr-2 space-y-6">
                <header className="flex justify-between items-center py-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">Gestão de Mesas 🍽️</h1>
                        <p className="text-gray-400">Monitore, abra e feche contas em tempo real.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {tables.map(table => (
                        <div
                            key={table.id}
                            onClick={() => handleTableClick(table)}
                            className="glass p-6 flex flex-col gap-4 relative overflow-hidden group cursor-pointer hover:bg-white/5 active:scale-95 transition-all"
                        >
                            <div className={`absolute top-0 right-0 w-2 h-full ${table.status === 'occupied' ? 'bg-red-500' :
                                table.status === 'dirty' ? 'bg-yellow-500' : 'bg-green-500'
                                }`} />

                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{table.name}</h3>
                                    <span className={`text-[10px] font-bold uppercase ${table.status === 'occupied' ? 'text-red-400' :
                                        table.status === 'dirty' ? 'text-yellow-400' : 'text-green-400'
                                        }`}>
                                        {table.status === 'occupied' ? 'Ocupada' :
                                            table.status === 'dirty' ? 'Limpeza' : 'Disponível'}
                                    </span>
                                </div>
                                <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">
                                    {table.status === 'occupied' ? '🍔' : table.status === 'dirty' ? '🧹' : '✅'}
                                </div>
                            </div>

                            <div className="flex-1">
                                {table.status === 'occupied' ? (
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-400">Total Acumulado:</p>
                                        <p className="text-2xl font-bold text-indigo-400">R$ {parseFloat(table.total_amount).toFixed(2).replace('.', ',')}</p>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-500 italic">Mesa pronta para novos clientes.</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-2 mt-2">
                                {table.status === 'occupied' ? (
                                    <button
                                        className="bg-red-600/20 text-red-400 py-3 rounded-xl font-bold text-xs uppercase border border-red-500/20 group-hover:bg-red-600/30"
                                    >
                                        Fechar Conta
                                    </button>
                                ) : table.status === 'dirty' ? (
                                    <button
                                        className="bg-yellow-600/20 text-yellow-400 py-3 rounded-xl font-bold text-xs uppercase border border-yellow-500/20"
                                    >
                                        Marcar como Limpa
                                    </button>
                                ) : (
                                    <button className="bg-green-600/20 text-green-400 py-3 rounded-xl font-bold text-xs uppercase border border-green-500/20">
                                        Novo Pedido
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
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="glass w-full max-w-md overflow-hidden animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 bg-white/5 border-b border-white/5 text-center">
                            <h2 className="text-2xl font-bold text-white">Resumo da Conta 🧾</h2>
                            <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs mt-1">{receiptModal.table.name}</p>
                        </div>

                        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                            {receiptModal.order.order_items.map((item: any) => (
                                <div key={item.id} className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold">{item.quantity}x {item.products.name}</span>
                                        <span className="text-xs text-gray-500">Un: R$ {parseFloat(item.unit_price).toFixed(2)}</span>
                                    </div>
                                    <span className="text-white font-medium">R$ {(item.quantity * item.unit_price).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 bg-white/5 space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-gray-400 text-sm">Total Geral:</span>
                                <span className="text-3xl font-bold text-white">R$ {parseFloat(receiptModal.order.total_amount).toFixed(2).replace('.', ',')}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setReceiptModal(null); }}
                                    className="glass py-3 rounded-xl font-bold text-gray-400 hover:text-white"
                                >
                                    Voltar
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleFecharConta(); }}
                                    className="bg-green-600 py-3 rounded-xl font-bold text-white shadow-lg shadow-green-600/20 hover:bg-green-500"
                                >
                                    Confirmar Pagamento
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
