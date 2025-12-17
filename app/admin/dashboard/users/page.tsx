"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Edit, Trash2, Plus, X, Lock, RefreshCw, Eye, EyeOff } from "lucide-react";

interface Profile {
    id: string;
    email: string;
    full_name: string;
    role: string;
    created_at: string;
    cnpj?: string;
    phone?: string;
    company_name?: string;
    avatar_url?: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Profile | null>(null);

    // Form States
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        fullName: "",
        role: "member",
        cnpj: "",
        phone: "",
        companyName: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (!res.ok) throw new Error("Falha ao carregar usuários");
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const generateRandomPassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
        let pass = "";
        for (let i = 0; i < 12; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData(prev => ({ ...prev, password: pass }));
        setShowPassword(true);
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const err = await res.json();
                alert(err.error || "Erro ao criar usuário");
                return;
            }

            await loadUsers();
            setIsCreateModalOpen(false);
            resetForm();
            alert("Usuário criado com sucesso!");
        } catch (error) {
            alert("Erro ao criar usuário");
        }
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        try {
            const res = await fetch(`/api/admin/users/${editingUser.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const err = await res.json();
                alert(err.error || "Erro ao atualizar usuário");
                return;
            }

            await loadUsers();
            setEditingUser(null);
            resetForm();
            alert("Usuário atualizado com sucesso!");
        } catch (error) {
            alert("Erro ao atualizar usuário");
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                const err = await res.json();
                alert(err.error || "Erro ao deletar");
                return;
            }

            await loadUsers();
        } catch (error) {
            alert("Erro ao deletar usuário");
        }
    };

    const openEditModal = (user: Profile) => {
        setEditingUser(user);
        setFormData({
            email: user.email,
            fullName: user.full_name || "",
            role: user.role,
            password: "", // Don't allow reading password
            cnpj: user.cnpj || "",
            phone: user.phone || "",
            companyName: user.company_name || ""
        });
        setShowPassword(false);
    };

    const resetForm = () => {
        setFormData({ email: "", password: "", fullName: "", role: "member", cnpj: "", phone: "", companyName: "" });
        setShowPassword(false);
    };

    const UserFormContent = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-[#888] mb-1">Nome Completo</label>
                    <input className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg p-3 text-white focus:border-white/50 focus:outline-none"
                        required value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm text-[#888] mb-1">Permissão (Role)</label>
                    <select className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg p-3 text-white focus:border-white/50 focus:outline-none"
                        value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                        <option value="member">Membro (Padrão)</option>
                        <option value="founder">Founder</option>
                        <option value="admin">Administrador</option>
                        <option value="freelancer">Freelancer</option>
                        <option value="agency">Agência</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm text-[#888] mb-1">Email</label>
                <input type="email" className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg p-3 text-white focus:border-white/50 focus:outline-none"
                    required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-[#888] mb-1">Nome da Empresa</label>
                    <input className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg p-3 text-white focus:border-white/50 focus:outline-none"
                        value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm text-[#888] mb-1">CNPJ</label>
                    <input className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg p-3 text-white focus:border-white/50 focus:outline-none"
                        value={formData.cnpj} onChange={e => setFormData({ ...formData, cnpj: e.target.value })} />
                </div>
            </div>

            <div>
                <label className="block text-sm text-[#888] mb-1">Telefone / WhatsApp</label>
                <input className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg p-3 text-white focus:border-white/50 focus:outline-none"
                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            </div>
        </div>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Usuários</h1>
                    <p className="text-[#666] mt-1">Gerencie os membros da plataforma</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            resetForm();
                            setIsCreateModalOpen(true);
                        }}
                        className="px-4 py-2 bg-white text-black rounded-lg text-sm font-bold hover:brightness-90 transition-all shadow-lg shadow-white/5 flex items-center gap-2"
                    >
                        <Plus size={16} /> Novo Usuário
                    </button>
                </div>
            </div>

            <div className="bg-[#0c0c0c] border border-[#1a1a1a] rounded-2xl overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[#111] border-b border-[#222] text-[#888] font-medium uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Nome</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Empresa/CNPJ</th>
                            <th className="px-6 py-4">Cadastro em</th>
                            <th className="px-6 py-4 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a1a1a]">
                        {loading ? (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-[#666]">Carregando...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-[#666]">Nenhum usuário encontrado.</td></tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-[#111] transition-colors">
                                    <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                                        {user.avatar_url && <img src={user.avatar_url} className="w-6 h-6 rounded-full object-cover" />}
                                        {user.full_name || "Sem Nome"}
                                    </td>
                                    <td className="px-6 py-4 text-[#aaa]">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded border text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-900/30 text-purple-400 border-purple-900/50' :
                                                user.role === 'founder' ? 'bg-amber-900/30 text-amber-400 border-amber-900/50' :
                                                    user.role === 'agency' ? 'bg-blue-900/30 text-blue-400 border-blue-900/50' :
                                                        'bg-[#222] text-[#ccc] border-[#333]'
                                            } `}>{user.role}</span>
                                    </td>
                                    <td className="px-6 py-4 text-[#888] text-xs">
                                        <div>{user.company_name}</div>
                                        <div>{user.cnpj}</div>
                                    </td>
                                    <td className="px-6 py-4 text-[#666]">
                                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4 text-center flex justify-center gap-2">
                                        <button
                                            onClick={() => openEditModal(user)}
                                            className="p-2 hover:bg-[#222] rounded text-[#888] hover:text-white transition-colors"
                                            title="Editar"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="p-2 hover:bg-red-900/20 rounded text-[#888] hover:text-red-400 transition-colors"
                                            title="Excluir"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#111] border border-[#333] w-full max-w-lg rounded-2xl p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Criar Novo Usuário</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-[#666] hover:text-white"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            {UserFormContent()}

                            <div className="pt-2">
                                <label className="block text-sm text-[#888] mb-1">Senha Inicial</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg p-3 text-white focus:border-white/50 focus:outline-none pr-10"
                                            required minLength={6}
                                            value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white">
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={generateRandomPassword}
                                        className="px-3 py-2 bg-[#222] border border-[#333] rounded-lg text-[#ccc] hover:bg-[#333] hover:text-white text-xs font-bold"
                                        title="Gerar Senha Aleatória"
                                    >
                                        <RefreshCw size={16} />
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:brightness-90 mt-4">Criar Usuário</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#111] border border-[#333] w-full max-w-lg rounded-2xl p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                {editingUser.avatar_url && <img src={editingUser.avatar_url} className="w-10 h-10 rounded-full object-cover border border-[#333]" />}
                                <h2 className="text-xl font-bold">Editar Usuário</h2>
                            </div>
                            <button onClick={() => setEditingUser(null)} className="text-[#666] hover:text-white"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleUpdateUser} className="space-y-4">
                            {UserFormContent()}

                            <div className="pt-4 border-t border-[#222]">
                                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Lock size={14} /> Redefinir Senha (Manual)</h3>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Deixe em branco para manter a atual"
                                            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg p-3 text-white focus:border-white/50 focus:outline-none pr-10"
                                            minLength={6}
                                            value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white">
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={generateRandomPassword}
                                        className="px-3 py-2 bg-[#222] border border-[#333] rounded-lg text-[#ccc] hover:bg-[#333] hover:text-white text-xs font-bold"
                                        title="Gerar Senha Aleatória"
                                    >
                                        <RefreshCw size={16} />
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:brightness-90 mt-4">Salvar Alterações</button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
