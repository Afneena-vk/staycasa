import React, { useState, useEffect } from "react";
import Header from "../../components/User/Header";
import Footer from "../../components/User/Footer";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import { paymentService } from "../../services/paymentService";
import { authService } from "../../services/authService";
import { userService } from "../../services/userService";

declare global {
  interface Window {
    Razorpay: any;
  }
}


const PaymentPage = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "razorpay" | "">("");
  const property = useAuthStore((state) => state.selectedProperty);
  const bookingData = useAuthStore(state => state.bookingData)
  const [backendTotal, setBackendTotal] = useState<number>(0);
//   const [orderId, setOrderId] = useState<string>("");
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  //const [razorpayInstance, setRazorpayInstance] = useState<any>(null);
  //const user = useAuthStore((state) => state.user);

  const navigate = useNavigate();

 

  const previewTotal =
  property?.pricePerMonth && bookingData?.rentalPeriod
    ? property.pricePerMonth * bookingData.rentalPeriod
    : 0;

  useEffect(() => {
   
    // if (!bookingData || !bookingData.propertyId) {
    //   navigate("/user/checkout");   
    // }
     if (!bookingData?.propertyId) {
    navigate("/user/properties");
    return;
  }

     const { propertyId, rentalPeriod } = bookingData;

    const fetchTotal = async () =>{
        try {
            const data = await paymentService.calculateTotal(
                //   bookingData.propertyId,
                //   bookingData.rentalPeriod
                   propertyId,
                   rentalPeriod
            )


        
             setBackendTotal(data.totalAmount);
            //  setOrderId(data.razorpayOrderId);

        } catch (err) {
            console.error("Error preparing payment order", err);
        }
    }
    fetchTotal();

  }, [bookingData, navigate]);
  

    const openRazorpayCheckout = (orderData: { totalAmount: number; razorpayOrderId: string }) => {
    if (!bookingData) return;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.totalAmount * 100, 
      currency: "INR",
      name: "Vacation Home Booking",
      description: "Property Booking Payment",
      order_id: orderData.razorpayOrderId,
      handler: async function (response: any) {
        console.log("Payment Success:", response);
        const result= await paymentService.verifyPayment({
             razorpay_payment_id: response.razorpay_payment_id,
             razorpay_order_id: response.razorpay_order_id,
             razorpay_signature: response.razorpay_signature,
             propertyId: bookingData.propertyId,
             moveInDate: bookingData.moveInDate,
             rentalPeriod: bookingData.rentalPeriod,
             guests: bookingData.guests,
         })
       

 console.log("Backend result:", result);
  console.log("result.property:", result.property);
  console.log("result.booking:", result.booking);

        //navigate("/user/booking-success");
        navigate("/user/booking-success", {
  state: {
    booking: result.booking,
    property: result.property,
    paymentId: response.razorpay_payment_id,
    orderId: response.razorpay_order_id,
  },
});
//  clearBookingData();



      },

 modal: {
    ondismiss: function () {
      console.log("Razorpay modal closed by user");

      navigate("/user/booking-failure", {
        state: {
          reason: "Payment was cancelled ",
        },
      });
    },
  },

 
    prefill: {
//   name: user?.name || "",
//   email: user?.email || "",
//   contact: user?.phone || "",
  contact: "9999999999",
},

      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response: any) {
  console.error("Payment Failed:", response.error);
  navigate("/user/booking-failure", {
    state: {
      reason: response.error.description || "Payment failed. Please try again."
    }
  });
});
    rzp.open();
  };


  const handlePaySecurely = async ()=> {

        if (!paymentMethod || !bookingData) return;

          setLoadingPayment(true);
          setErrorMessage("");

  try {
    
    const availability = await userService.checkAvailability(
      bookingData.propertyId,
      bookingData.moveInDate,
      bookingData.rentalPeriod,
      bookingData.guests
    );

       if (!availability.available) {
      setErrorMessage(availability.message || "Property not available.");
      setLoadingPayment(false);
      return;
    }

    const orderData= await paymentService.createRazorpayOrder(
          bookingData.propertyId,
          bookingData.rentalPeriod,
          bookingData.guests,
          bookingData.moveInDate

    )
   openRazorpayCheckout(orderData);

  } catch (error:any) {
       console.error("Payment error:", error);
    // setErrorMessage("Something went wrong. Please try again.")
      const msg = error?.response?.data?.message || "Something went wrong. Please try again.";
      setErrorMessage(msg);
  } finally {
    setLoadingPayment(false);
   }
  };


  if (!property) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow pt-24 flex justify-center items-center">
        <p className="text-gray-600">Loading property...</p>
      </main>
      <Footer />
    </div>
  );
}


  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      {/* ---------------- HEADER ---------------- */}
      <Header />

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="flex-grow py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* -------- Booking Summary -------- */}
          <div className="bg-white rounded-2xl shadow-sm border p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              Booking Summary
            </h2>

            <img
            //   src={property.images?.[0] || ""}
            //    alt={property.title}
            src={property?.images?.[0] || ""}
alt={property?.title || "Property"}
              className="rounded-xl mb-5 w-full object-cover"
            />

            <h3 className="font-semibold text-gray-900 text-lg">
            {property.title}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
               {`${property.houseNumber}, ${property.street}, ${property.city}, ${property.district}, ${property.state} - ${property.pincode}`}
            </p>

            <div className="mt-5 space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Move-in Date</span>
                <span className="font-medium">{bookingData?.moveInDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Rental Period</span>
                <span className="font-medium">{bookingData?.rentalPeriod}</span>
              </div>
              <div className="flex justify-between">
                <span>Guests</span>
                <span className="font-medium">{bookingData?.guests}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Total Amount</span>
              {/* <span className="text-2xl font-bold text-blue-600">{previewTotal}</span> */}
              <span className="text-2xl font-bold text-blue-600">{backendTotal}</span>
            </div>
          </div>

          {/* -------- Payment Section -------- */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border p-8">

            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Select Payment Method
            </h2>

            <div className="space-y-5">

              {/* Wallet */}
              <label
                className={`flex items-center justify-between p-5 rounded-xl border cursor-pointer transition
                  ${paymentMethod === "wallet"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-600">
                    ₹
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Wallet</p>
                    <p className="text-sm text-gray-500">
                      Use your wallet balance
                    </p>
                  </div>
                </div>

                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "wallet"}
                  onChange={() => setPaymentMethod("wallet")}
                />
              </label>

              {/* Razorpay */}
              <label
                className={`flex items-center justify-between p-5 rounded-xl border cursor-pointer transition
                  ${paymentMethod === "razorpay"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    RZ
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Razorpay</p>
                    <p className="text-sm text-gray-500">
                      UPI • Cards • Netbanking
                    </p>
                  </div>
                </div>

                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "razorpay"}
                  onChange={() => setPaymentMethod("razorpay")}
                />
              </label>
            </div>

            {/* Pay Button */}
            <button
              disabled={!paymentMethod || loadingPayment}
              onClick={handlePaySecurely}
              className={`mt-10 w-full py-4 text-lg font-semibold rounded-xl transition
                ${paymentMethod
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              {/* Pay Securely */}
                {loadingPayment ? "Processing..." : "Pay Securely"}
            </button>
          </div>
        </div>
      </main>

      {/* ----------- FOOTER ----------- */}
      <Footer />

    </div>
  );
};

export default PaymentPage;
