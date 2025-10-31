import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, pagePath } = body;

    // Inserir page view
    await supabase.from("page_views").insert({
      session_id: sessionId,
      page_path: pagePath || "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao registrar page view:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

