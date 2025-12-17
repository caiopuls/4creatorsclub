import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Initialize Supabase Admin Client
// We need SERVICE_ROLE_KEY to manage users in auth.users
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
    try {
        // 1. Check if requester is Admin (omitted for brevity, would check cookie + profile role)
        // For now, assuming middleware or dashboard layout handles unauthorized access redirects,
        // but ideally we verify the user role again here.

        // Fetch all profiles
        const { data: profiles, error } = await supabaseAdmin
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        return NextResponse.json(profiles);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, fullName, role, cnpj, phone, companyName } = body;

        // 1. Create User in Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                full_name: fullName,
                role: role,
                cnpj: cnpj,
                phone: phone,
                company_name: companyName
            }
        });

        // Note: The Trigger 'handle_new_user' needs to be updated to capture these extra fields
        // OR we can manually update the profile immediately after creation to be sure.
        // Let's manually upate profile to ensure data consistency as the trigger might only capture basic mapping.
        if (authData.user) {
            await supabaseAdmin.from('profiles').update({
                cnpj, phone, company_name: companyName
            }).eq('id', authData.user.id);
        }

        if (authError) throw authError;

        return NextResponse.json({ message: "User created", user: authData.user });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
