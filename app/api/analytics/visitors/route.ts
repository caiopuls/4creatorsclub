import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticação
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // Buscar page views dos últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: pageViews, error } = await supabaseAdmin
      .from("page_views")
      .select("created_at, session_id")
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Erro ao buscar page views:", error);
      return NextResponse.json(
        { error: "Erro ao buscar dados" },
        { status: 500 }
      );
    }

    // Agrupar por dia
    const dailyVisits: { [key: string]: Set<string> } = {};
    
    pageViews?.forEach((view) => {
      const date = new Date(view.created_at).toLocaleDateString("pt-BR");
      if (!dailyVisits[date]) {
        dailyVisits[date] = new Set();
      }
      if (view.session_id) {
        dailyVisits[date].add(view.session_id);
      }
    });

    // Converter para formato de gráfico
    const chartData = Object.entries(dailyVisits)
      .map(([date, sessions]) => ({
        date,
        visitors: sessions.size,
      }))
      .sort((a, b) => new Date(a.date.split("/").reverse().join("-")).getTime() - new Date(b.date.split("/").reverse().join("-")).getTime());

    return NextResponse.json({ data: chartData });
  } catch (error) {
    console.error("Erro ao buscar analytics:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
}

