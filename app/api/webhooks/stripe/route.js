import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  try {
    const signature = req.headers.get("stripe-signature");
    const body = await req.text();

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { shopId } = session.metadata;

        await prisma.tackShop.update({
          where: { id: shopId },
          data: {
            isPremium: true,
            isVerified: true,
          },
        });

        // Auto-boost existing listings
        await prisma.listing.updateMany({
          where: { shopId },
          data: { isBoosted: true },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const { shopId } = subscription.metadata;

        await prisma.tackShop.update({
          where: { id: shopId },
          data: {
            isPremium: false,
            // Keep verified status
          },
        });

        // Remove boost from listings
        await prisma.listing.updateMany({
          where: { shopId },
          data: { isBoosted: false },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    );
  }
}
