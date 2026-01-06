import { IBooking } from "../models/bookingModel";
import { IProperty } from "../models/propertyModel";
import { BookingResponseDto, VerifyPaymentResponseDto, CalculateTotalResponseDto, CreateRazorpayOrderResponseDto , BookingListItemDto, BookingDetailsDto, OwnerBookingStatsDto} from "../dtos/booking.dto";
import { STATUS_CODES } from "../utils/constants";
import { BookingStatus, PaymentStatus } from "../models/status/status";

export class BookingMapper {
  static toBookingResponse(booking: IBooking): BookingResponseDto {
    return {
      id: booking._id.toString(),
      bookingId: booking.bookingId,

      userId: booking.userId.toString(),
      ownerId: booking.ownerId.toString(),
      propertyId: booking.propertyId.toString(),

      moveInDate: booking.moveInDate,
      endDate: booking.endDate,
      rentalPeriod: booking.rentalPeriod,
      guests: booking.guests,

      rentPerMonth: booking.rentPerMonth,
      totalCost: booking.totalCost,

      paymentMethod: booking.paymentMethod,
      paymentId: booking.paymentId,
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.bookingStatus,

      isCancelled: booking.isCancelled,
      refundAmount: booking.refundAmount,

      createdAt: booking.createdAt,
    };
  }

  static toVerifyPaymentResponse(
    booking: IBooking,
    message:string,
    property?: IProperty
  ): VerifyPaymentResponseDto {
    return {
      message: "Booking confirmed successfully",
      status: STATUS_CODES.OK,
      booking: this.toBookingResponse(booking),
      property: property
       ? {
            title: property.title,
            houseNumber: property.houseNumber,
            street: property.street,
            city: property.city,
            pricePerMonth: property.pricePerMonth,
          }
        : undefined,
    };
  }

static toCalculateTotalResponse(totalAmount: number): CalculateTotalResponseDto {
    return {
      status: STATUS_CODES.OK,
      message: "Total calculated successfully",
      totalAmount,
    };
  }

  static toCreateOrderResponse(
    totalAmount: number,
    razorpayOrderId: string
  ): CreateRazorpayOrderResponseDto {
    return {
      status: STATUS_CODES.OK,
      message: "Razorpay order created successfully",
      totalAmount,
      razorpayOrderId,
    };
  }

static toDto(booking: IBooking): BookingListItemDto {
    const property = booking.propertyId as any; 
    const user = booking.userId as any; 

    return {
      id: booking._id.toString(),
      bookingId: booking.bookingId,
      moveInDate: booking.moveInDate,
      endDate: booking.endDate,
      rentalPeriod: booking.rentalPeriod,
      guests: booking.guests,
      totalCost: booking.totalCost,
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.bookingStatus,
      property: property
        ? {
            id: property._id.toString(),
            title: property.title,
            city: property.city,
            images: property.images || [],
          }
        : {
            id: "",
            title: "-",
            city: "-",
            images: [],
          },

      user: user
      ? {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        }
      : undefined,
  
    };
  }

  static toDtoList(bookings: IBooking[]): BookingListItemDto[] {
    return bookings.map(this.toDto);
  }
  

static toBookingDetailsDto(booking: IBooking): BookingDetailsDto {
  const property = booking.propertyId as any;
  const user = booking.userId as any;

  return {
    id: booking._id.toString(),
    bookingId: booking.bookingId,

    moveInDate: booking.moveInDate,
    endDate: booking.endDate,
    rentalPeriod: booking.rentalPeriod,
    guests: booking.guests,

    rentPerMonth: booking.rentPerMonth,
    totalCost: booking.totalCost,

    paymentId: booking.paymentId,
    paymentStatus: booking.paymentStatus,
    bookingStatus: booking.bookingStatus,
    paymentMethod: booking.paymentMethod,
    refundAmount: booking.refundAmount,

    createdAt: booking.createdAt,

    property: {
      id: property._id.toString(),
      title: property.title,
      description: property.description,
      city: property.city,
      address: `${property.houseNumber}, ${property.street}`,
      images: property.images || [],
      pricePerMonth: property.pricePerMonth,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      furnishing: property.furnishing,
      street:property.street,
      type: property.type,
      district:property.district,
      state:property.state,
      pincode:property.pincode,
      houseNumber: property.houseNumber
      
    },

    user: user
        ? {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address
              ? {
                  houseNo: user.address.houseNo,
                  street: user.address.street,
                  city: user.address.city,
                  district: user.address.district,
                  state: user.address.state,
                  pincode: user.address.pincode,
                }
              : undefined,
          }
        : undefined,
    
  };
}

 static toOwnerBookingStatsDto(stats: {
    totalBookings: number;
    bookingsByStatus: Record<BookingStatus, number>;
    bookingsByTimeline: { upcoming: number; ongoing: number; past: number };
    revenue: { totalRevenue: number; refundedAmount: number };
    paymentStats: Record<PaymentStatus, number>;
  }): OwnerBookingStatsDto {
    return {
      totalBookings: stats.totalBookings,
      bookingsByStatus: {
        pending: stats.bookingsByStatus[BookingStatus.Pending] || 0,
        confirmed: stats.bookingsByStatus[BookingStatus.Confirmed] || 0,
        cancelled: stats.bookingsByStatus[BookingStatus.Cancelled] || 0,
        completed: stats.bookingsByStatus[BookingStatus.Completed] || 0,
      },
      bookingsByTimeline: stats.bookingsByTimeline,
      revenue: stats.revenue,
      paymentStats: {
        paid: stats.paymentStats[PaymentStatus.Completed] || 0,
        pending: stats.paymentStats[PaymentStatus.Pending] || 0,
        failed: stats.paymentStats[PaymentStatus.Failed] || 0,
      },
    };
  }

}
