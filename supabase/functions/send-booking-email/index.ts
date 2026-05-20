import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("EMAILS") || Deno.env.get("RESEND_API_KEY");

serve(async (req) => {
  // This gets the newly inserted 'order' row from your database
  const payload = await req.json();
  const order = payload.record;

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "EventNest Tickets <onboarding@resend.dev>", // Note: You can use Resend's testing email for now
      to: order.user, 
      subject: `Your Ticket for ${order.title || 'Event'} is Confirmed!`,
      html: `
        <h1>🎫 EventNest Ticket Confirmation</h1>
        <p>Hi there,</p>
        <p>Your booking for <strong>${order.title || 'Event'}</strong> is confirmed!</p>
        <ul>
          <li><strong>Order ID:</strong> ${order.id}</li>
          <li><strong>Category:</strong> ${order.category || 'N/A'}</li>
          <li><strong>Seats:</strong> ${order.seats}</li>
          <li><strong>Amount Paid:</strong> Rs. ${order.amount}</li>
        </ul>
        <p>Enjoy your event!</p>
      `,
    }),
  });

  return new Response(JSON.stringify(await emailResponse.json()), {
    headers: { "Content-Type": "application/json" },
  });
});
