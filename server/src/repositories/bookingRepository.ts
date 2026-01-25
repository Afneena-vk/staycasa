import { injectable } from "tsyringe";
import Booking,{IBooking} from '../models/bookingModel';
import { BaseRepository } from "./baseRepository";
import { IBookingRepository, FindByUserOptions } from "./interfaces/IBookingRepository";  
import { BookingStatus,PaymentStatus } from "../models/status/status";
import mongoose from "mongoose";

@injectable()
export class BookingRepository extends BaseRepository<IBooking> implements IBookingRepository {
  constructor() {
    super(Booking);
  }

  async getConfirmedBookingsByPropertyId(propertyId: string): Promise<IBooking[]> {
      return Booking.find({
        propertyId,
        bookingStatus:BookingStatus.Confirmed,
        isCancelled:false,
      }

      )
  }

  async findConflictingBookings(propertyId: string, start:Date, end:Date){
       return Booking.findOne({
        propertyId,
        bookingStatus:BookingStatus.Confirmed,
        isCancelled:false,
        moveInDate: { $lte: end },
        endDate: { $gte: start },
       })
  }

  async findById(id: string): Promise<IBooking | null> {
  return await Booking.findById(id)
    .populate('propertyId')
    .populate('userId')
    .populate('ownerId');
}


async findByUserId(userId: string): Promise<IBooking[]> {
  return Booking.find({ userId })
    .populate('propertyId')
    .populate('ownerId')
    .sort({ createdAt: -1 }); 
}


// const isBookingIdSearch =
//     typeof search === "string" && search.startsWith("BK");
// match:
// //         !isBookingIdSearch && search
//   const filteredBookings = isBookingIdSearch
//     ? bookings
//     : bookings.filter(b => b.propertyId);

async findByUserWithQuery(
  userId: string,
  options: FindByUserOptions
) {
  const {
    search,
    status,
    paymentStatus,
    startDate,
    endDate,
    bookingType,
    page = 1,
    limit = 9,
    sortField = "createdAt",
    sortOrder = "desc",
  } = options;

  const query: any = { userId };

  if (status) query.bookingStatus = status;
  if (paymentStatus) query.paymentStatus = paymentStatus;

 
  // if (startDate) {
  //   query.endDate = { $gte: new Date(startDate) };
  // }
  // if (endDate) {
  //   query.endDate = { $lt: new Date(endDate) };
  // }

  const today= new Date();
today.setHours(0,0,0,0);

  if (bookingType === "past") {
    query.endDate = { $lt: today };
  }


  if (bookingType === "ongoing") {
    query.moveInDate = { $lte: today };
    query.endDate = { $gte: today };
  }

   if (bookingType === "upcoming") {
    query.moveInDate = { $gt: today };
  }


  const total = await Booking.countDocuments(query);

  const bookings = await Booking.find(query)
    .populate({
      path: "propertyId",
      match: search
        ? { title: { $regex: search, $options: "i" } }
        : {},
    })
    .populate("ownerId")
    .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  
  const filteredBookings = bookings.filter(b => b.propertyId);

  return { bookings: filteredBookings, total };
}

  async findByIdAndUser(
    bookingId: string,
    userId: string
  ): Promise<IBooking | null>{
    return Booking.findOne({
      _id: bookingId,
      userId,
    })
       .populate("propertyId")
       .populate("ownerId");
  }

