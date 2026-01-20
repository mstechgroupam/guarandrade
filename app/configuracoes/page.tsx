"use client";

import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function Configuracoes() {
    return (
        <div className="flex h-screen p-4 gap-4">
            <Sidebar />

            <main className="flex-1 overflow-y-auto pr-2 space-y-6">
                <header className="flex justify-between items-center py-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">Configurações ⚙️</h1>
                        <p className="text-gray-400">Personalize o sistema e gerencie preferências.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* General Settings */}
                    <div className="glass p-6 space-y-6">
                        <h3 className="font-bold text-xl text-white border-b border-white/5 pb-2">Geral</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="text-sm font-bold text-white">Nome da Lanchonete</h4>
                                    <p className="text-xs text-gray-500">O nome que aparece no sistema e nos recibos.</p>
                                </div>
                                <input type="text" defaultValue="Guarandrade" className="glass bg-white/5 px-3 py-1 text-sm text-white border-transparent" />
                            </div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="text-sm font-bold text-white">Modo Escuro</h4>
                                    <p className="text-xs text-gray-500">Alternar entre temas do sistema.</p>
                                </div>
                                <div className="w-12 h-6 bg-indigo-600 rounded-full relative">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="text-sm font-bold text-white">Moeda</h4>
                                    <p className="text-xs text-gray-500">Unidade monetária padrão.</p>
                                </div>
                                <select className="glass bg-white/5 px-2 py-1 text-sm text-white border-transparent">
                                    <option>BRL (R$)</option>
                                    <option>USD ($)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Device Settings */}
                    <div className="glass p-6 space-y-6">
                        <h3 className="font-bold text-xl text-white border-b border-white/5 pb-2">Impressão & Dispositivos</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🖨️</span>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">Impressora Térmica - Cozinha</h4>
                                        <p className="text-[10px] text-green-400 uppercase font-bold">Conectado</p>
                                    </div>
                                </div>
                                <button className="text-xs font-bold text-indigo-400">Testar</button>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🔊</span>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">Alerta Sonoro de Pedido</h4>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">Ativado</p>
                                    </div>
                                </div>
                                <button className="text-xs font-bold text-red-500">Desativar</button>
                            </div>
                        </div>
                    </div>

                    {/* Advanced / Dangerous */}
                    <div className="glass p-6 space-y-4 md:col-span-2 bg-red-500/5">
                        <h3 className="font-bold text-xl text-red-400">Zona de Perigo</h3>
                        <p className="text-sm text-gray-400">Cuidado: essas ações são irreversíveis e afetam todo o sistema.</p>
                        <div className="flex gap-4">
                            <button className="border border-red-500/30 text-red-400 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-500/10">Limpar Histórico de Pedidos</button>
                            <button className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-700">Resetar Sistema</button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pb-4">
                    <button className="glass px-6 py-2 text-sm font-bold text-gray-400">Cancelar</button>
                    <button className="bg-indigo-600 px-8 py-2 rounded-xl font-bold text-white shadow-lg shadow-indigo-600/20">Salvar Alterações</button>
                </div>
            </main>
        </div>
    );
}
