import Stripe from "stripe";
import { buffer } from "micro";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const sig = req.headers["stripe-signature"];
  const buf = await buffer(req);
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature failed", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const session = event.data.object;

  switch (event.type) {
    case "checkout.session.completed": {
      const customerId = session.customer;

      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("stripe_customer", customerId)
        .single();

      if (profile) {
        await supabaseAdmin
          .from("profiles")
          .update({ plan: "pro", is_subscribed: true })
          .eq("id", profile.id);
      }

      break;
    }

    case "customer.subscription.deleted": {
      const customerId = session.customer;

      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("stripe_customer", customerId)
        .single();

      if (profile) {
        await supabaseAdmin
          .from("profiles")
          .update({ plan: "free", is_subscribed: false })
          .eq("id", profile.id);
      }

      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}
