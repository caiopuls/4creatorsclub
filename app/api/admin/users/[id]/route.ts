import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
        if (error) throw error;

        return NextResponse.json({ message: "User deleted" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();
        const { password, role, fullName, cnpj, phone, companyName } = body;

        // Update Auth (Password)
        if (password) {
            const { error } = await supabaseAdmin.auth.admin.updateUserById(id, { password });
            if (error) throw error;
        }

        // Update Profile (Role, Name, etc)
        const updates: any = {};
        if (role) updates.role = role;
        if (fullName) updates.full_name = fullName;
        if (cnpj !== undefined) updates.cnpj = cnpj;
        if (phone !== undefined) updates.phone = phone;
        if (companyName !== undefined) updates.company_name = companyName;

        if (Object.keys(updates).length > 0) {
            const { error } = await supabaseAdmin
                .from("profiles")
                .update(updates)
                .eq("id", id);

            if (error) throw error;

            // Also update metadata so it stays in sync
            await supabaseAdmin.auth.admin.updateUserById(id, { user_metadata: updates });
        }

        return NextResponse.json({ message: "User updated" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
