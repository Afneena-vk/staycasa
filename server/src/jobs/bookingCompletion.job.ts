import cron from "node-cron";
import { container } from "tsyringe";
import { TOKENS } from "../config/tokens";
import { IBookingService } from "../services/interfaces/IBookingService";
//import { BookingStatus } from "../models/status/status";

export const startBookingCompletionJob = () => {
  const bookingService = container.resolve<IBookingService>(
    TOKENS.IBookingService
  );

  // Runs every day at 12:00 AM
  // cron.schedule("0 0 * * *", async () => {
  cron.schedule("* * * * *", async () => {
    console.log(" Running booking completion cron job...");
    await bookingService.completeExpiredBookings();
  });
};