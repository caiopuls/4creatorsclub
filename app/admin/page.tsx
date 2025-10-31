"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import * as XLSX from "xlsx";
import {
  LogOut,
  Download,
  RefreshCw,
  Edit,
  Trash2,
  Users,
  Eye,
  TrendingUp,
  Calendar,
  Mail,
  Instagram,
  MessageCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Lead {
  id: string;
  name: string;
  email: string;
  instagram: string | null;
  whatsapp: string | null;
  created_at: string;
}

interface VisitorData {
  date: string;
  visitors: number;
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ leads: 0, visitors: 0, totalViews: 0 });
  const [visitorData, setVisitorData] = useState<VisitorData[]>([]);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAuth();
    loadLeads();
    loadStats();
    loadVisitorData();
  }, []);

  const checkAuth = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/admin/login");
    }
  };

  const loadLeads = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setLeads(data || []);
    } catch (error) {
      console.error("Erro ao carregar leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch("/api/analytics");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  const loadVisitorData = async () => {
    try {
      const response = await fetch("/api/analytics/visitors");
      const data = await response.json();
      setVisitorData(data.data || []);
    } catch (error) {
      console.error("Erro ao carregar dados de visitantes:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      leads.map((lead) => ({
        Nome: lead.name,
        Email: lead.email,
        Instagram: lead.instagram || "",
        WhatsApp: lead.whatsapp || "",
        "Data de Cadastro": new Date(lead.created_at).toLocaleString("pt-BR"),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(
      workbook,
      `leads-4creatorsclub-${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
  };

  const handleSaveEdit = async () => {
    if (!editingLead) return;

    try {
      const response = await fetch(`/api/leads/${editingLead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingLead.name,
          email: editingLead.email,
          instagram: editingLead.instagram,
          whatsapp: editingLead.whatsapp,
        }),
      });

      if (response.ok) {
        await loadLeads();
        setEditingLead(null);
      }
    } catch (error) {
      console.error("Erro ao salvar edição:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadLeads();
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([loadLeads(), loadStats(), loadVisitorData()]);
    setLoading(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#090909] flex items-center justify-center">
        <div className="text-[#a9a9a9] flex items-center gap-2">
          <RefreshCw className="animate-spin" size={20} />
          Carregando...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090909] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 flex items-center gap-3">
              <Users size={36} />
              Admin Dashboard
            </h1>
            <p className="text-[#a9a9a9]">4Creators Club - Gerenciamento de Leads</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border border-[#2a2a2a] rounded-xl bg-[#0c0c0c] hover:border-white/30 transition-colors cursor-pointer"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-[22px] p-6 hover:border-white/20 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Users className="text-white" size={20} />
              </div>
              <div className="text-sm text-[#a9a9a9]">Total de Leads</div>
            </div>
            <div className="text-4xl font-extrabold">{stats.leads}</div>
          </div>
          <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-[22px] p-6 hover:border-white/20 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <TrendingUp className="text-white" size={20} />
              </div>
              <div className="text-sm text-[#a9a9a9]">Visitantes Únicos</div>
            </div>
            <div className="text-4xl font-extrabold">{stats.visitors}</div>
          </div>
          <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-[22px] p-6 hover:border-white/20 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Eye className="text-white" size={20} />
              </div>
              <div className="text-sm text-[#a9a9a9]">Total de Visualizações</div>
            </div>
            <div className="text-4xl font-extrabold">{stats.totalViews}</div>
          </div>
        </div>

        {/* Gráfico de Visitantes */}
        {visitorData.length > 0 && (
          <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-[22px] p-6 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={24} />
              <h2 className="text-xl font-bold">Visitantes por Dia (últimos 30 dias)</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={visitorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis
                  dataKey="date"
                  stroke="#a9a9a9"
                  tick={{ fill: "#a9a9a9" }}
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#a9a9a9" tick={{ fill: "#a9a9a9" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f0f0f",
                    border: "1px solid #1a1a1a",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="#ffffff"
                  strokeWidth={2}
                  name="Visitantes"
                  dot={{ fill: "#ffffff", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Actions */}
        <div className="mb-6 flex flex-wrap gap-4">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-b from-white to-[#e9e9e9] text-black font-extrabold rounded-xl hover:brightness-105 transition-all cursor-pointer"
          >
            <Download size={18} />
            Exportar para Excel
          </button>
          <button
            onClick={refreshAll}
            className="flex items-center gap-2 px-6 py-3 border border-[#2a2a2a] rounded-xl bg-[#0c0c0c] hover:border-white/30 transition-colors cursor-pointer"
          >
            <RefreshCw size={18} />
            Atualizar
          </button>
        </div>

        {/* Leads Table */}
        <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-[22px] overflow-hidden">
          <div className="p-6 border-b border-[#1a1a1a]">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users size={24} />
              Lista de Leads ({leads.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0c0c0c] border-b border-[#1a1a1a]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#dedede]">
                    Nome
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#dedede]">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#dedede]">
                    Instagram
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#dedede]">
                    WhatsApp
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#dedede]">
                    <Calendar size={16} className="inline mr-1" />
                    Cadastro
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-[#dedede]">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-[#a9a9a9]"
                    >
                      Nenhum lead cadastrado ainda
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-[#1a1a1a] hover:bg-[#0c0c0c] transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium">
                        {lead.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#a9a9a9]">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="flex-shrink-0" />
                          <span>{lead.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#a9a9a9]">
                        {lead.instagram ? (
                          <div className="flex items-center gap-2">
                            <Instagram size={14} className="flex-shrink-0" />
                            <span>{lead.instagram}</span>
                          </div>
                        ) : (
                          <span className="text-[#666]">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#a9a9a9]">
                        {lead.whatsapp ? (
                          <div className="flex items-center gap-2">
                            <MessageCircle size={14} className="flex-shrink-0" />
                            <span>{lead.whatsapp}</span>
                          </div>
                        ) : (
                          <span className="text-[#666]">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#a9a9a9]">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="flex-shrink-0" />
                          <span>
                            {new Date(lead.created_at).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(lead)}
                            className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <Edit size={16} className="text-[#a9a9a9]" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(lead.id)}
                            className="p-2 hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                            title="Deletar"
                          >
                            <Trash2 size={16} className="text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      {editingLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-[22px] p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Editar Lead</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#bfbfbf] mb-2">Nome</label>
                <input
                  type="text"
                  value={editingLead.name}
                  onChange={(e) =>
                    setEditingLead({ ...editingLead, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-[#2a2a2a] bg-[#0c0c0c] text-white focus:border-white/40 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[#bfbfbf] mb-2">Email</label>
                <input
                  type="email"
                  value={editingLead.email}
                  onChange={(e) =>
                    setEditingLead({ ...editingLead, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-[#2a2a2a] bg-[#0c0c0c] text-white focus:border-white/40 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[#bfbfbf] mb-2">
                  Instagram
                </label>
                <input
                  type="text"
                  value={editingLead.instagram || ""}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      instagram: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-[#2a2a2a] bg-[#0c0c0c] text-white focus:border-white/40 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[#bfbfbf] mb-2">
                  WhatsApp
                </label>
                <input
                  type="text"
                  value={editingLead.whatsapp || ""}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      whatsapp: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-[#2a2a2a] bg-[#0c0c0c] text-white focus:border-white/40 focus:outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-6 py-3 bg-gradient-to-b from-white to-[#e9e9e9] text-black font-extrabold rounded-xl hover:brightness-105 transition-all cursor-pointer"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setEditingLead(null)}
                  className="px-6 py-3 border border-[#2a2a2a] rounded-xl bg-[#0c0c0c] hover:border-white/30 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Delete */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-[22px] p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-red-400">
              Confirmar Exclusão
            </h3>
            <p className="text-[#a9a9a9] mb-6">
              Tem certeza que deseja excluir este lead? Esta ação não pode ser
              desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
              >
                Excluir
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-6 py-3 border border-[#2a2a2a] rounded-xl bg-[#0c0c0c] hover:border-white/30 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