  async findByIdAndOwner(
    bookingId: string,
    ownerId: string,
  ): Promise<IBooking | null>{
    return Booking.findOne({
     _id: bookingId,
     ownerId,     
    })
    .populate("propertyId")
    .populate("userId")
    .populate("ownerId");
  }


async getBookedRanges(propertyId: string) {
  return Booking.find({
    propertyId,
    bookingStatus: BookingStatus.Confirmed,
    isCancelled: false,
  }).select("moveInDate endDate -_id");
}

//  async findByOwnerWithQuery(
//   ownerId: string,
//   options: FindByUserOptions
// ) {
//   const {
//     search,
//     status,
//     paymentStatus,
//     startDate,
//     endDate,
//     bookingType,
//     page = 1,
//     limit = 10,
//     sortField = "createdAt",
//     sortOrder = "desc",
//   } = options;

//   const query: any = { ownerId };

//   if (status) query.bookingStatus = status;
//   if (paymentStatus) query.paymentStatus = paymentStatus;

// // if (startDate || endDate) {
// //   query.endDate = {};

// //   if (startDate) {
// //     query.endDate.$gte = new Date(startDate);
// //   }

// //   if (endDate) {
// //     const end = new Date(endDate);
// //     end.setHours(23, 59, 59, 999);
// //     query.endDate.$lte = end;
// //   }
// // }


// const today= new Date();
// today.setHours(0,0,0,0);

//   if (bookingType === "past") {
//     query.endDate = { $lt: today };
//   }


//   if (bookingType === "ongoing") {
//     query.moveInDate = { $lte: today };
//     query.endDate = { $gte: today };
//   }

//    if (bookingType === "upcoming") {
//     query.moveInDate = { $gt: today };
//   }

//   const total = await Booking.countDocuments(query);

//   const bookings = await Booking.find(query)
//     .populate({
//       path: "propertyId",
//       match: search
//         ? { title: { $regex: search, $options: "i" } }
//         : {},
//     })
//     .populate({
//       path: "userId",
//       match: search
//         ? {
//             $or: [
//               { name: { $regex: search, $options: "i" } },
//               { email: { $regex: search, $options: "i" } },
//             ],
//           }
//         : {},
//     })
//     .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 })
//     .skip((page - 1) * limit)
//     .limit(limit);

  
//   const filteredBookings = bookings.filter(
//     //(b) => b.propertyId && b.userId
//       (b) => {
//   if (!search) return true;

//   return Boolean(b.propertyId || b.userId);
  
//     }
  
//   );

//   return { bookings: filteredBookings, total };
// }

async findByOwnerWithQuery(
  ownerId: string,
  options: FindByUserOptions
) {
  const {
    search,
    status,
    paymentStatus,
    startDate,
    endDate,
    bookingType,
    page = 1,
    limit = 10,
    sortField = "createdAt",
    sortOrder = "desc",
  } = options;

  const matchStage: any = { ownerId: new mongoose.Types.ObjectId(ownerId) };

  if (status) matchStage.bookingStatus = status;
  if (paymentStatus) matchStage.paymentStatus = paymentStatus;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (bookingType === "past") {
    matchStage.endDate = { $lt: today };
  }

  if (bookingType === "ongoing") {
    matchStage.moveInDate = { $lte: today };
    matchStage.endDate = { $gte: today };
  }

  if (bookingType === "upcoming") {
    matchStage.moveInDate = { $gt: today };
  }

  const pipeline: any[] = [
    { $match: matchStage },
    {
      $lookup: {
        from: "properties",
        localField: "propertyId",
        foreignField: "_id",
        as: "propertyId",
      },
    },
    { $unwind: "$propertyId" },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userId",
      },
    },
    { $unwind: "$userId" },
  ];

  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { "propertyId.title": { $regex: search, $options: "i" } },
          { "userId.name": { $regex: search, $options: "i" } },
          { "userId.email": { $regex: search, $options: "i" } },
          { bookingId: { $regex: search, $options: "i" } },
        ],
      },
    });
  }


  const countPipeline = [...pipeline, { $count: "total" }];
  const countResult = await Booking.aggregate(countPipeline);
  const total = countResult.length > 0 ? countResult[0].total : 0;

 
  pipeline.push(
    { $sort: { [sortField]: sortOrder === "asc" ? 1 : -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit }
  );

  const bookings = await Booking.aggregate(pipeline);

  return { bookings, total };
}


async findAllByOwner(ownerId:string): Promise<IBooking[]> {
  return Booking.find({
    ownerId: new mongoose.Types.ObjectId(ownerId),
  })
}

async findOwnerBookingsByDate(
  ownerId: string,
  type: "upcoming" | "ongoing" | "past"
): Promise<IBooking[]> {
  const today= new Date();
  today.setHours(0,0,0,0);


 const query: any ={
    ownerId: new mongoose.Types.ObjectId(ownerId),
 };

   if (type === "upcoming") {
     query.moveInDate= {$gt: today}
   }

     if (type === "ongoing") {
     query.moveInDate= { $lte: today };
     query.endDate = { $gte: today };
   }
 
   if (type === "past") {
     query.endDate= {$lt: today}
   }   

   return Booking.find(query);

}

