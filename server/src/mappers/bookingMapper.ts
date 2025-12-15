import { IBooking } from "../models/bookingModel";
import { IProperty } from "../models/propertyModel";
import { BookingResponseDto, VerifyPaymentResponseDto, CalculateTotalResponseDto, CreateRazorpayOrderResponseDto , BookingListItemDto} from "../dtos/booking.dto";
import { STATUS_CODES } from "../utils/constants";

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
    };
  }

  static toDtoList(bookings: IBooking[]): BookingListItemDto[] {
    return bookings.map(this.toDto);
  }
  

}
