"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function Cozinha() {
    const [orders, setOrders] = useState([
        { id: 101, mesa: '04', tempo: '12 min', status: 'preparando', items: ['2x X-Tudo', '1x Batata Média'] },
        { id: 102, mesa: '08', tempo: '5 min', status: 'fila', items: ['1x Hot Dog Especial', '1x Suco de Laranja'] },
        { id: 103, mesa: '02', tempo: '18 min', status: 'atrasado', items: ['3x Coxinha', '1x Guaraná 2L'] },
        { id: 104, mesa: '01', tempo: '2 min', status: 'fila', items: ['1x Pastel de Carne', '1x Café'] },
    ]);

    const updateStatus = (id: number) => {
        setOrders(orders.map(o => {
            if (o.id === id) {
                if (o.status === 'fila') return { ...o, status: 'preparando' };
                if (o.status === 'preparando') return { ...o, status: 'pronto' };
            }
            return o;
        }).filter(o => o.status !== 'pronto'));
    };

    return (
        <div className="flex h-screen p-4 gap-4">
            <Sidebar />

            <main className="flex-1 overflow-y-auto pr-2 space-y-6">
                <header className="flex justify-between items-center py-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">Cozinha (KDS) 🍳</h1>
                        <p className="text-gray-400">Gerencie os pedidos em tempo real para produção.</p>
                    </div>
                    <div className="glass px-4 py-2 text-sm font-bold text-indigo-400">
                        {orders.length} Pedidos Ativos
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {orders.map((order) => (
                        <div key={order.id} className={`glass flex flex-col border-l-8 ${order.status === 'atrasado' ? 'border-l-red-500' :
                                order.status === 'preparando' ? 'border-l-blue-500' : 'border-l-gray-600'
                            }`}>
                            <div className="p-4 border-b border-white/5 flex justify-between items-center">
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pedido #{order.id}</span>
                                    <h3 className="text-xl font-bold text-white">Mesa {order.mesa}</h3>
                                </div>
                                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${order.status === 'atrasado' ? 'bg-red-500 text-white' :
                                        order.status === 'preparando' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'
                                    }`}>
                                    {order.tempo}
                                </div>
                            </div>

                            <div className="p-4 flex-1">
                                <ul className="space-y-2">
                                    {order.items.map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-white font-medium">
                                            <input type="checkbox" className="w-5 h-5 rounded border-gray-600 bg-transparent" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-4 bg-white/5">
                                <button
                                    onClick={() => updateStatus(order.id)}
                                    className={`w-full py-3 rounded-xl font-bold transition-all ${order.status === 'fila' ? 'bg-indigo-600 text-white hover:bg-indigo-500' :
                                            order.status === 'preparando' ? 'bg-green-600 text-white hover:bg-green-500' :
                                                'bg-red-600 text-white hover:bg-red-500'
                                        }`}
                                >
                                    {order.status === 'fila' ? 'INICIAR PREPARO' :
                                        order.status === 'preparando' ? 'MARCAR COMO PRONTO' : 'RESOLVER ATRASO'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {orders.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <div className="text-6xl mb-4">💤</div>
                        <p className="text-xl font-medium">Nenhum pedido pendente na cozinha.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
