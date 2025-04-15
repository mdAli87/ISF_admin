import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import notificationapi from "npm:notificationapi-node-server-sdk";

// Initialize with environment variables
notificationapi.init(
  Deno.env.get("NOTIFICATIONAPI_CLIENT_ID") || "",
  Deno.env.get("NOTIFICATIONAPI_CLIENT_SECRET") || ""
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    // Get request data
    const { userId, userEmail, userNumber, mergeTags } = await req.json();

    // Validate required fields
    if (!userId || !userEmail) {
      throw new Error("userId and userEmail are required");
    }

    // Send notification
    await notificationapi.send({
      notificationId: "isf_admin",
      user: {
        id: userId,
        email: userEmail,
        ...(userNumber && { number: userNumber }) // Only include number if provided
      },
      mergeTags // Optional object for dynamic data
    });

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
        },
        status: 200
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
        },
        status: 400
      }
    );
  }
}); 