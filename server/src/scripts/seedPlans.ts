import "dotenv/config";
import mongoose from "mongoose";
import SubscriptionPlan from "../models/subscriptionPlan"; // adjust path

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env");
}

async function seedPlans() {
  try {
    await mongoose.connect(DATABASE_URL as string);

    const plans = [
      { name: "Silver", duration: "30 days", price: 999 },
      { name: "Gold", duration: "30 days", price: 1999 },
      { name: "Platinum", duration: "30 days", price: 2999 },
    ];

    for (const plan of plans) {
      const exists = await SubscriptionPlan.findOne({ name: plan.name });

      if (!exists) {
        await SubscriptionPlan.create(plan);
        console.log(`✅ Seeded ${plan.name} plan`);
      } else {
        console.log(`⚠️ ${plan.name} plan already exists, skipping`);
      }
    }

    console.log("🎉 Subscription plans seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error(" Error seeding plans:", error);
    process.exit(1);
  }
}

seedPlans();
