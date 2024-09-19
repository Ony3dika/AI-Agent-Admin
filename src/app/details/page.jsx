"use client";
import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useStore } from "../../store";


const DetailsPage = () => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const coach = useStore((state) => state.coach);
  const [error, setError] = useState(null);
  const [leads, setLeads] = useState([]);

  const fetchLeads = async () => {
    const access_token = sessionStorage.getItem("authAdmin");
    setError(null);
    try {
      const res = await fetch(`${baseURL}/admin/leads/get/leads/${coach.id}`, {
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
      setLeads(data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <main className='text-white'>
      <table className='table-fixed w-full text-sm'>
        <thead className='bg-[#262a35]'>
          <tr className='text-txt2'>
            <th className='text-center font-normal p-3 rounded-tl-lg'>
              Customer
            </th>
            <th className='text-center font-normal'>Email</th>
            <th className='text-center font-normal'>Phone Number</th>
            <th className='text-center font-normal'>Date Joined</th>
            <th className='text-center font-normal rounded-tr-lg'>Action</th>
          </tr>
        </thead>

        <tbody>
          {leads && leads.map((item, index) => {
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
                <td className='p-3 flex items-center'>{item.name}</td>
                <td className='text-center'>{item.email}</td>
                <td className='text-center'>{item.phone}</td>
                <td className='text-center'>{formattedDate}</td>
                <td className="flex justify-center">
                  <button
                    // onClick={() => {
                    //   openModal();
                    //   setUserID(item.id);
                    // }}
                    className='bg-border m-1 px-4 py-1 flex items-center rounded-md'
                  >
                    Actions <IoIosArrowDown className='text-txt' />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
};

export default DetailsPage;
