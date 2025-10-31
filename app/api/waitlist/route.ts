import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, handle, whatsapp } = body;

    // Validação básica
    if (!name || !email) {
      return NextResponse.json(
        { error: "Nome e email são obrigatórios" },
        { status: 400 }
      );
    }

    // Aqui você pode integrar com:
    // 1. EmailJS
    // 2. Resend
    // 3. SendGrid
    // 4. Nodemailer
    // 5. Webhook (Zapier, Make, etc.)
    // 6. Google Sheets API
    // 7. Notion API

    // Por enquanto, vamos simular o envio
    console.log("Nova inscrição na lista de espera:", {
      name,
      email,
      handle,
      whatsapp,
      timestamp: new Date().toISOString(),
    });

    // TODO: Implementar integração real de email
    // Exemplo com Resend:
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "noreply@4creatorsclub.com",
      to: "seu-email@exemplo.com",
      subject: `Nova inscrição: ${name}`,
      html: `
        <h2>Nova inscrição na lista de espera</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${handle ? `<p><strong>Instagram:</strong> ${handle}</p>` : ""}
        ${whatsapp ? `<p><strong>WhatsApp:</strong> ${whatsapp}</p>` : ""}
      `,
    });
    */

    // Retornar sucesso
    return NextResponse.json(
      {
        success: true,
        message: "Inscrição realizada com sucesso!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao processar inscrição:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}



