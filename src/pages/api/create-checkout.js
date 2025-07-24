import { supabaseAdmin } from "@/lib/supabaseAdmin"; // use service role
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { user_id, email } = req.body;

  // Create Stripe customer if not exists
  const customer = await stripe.customers.create({
    email,
    metadata: { user_id },
  });

  // Save customer to Supabase
  await supabaseAdmin
    .from("profiles")
    .update({ stripe_customer: customer.id })
    .eq("id", user_id);

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer: customer.id,
    line_items: [{ price: "price_1RoHEpHSW88F8ZDjkK8hTOL1", quantity: 1 }], // use actual price ID
    success_url: `${req.headers.origin}/dashboard?checkout=success`,
    cancel_url: `${req.headers.origin}/dashboard?checkout=cancel`,
  });

  res.json({ url: session.url });
}
