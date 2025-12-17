"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, Filter, CheckCircle, XCircle, Clock } from "lucide-react";

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        const { data } = await supabase
            .from("applications")
            .select("*")
            .order("created_at", { ascending: false });

        setApplications(data || []);
        setLoading(false);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved': return <span className="px-2 py-1 rounded bg-green-900/30 text-green-400 text-xs font-bold border border-green-900/50 flex items-center gap-1 w-fit"><CheckCircle size={12} /> Aprovado</span>;
            case 'rejected': return <span className="px-2 py-1 rounded bg-red-900/30 text-red-400 text-xs font-bold border border-red-900/50 flex items-center gap-1 w-fit"><XCircle size={12} /> Rejeitado</span>;
            default: return <span className="px-2 py-1 rounded bg-yellow-900/30 text-yellow-400 text-xs font-bold border border-yellow-900/50 flex items-center gap-1 w-fit"><Clock size={12} /> Pendente</span>;
        }
    };

    const [selectedApp, setSelectedApp] = useState<any>(null);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Aplicações</h1>
                    <p className="text-[#666] mt-1">Gerencie os candidatos ao Founder 4C</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" size={16} />
                        <input
                            placeholder="Buscar por nome..."
                            className="bg-[#0c0c0c] border border-[#2a2a2a] pl-10 pr-4 py-2 rounded-lg text-white text-sm focus:border-white/20 focus:outline-none w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-[#0c0c0c] border border-[#1a1a1a] rounded-2xl overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[#111] border-b border-[#222] text-[#888] font-medium uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Nome / Email</th>
                            <th className="px-6 py-4">Contato</th>
                            <th className="px-6 py-4">Status Atual</th>
                            <th className="px-6 py-4">Objetivo</th>
                            <th className="px-6 py-4">Data</th>
                            <th className="px-6 py-4 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a1a1a]">
                        {loading ? (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-[#666]">Carregando...</td></tr>
                        ) : applications.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-[#666]">Nenhuma aplicação encontrada.</td></tr>
                        ) : (
                            applications.map((app) => (
                                <tr key={app.id} className="hover:bg-[#111] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-white">{app.name}</div>
                                        <div className="text-[#666]">{app.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-[#aaa]">
                                        <div>{app.phone}</div>
                                        <div className="text-xs text-[#666]">{app.instagram}</div>
                                    </td>
                                    <td className="px-6 py-4">{app.current_status}</td>
                                    <td className="px-6 py-4 text-[#888] max-w-xs truncate" title={app.goal}>{app.goal}</td>
                                    <td className="px-6 py-4 text-[#666]">
                                        {new Date(app.created_at).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => setSelectedApp(app)}
                                            className="text-[#444] hover:text-white transition-colors text-xs font-bold border border-[#222] px-3 py-1 rounded hover:border-white/20"
                                        >
                                            Ver Detalhes
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal */}
            {selectedApp && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#111] border border-[#333] w-full max-w-2xl rounded-2xl p-8 shadow-2xl relative">
                        <button
                            onClick={() => setSelectedApp(null)}
                            className="absolute top-4 right-4 text-[#666] hover:text-white bg-[#222] p-2 rounded-full transition-colors"
                        >
                            <XCircle size={20} />
                        </button>

                        <h2 className="text-2xl font-bold mb-6 border-b border-[#222] pb-4">Detalhes da Aplicação</h2>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xs uppercase text-[#666] font-bold mb-1">Candidato</h3>
                                    <p className="text-lg font-medium text-white">{selectedApp.name}</p>
                                    <p className="text-[#888]">{selectedApp.email}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs uppercase text-[#666] font-bold mb-1">Contatos</h3>
                                    <div className="flex flex-col gap-1 text-[#ccc]">
                                        <span>📱 {selectedApp.phone}</span>
                                        <span>📸 {selectedApp.instagram}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xs uppercase text-[#666] font-bold mb-1">Status Profissional</h3>
                                    <p className="text-white bg-[#1a1a1a] p-2 rounded border border-[#2a2a2a] inline-block">
                                        {selectedApp.current_status}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-xs uppercase text-[#666] font-bold mb-1">Data da Aplicação</h3>
                                    <p className="text-[#888]">{new Date(selectedApp.created_at).toLocaleString('pt-BR')}</p>
                                </div>
                            </div>

                            <div className="col-span-2 mt-2">
                                <h3 className="text-xs uppercase text-[#666] font-bold mb-2">Objetivo Principal</h3>
                                <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#2a2a2a] text-[#ddd] leading-relaxed">
                                    {selectedApp.goal}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-[#222]">
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:brightness-90"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
