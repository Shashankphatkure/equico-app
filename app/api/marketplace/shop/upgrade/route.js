import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { plan } = await req.json();
    const userId = req.user.id;

    const shop = await prisma.tackShop.findFirst({
      where: { ownerId: userId },
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price:
            plan === "monthly"
              ? process.env.STRIPE_MONTHLY_PRICE_ID
              : process.env.STRIPE_ANNUAL_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/marketplace/shop?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/marketplace/shop/upgrade`,
      metadata: {
        shopId: shop.id,
        userId,
        plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}
