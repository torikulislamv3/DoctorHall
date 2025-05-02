import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

export default function MyAppointments() {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormate = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };

  const getUserAppointments = async () => {
    try {
      if (!token || !backendUrl) {
        toast.error("Missing token or backend URL");
        return;
      }

      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      } else {
        toast.error("No appointments found");
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handlePayOnline = async (appointmentId, totalAmount) => {
    try {
      // Make a POST request to initiate the payment
      const { data } = await axios.post(`${backendUrl}/api/payment/initiate`, {
        total_amount: totalAmount,
        user: {
          name: "John Doe", // Replace with dynamic user data
          email: "johndoe@example.com", // Replace with dynamic user data
          address: "123 Main St", // Replace with dynamic user data
          phone: "1234567890", // Replace with dynamic user data
        },
        appointmentId: appointmentId,
      });

      if (data.success) {
        toast.success(
          "Thank you for the payment. Redirecting to payment gateway..."
        );

        // Redirect user to the payment gateway URL
        window.location.href = data.url; // Assuming `data.url` contains the gateway URL
      } else {
        toast.error("❌ Payment initialization failed");
      }
    } catch (error) {
      // Handle error
      console.error("Error initiating payment:", error);
      toast.error("❌ Error initiating payment");
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointments
      </p>
      {appointments.map((item, index) => (
        <div
          className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
          key={index}
        >
          <div>
            <img
              className="w-32 bg-indigo-50"
              src={item.docData.image}
              alt=""
            />
          </div>
          <div className="flex-1 text-zinc-600 text-sm">
            <p className="text-neutral-800 font-semibold">
              {item.docData.name}
            </p>
            <p>{item.docData.speciality}</p>
            <p className="text-zinc-700 font-medium mt-1">Address:</p>
            <p className="text-xs">{item.docData.address.line1}</p>
            <p className="text-xs">{item.docData.address.line1}</p>
            <p className="text-xm mt-1 ">
              <span className="text-sm text-neutral-700 font-medium">
                Date & Time:
              </span>
              {slotDateFormate(item.slotDate)} | {item.slotTime}{" "}
            </p>
          </div>

          <div></div>

          <div className="flex flex-col gap-2 justify-end">
            {!item.cancelled && item.payment && !item.isCompleted && (
              <button className="sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50">
                Paid
              </button>
            )}
            {!item.cancelled && !item.payment && !item.isCompleted && (
              <button
                onClick={() =>
                  handlePayOnline(item._id, item.amount, item.userData)
                }
                className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
              >
                Pay Online
              </button>
            )}
            {!item.cancelled && !item.isCompleted && (
              <button
                onClick={() => cancelAppointment(item._id)}
                className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
              >
                Cancel Appointment
              </button>
            )}
            {item.cancelled && !item.isCompleted && (
              <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                Appointment Cancelled
              </button>
            )}
            {item.isCompleted && (
              <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                Completed
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
