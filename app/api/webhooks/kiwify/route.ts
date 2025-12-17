import { createClient } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

const KIWIFY_TOKEN = "kyfb5mcqihr";

export async function POST(request: Request) {
    try {
        const url = new URL(request.url);
        const token = url.searchParams.get("token") || request.headers.get("x-kiwify-token");

        // 1. Verify Token (simple check)
        // Kiwify sends the token in the query string usually for webhooks? 
        // Or we can just check the payload if it's signed (Kiwify has a signature usually).
        // The user provided a specific token 'kyfb5mcqihr' to check.
        // Assuming user wants us to check ?token=kyfb5mcqihr

        // Check query param 'token' matching the secret
        const queryToken = url.searchParams.get("token");

        // Note: In production, verify Kiwify signature if possible. 
        // Here we use the user-provided secret token method.
        if (queryToken !== KIWIFY_TOKEN) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { order_status, subscription_status, Customer, order_id, product_id, subscription_id } = body;

        const email = Customer?.email;
        if (!email) {
            return NextResponse.json({ message: "No email provided" }, { status: 200 });
        }

        const supabase = createClient();

        // Check if we should block access
        // statuses that should REVOKE access: refunded, charged_back, canceled (subscription), inactive
        const shouldBlock =
            order_status === "refunded" ||
            order_status === "charged_back" ||
            subscription_status === "canceled" ||
            subscription_status === "inactive";

        // statuses that should SUSPEND/NOTIFY (maybe block too): overdue
        const isOverdue = subscription_status === "overdue";

        // Logic for authorizing/updating
        const { error } = await supabase
            .from("authorized_signups")
            .upsert(
                {
                    email: email,
                    kiwify_order_id: order_id,
                    order_status: order_status,
                    subscription_status: subscription_status,
                    is_blocked: shouldBlock || isOverdue, // Let's block if overdue too
                    // if it's paid, ensure it's NOT blocked
                    ...(order_status === "paid" && { is_blocked: false })
                },
                { onConflict: 'email' }
            );

        if (error) {
            console.error("Error updating authorized signup:", error);
            return NextResponse.json({ error: "DB Error" }, { status: 500 });
        }

        // Optional: If the user already has a Supabase Auth account, 
        // you would typically update a 'profiles' table here to disable their login.
        // For now, these status updates are saved in authorized_signups.

        return NextResponse.json({ message: "Webhook received" }, { status: 200 });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
