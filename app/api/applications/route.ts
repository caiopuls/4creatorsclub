import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, instagram, currentStatus, goal } = body;

        // Server-side validation
        if (!name || !email || !phone || !instagram || !currentStatus || !goal) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Initialize Supabase client with Service Role Key for robust server-side operations
        // This ensures we can insert even if RLS policies are tricky, though we have public insert enabled.
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // accessing private key
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data, error } = await supabase
            .from("applications")
            .insert([
                {
                    name,
                    email,
                    phone,
                    instagram,
                    current_status: currentStatus,
                    goal,
                    status: 'pending' // Default status
                },
            ])
            .select();

        if (error) {
            console.error("Supabase error:", error);
            return NextResponse.json(
                { error: "Failed to save application" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Application submitted successfully", data },
            { status: 201 }
        );
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
