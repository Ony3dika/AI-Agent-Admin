"use client";
import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useStore } from "../../../store";

const OrdersPage = () => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const coach = useStore((state) => state.coach);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);

  //fetch orders
  const fetchOrders = async () => {
    const access_token = sessionStorage.getItem("authAdmin");
    setError(null);
    try {
      const res = await fetch(`${baseURL}/admin/orders/coach/${coach.id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(errorData);
      }
      const data = await res.json();
      console.log(data);
      setOrders(data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <main className='text-white'>
      <table className='table-fixed w-full text-sm'>
        <thead className='bg-[#262a35]'>
          <tr className='text-txt2'>
            <th className='text-center font-normal p-3 rounded-tl-lg'>
              Transaction Id
            </th>
            <th className='text-center font-normal'>Email</th>
            <th className='text-center font-normal'>Amount</th>
            <th className='text-center font-normal'>Currency</th>
            <th className='text-center font-normal'>Date Initiated</th>
            <th className='text-center font-normal rounded-tr-lg'>Status</th>
          </tr>
        </thead>

        <tbody>
          {orders &&
            orders
              .slice()
              .reverse()
              .map((item, index) => {
                const createdAt = item.created_at;
                const date = new Date(createdAt);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
                const day = String(date.getDate()).padStart(2, "0");
                const formattedDate = `${day}-${month}-${year}`;
                return (
                  <tr
                    className={`text-white border-y border-[#262a35] ${
                      index % 2 == 0 ? "bg-[#1d202a]/50" : "bg-[#1f232e]"
                    }`}
                    key={index}
                  >
                    <td className='p-3 flex items-center text-xs'>{item.id}</td>
                    <td className='text-center'>{item.lead.email}</td>
                    <td className='text-center'>{item.amount}</td>
                    <td className='text-center'>{item.currency}</td>
                    <td className='text-center'>{formattedDate}</td>
                    <td
                      className={`text-center ${
                        item.payment_status === "completed"
                          ? "text-green-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {item.payment_status}
                    </td>
                  </tr>
                );
              })}
        </tbody>
      </table>
    </main>
  );
};

export default OrdersPage;
