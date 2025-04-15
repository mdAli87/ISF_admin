import { serve } from "https://deno.land/std@0.168.0/http/server.js";
import notificationapi from "npm:notificationapi-node-server-sdk";

// Initialize the notification API with credentials
notificationapi.init(
  Deno.env.get("NOTIFICATIONAPI_CLIENT_ID") || "",
  Deno.env.get("NOTIFICATIONAPI_CLIENT_SECRET") || ""
);

serve(async (req) => {
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

    // Return success response
    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200
      }
    );

  } catch (error) {
    // Return error response
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400
      }
    );
  }
});
