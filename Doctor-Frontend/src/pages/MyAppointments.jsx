import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

export default function MyAppointments() {
  const { backendUrl, token, getDoctorsData } =
    useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state added
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
    if (dateArray.length !== 3) return slotDate; // fallback for invalid format
    return `${dateArray[0]} ${months[Number(dateArray[1])] || "Unknown"} ${
      dateArray[2]
    }`;
  };

  const getUserAppointments = async () => {
    try {
      setLoading(true); // Set loading true when fetching starts
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
      } else {
        toast.error("No appointments found");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false); // Set loading false when fetching is done
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
      toast.error(error.message);
    }
  };

  const handlePayOnline = async (appointmentId, totalAmount) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/payment/initiate`, {
        total_amount: totalAmount,
        user: {
          name: "John Doe",
          email: "johndoe@example.com",
          address: "123 Main St",
          phone:"1234567890"
        },
        appointmentId: appointmentId,
      });

      if (data.success) {
        toast.success(
          "Thank you for the payment. Redirecting to payment gateway..."
        );
        window.location.href = data.url;
      } else {
        toast.error("❌ Payment initialization failed");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("❌ Error initiating payment");
    }
  };

  useEffect(() => {
    if (token && backendUrl) {
      getUserAppointments();
    }
  }, [token, backendUrl]); // Added backendUrl in dependency list

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointments
      </p>
      {loading ? (
        <p className="text-center py-4">Loading appointments...</p> // Loading indicator
      ) : (
        appointments.map((item) => (
          <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
            key={item._id} // Use unique _id instead of index
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
              {item.docData.address.line2 && (
                <p className="text-xs">{item.docData.address.line2}</p>
              )}
              <p className="text-xm mt-1 ">
                <span className="text-sm text-neutral-700 font-medium">
                  Date & Time:
                </span>
                {slotDateFormate(item.slotDate)} | {item.slotTime}
              </p>
            </div>

            <div className="flex flex-col gap-2 justify-end">
              {!item.cancelled && item.payment && !item.isCompleted && (
                <button className="sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50">
                  Paid
                </button>
              )}
              {!item.cancelled && !item.payment && !item.isCompleted && (
                <button
                  onClick={() => handlePayOnline(item._id, item.amount)}
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
        ))
      )}
    </div>
  );
}
