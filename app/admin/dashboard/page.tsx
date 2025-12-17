"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TrendingUp, Users, FileText, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardOverview() {
    const [stats, setStats] = useState({
        totalApplications: 0,
        totalLeads: 0,
        dailyApplications: 0,
        conversionRate: "0%"
    });
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    // Chart Data State
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            // 1. Fetch Totals
            const { count: appCount, data: allApps } = await supabase
                .from('applications')
                .select('created_at', { count: 'exact' });

            const { count: leadCount } = await supabase
                .from('leads')
                .select('*', { count: 'exact', head: true });

            const { count: userCount } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            // 2. Compute Daily Applications (Today)
            const today = new Date().toISOString().split('T')[0];
            const dailyApps = allApps?.filter(app => app.created_at.startsWith(today)).length || 0;

            // 3. Compute Chart Data (Last 30 Days)
            // Initialize map with last 30 days
            const dataMap = new Map<string, number>();
            for (let i = 29; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                dataMap.set(d.toISOString().split('T')[0], 0);
            }

            // Fill with real data
            allApps?.forEach(app => {
                const date = app.created_at.split('T')[0];
                if (dataMap.has(date)) {
                    dataMap.set(date, (dataMap.get(date) || 0) + 1);
                }
            });

            // Convert to array
            const chartArray = Array.from(dataMap.entries()).map(([date, count]) => ({
                date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                applications: count
            }));

            setChartData(chartArray);

            setStats({
                totalApplications: appCount || 0,
                totalLeads: leadCount || 0,
                dailyApplications: dailyApps,
                conversionRate: userCount ? `${userCount}` : "0"
            });
        } catch (error) {
            console.error("Error loading stats", error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon: Icon, trend }: any) => (
        <div className="bg-[#0c0c0c] border border-[#1a1a1a] p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-[#666] text-sm font-medium uppercase tracking-wider">{title}</p>
                    <h3 className="text-3xl font-extrabold text-white mt-1">{value}</h3>
                </div>
                <div className="p-3 bg-white/5 rounded-xl text-white">
                    <Icon size={24} />
                </div>
            </div>
            {trend && (
                <div className="flex items-center gap-1 text-sm text-green-400">
                    <TrendingUp size={14} />
                    <span>{trend} vs último mês</span>
                </div>
            )}
        </div>
    );

    if (loading) return <div className="text-[#666] p-8">Carregando dashboard...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Visão Geral</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard
                    title="Total de Aplicações"
                    value={stats.totalApplications}
                    icon={FileText}
                />
                <StatCard
                    title="Leads Totais"
                    value={stats.totalLeads}
                    icon={Users}
                />
                <StatCard
                    title="Aplicações Hoje"
                    value={stats.dailyApplications}
                    icon={Activity}
                />
                <StatCard
                    title="Usuários da Plataforma"
                    value={stats.conversionRate}
                    icon={TrendingUp}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#0c0c0c] border border-[#1a1a1a] rounded-2xl p-6 h-96">
                    <h3 className="text-lg font-bold mb-6 text-white">Aplicações (Últimos 30 dias)</h3>
                    <ResponsiveContainer width="100%" height="100%" maxHeight={300}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#fff" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#666"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#666"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="applications"
                                stroke="#fff"
                                fillOpacity={1}
                                fill="url(#colorApps)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-[#0c0c0c] border border-[#1a1a1a] rounded-2xl p-6 h-96 flex items-center justify-center text-[#666]">
                    <div className="text-center">
                        <Activity size={48} className="mb-4 mx-auto opacity-20" />
                        <p>Atividade Recente (Em Breve)</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
