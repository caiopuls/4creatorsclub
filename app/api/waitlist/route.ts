import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

interface Lead {
  name: string;
  email: string;
  handle?: string;
  whatsapp?: string;
}

export async function POST(req: NextRequest) {
  try {
    // Carregar variáveis de ambiente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // Priorizar service_role_key (bypass RLS) ou usar anon_key
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const usingServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Verificar configuração do Supabase
    if (!supabaseUrl || !supabaseKey) {
      console.error("❌ Variáveis de ambiente do Supabase não configuradas!");
      console.error("   NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✅" : "❌");
      console.error("   SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅" : "❌");
      console.error("   NEXT_PUBLIC_SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅" : "❌");
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 }
      );
    }

    // Criar cliente do Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log("🔌 Cliente Supabase criado");
    console.log("   URL:", supabaseUrl.substring(0, 30) + "...");
    console.log("   Usando:", usingServiceRole ? "SERVICE_ROLE_KEY (bypass RLS)" : "ANON_KEY (com RLS)");

    const body = await req.json();
    const { name, email, handle, whatsapp } = body;

    console.log("📥 Recebendo lead:", { name, email, handle, whatsapp });

    // Validação básica
    if (!name || !email) {
      return NextResponse.json(
        { error: "Nome e email são obrigatórios" },
        { status: 400 }
      );
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Verificar se o email já existe
    const { data: existingLead, error: checkError } = await supabase
      .from("leads")
      .select("email")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (checkError) {
      console.error("❌ Erro ao verificar email existente:", checkError);
    }

    if (existingLead) {
      return NextResponse.json(
        { error: "Este email já está cadastrado na lista de espera" },
        { status: 409 }
      );
    }

    // Salvar no Supabase
    console.log("💾 Tentando salvar no Supabase...");
    const { data: newLead, error: insertError } = await supabase
      .from("leads")
      .insert({
        name: name.trim(),
        email: normalizedEmail,
        instagram: handle?.trim() || null,
        whatsapp: whatsapp?.trim() || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error("❌ Erro ao salvar lead no Supabase:");
      console.error("   Código:", insertError.code);
      console.error("   Mensagem:", insertError.message);
      console.error("   Detalhes:", insertError.details);
      console.error("   Hint:", insertError.hint);
      
      return NextResponse.json(
        { 
          error: "Erro ao salvar inscrição",
          details: insertError.message 
        },
        { status: 500 }
      );
    }

    if (!newLead) {
      console.error("❌ Lead não foi criado (sem dados retornados)");
      return NextResponse.json(
        { error: "Erro ao criar lead" },
        { status: 500 }
      );
    }

    console.log("✅ Lead salvo no Supabase com sucesso!");
    console.log("   ID:", newLead.id);
    console.log("   Nome:", newLead.name);
    console.log("   Email:", newLead.email);

    // Retornar sucesso
    return NextResponse.json(
      {
        success: true,
        message: "Inscrição realizada com sucesso!",
        id: newLead.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erro inesperado ao processar inscrição:", error);
    if (error instanceof Error) {
      console.error("   Mensagem:", error.message);
      console.error("   Stack:", error.stack);
    }
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}



