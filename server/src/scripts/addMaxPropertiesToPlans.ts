import "dotenv/config";
import mongoose from "mongoose";
import SubscriptionPlan from "../models/subscriptionPlan";

const DATABASE_URL = process.env.DATABASE_URL!;

async function addMaxProperties() {
  await mongoose.connect(DATABASE_URL);

  await SubscriptionPlan.updateOne(
    { name: "Silver" },
    { $set: { maxProperties: 2 } }
  );

  await SubscriptionPlan.updateOne(
    { name: "Gold" },
    { $set: { maxProperties: 5 } }
  );

  await SubscriptionPlan.updateOne(
    { name: "Platinum" },
    { $set: { maxProperties: null } }
  );

  console.log("✅ maxProperties added to existing plans");
  process.exit(0);
}

addMaxProperties();
