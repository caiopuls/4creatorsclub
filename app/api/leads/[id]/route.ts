import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    const { error } = await supabaseAdmin
      .from("leads")
      .delete()
      .eq("id", params.id);

    if (error) {
      console.error("Erro ao deletar lead:", error);
      return NextResponse.json(
        { error: "Erro ao deletar lead" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, instagram, whatsapp } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabaseAdmin
      .from("leads")
      .update({
        name: name?.trim(),
        email: email?.trim().toLowerCase(),
        instagram: instagram?.trim() || null,
        whatsapp: whatsapp?.trim() || null,
      })
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar lead:", error);
      return NextResponse.json(
        { error: "Erro ao atualizar lead" },
        { status: 500 }
      );
    }

    return NextResponse.json({ lead: data });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

