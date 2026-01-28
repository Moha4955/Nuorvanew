import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PaymentWebhook {
  type: string;
  data: {
    object: {
      id: string;
      status: string;
      amount: number;
      currency: string;
      metadata?: {
        invoice_id?: string;
        user_id?: string;
      };
    };
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const payload: PaymentWebhook = await req.json();

    console.log(`💳 Payment Webhook: ${payload.type}`);
    console.log(`   Amount: ${payload.data.object.amount / 100} ${payload.data.object.currency}`);

    // Handle different webhook types
    switch (payload.type) {
      case "payment_intent.succeeded":
        console.log("✅ Payment succeeded:", payload.data.object.id);
        // Update invoice status in database
        // Send confirmation email
        // Update user notifications
        break;

      case "payment_intent.payment_failed":
        console.log("❌ Payment failed:", payload.data.object.id);
        // Update invoice status
        // Send failure notification
        break;

      case "charge.refunded":
        console.log("🔄 Refund processed:", payload.data.object.id);
        // Update invoice status
        // Send refund notification
        break;

      default:
        console.log("⚠️ Unknown webhook type:", payload.type);
    }

    return new Response(
      JSON.stringify({
        success: true,
        webhook_type: payload.type,
        processed_at: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process webhook",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