async findConfirmedPaidBookingsByOwner(
  ownerId: string
): Promise<IBooking[]> {

return Booking.find({
  ownerId: new mongoose.Types.ObjectId(ownerId),
  bookingStatus: BookingStatus.Confirmed,
  paymentStatus: PaymentStatus.Completed,
  isCancelled: false,

})

}

async findCancelledBookingsByOwner(
  ownerId:string
): Promise<IBooking[]> {
  return Booking.find({
    ownerId: new mongoose.Types.ObjectId(ownerId),
    isCancelled: true,
  });
}



async countAllConfirmedBookings(): Promise<number> {
  return Booking.countDocuments({
    bookingStatus: BookingStatus.Confirmed,
    isCancelled: false,
  });
}


async cancellBooking(
     bookingId: string,
     refundAmount: number,
): Promise<IBooking | null> {
    return Booking.findByIdAndUpdate(
      bookingId,
       {
      bookingStatus: BookingStatus.Cancelled,
      isCancelled: true,
      refundAmount,
     
    },
    { new: true }
  );
}


async findAllWithQuery(options: FindByUserOptions) {
  const {
    search,
    status,
    paymentStatus,
    startDate,
    endDate,
    bookingType,
    page = 1,
    limit = 10,
    sortField = "createdAt",
    sortOrder = "desc",
  } = options;

  const matchStage: any = {};

  if (status) matchStage.bookingStatus = status;
  if (paymentStatus) matchStage.paymentStatus = paymentStatus;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (bookingType === "past") {
    matchStage.endDate = { $lt: today };
  } else if (bookingType === "ongoing") {
    matchStage.moveInDate = { $lte: today };
    matchStage.endDate = { $gte: today };
  } else if (bookingType === "upcoming") {
    matchStage.moveInDate = { $gt: today };
  }

  if (startDate || endDate) {
    matchStage.moveInDate = matchStage.moveInDate || {};
    if (startDate) matchStage.moveInDate.$gte = startDate;
    if (endDate) matchStage.moveInDate.$lte = endDate;
  }

  const pipeline: any[] = [
    { $match: matchStage },
    {
      $lookup: {
        from: "properties",
        localField: "propertyId",
        foreignField: "_id",
        as: "propertyId",
      },
    },
    { $unwind: "$propertyId" },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userId",
      },
    },
    { $unwind: "$userId" },
    {
      $lookup: {
        from: "owners",
        localField: "ownerId",
        foreignField: "_id",
        as: "ownerId",
      },
    },
    { $unwind: "$ownerId" },
  ];

  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { "propertyId.title": { $regex: search, $options: "i" } },
          { "userId.name": { $regex: search, $options: "i" } },
          { "userId.email": { $regex: search, $options: "i" } },
          { "ownerId.name": { $regex: search, $options: "i" } },
          { bookingId: { $regex: search, $options: "i" } },
        ],
      },
    });
  }

  const countPipeline = [...pipeline, { $count: "total" }];
  const countResult = await Booking.aggregate(countPipeline);
  const total = countResult.length > 0 ? countResult[0].total : 0;

  pipeline.push(
    { $sort: { [sortField]: sortOrder === "asc" ? 1 : -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit }
  );

  const bookings = await Booking.aggregate(pipeline);

  return { bookings, total };
}

async markCompletedBookings(today: Date): Promise<number> {
  const result = await Booking.updateMany(
    {
      bookingStatus: BookingStatus.Confirmed,
      endDate: { $lt: today },
      isCancelled: false,
    },
    {
      $set: {
        bookingStatus: BookingStatus.Completed,
      },
    }
  );

  return result.modifiedCount || 0;
}


async getBookingStatusStatsByOwner(ownerId: string) {
  return Booking.aggregate([
    {
      $match: {
        ownerId: new mongoose.Types.ObjectId(ownerId),
      },
    },
    {
      $group: {
        _id: "$bookingStatus",
        count: { $sum: 1 },
        totalRevenue: { $sum: "$totalCost" },
        refundedAmount: { $sum: "$refundAmount" } 
      },
    },
  ]);
}


 async getBookingStatusCounts(): Promise<{ _id: string; count: number }[]> {
    return await Booking.aggregate([
      {
        $group: {
          _id: '$bookingStatus',
          count: { $sum: 1 }
        }
      }
    ]);
  }

}