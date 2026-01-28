import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EmailPayload {
  to: string | string[];
  subject: string;
  body: string;
  html?: string;
  template?: string;
  data?: Record<string, any>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const payload: EmailPayload = await req.json();

    if (!payload.to || !payload.subject || !payload.body) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject, body" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const recipients = Array.isArray(payload.to) ? payload.to : [payload.to];

    console.log(`📧 Email Service: Sending to ${recipients.join(", ")}`);
    console.log(`📧 Subject: ${payload.subject}`);

    // In production, integrate with Resend, SendGrid, or Mailgun
    // Example with Resend (recommended for Supabase):
    // const response = await fetch("https://api.resend.com/emails", {
    //   method: "POST",
    //   headers: {
    //     "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     from: "noreply@nurova.com.au",
    //     to: recipients,
    //     subject: payload.subject,
    //     html: payload.html || payload.body,
    //   }),
    // });

    // For now, simulate successful send
    const simulatedDelay = new Promise(resolve => setTimeout(resolve, 100));
    await simulatedDelay;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Email sent to ${recipients.join(", ")}`,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Email service error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to send email",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
