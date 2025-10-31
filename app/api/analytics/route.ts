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

    // Contar leads
    const { count: leadsCount } = await supabaseAdmin
      .from("leads")
      .select("*", { count: "exact", head: true });

    // Contar visitantes únicos (sessions distintas)
    const { data: uniqueSessions } = await supabaseAdmin
      .from("page_views")
      .select("session_id")
      .maybeSingle();

    // Contar total de page views
    const { count: totalViews } = await supabaseAdmin
      .from("page_views")
      .select("*", { count: "exact", head: true });

    // Contar visitantes únicos (distinct sessions)
    const { data: allSessions } = await supabaseAdmin
      .from("page_views")
      .select("session_id");

    const uniqueVisitors = new Set(allSessions?.map(p => p.session_id) || []).size;

    return NextResponse.json({
      leads: leadsCount || 0,
      visitors: uniqueVisitors,
      totalViews: totalViews || 0,
    });
  } catch (error) {
    console.error("Erro ao buscar analytics:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
}

