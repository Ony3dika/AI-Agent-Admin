"use client";
import React, { useState, useEffect } from "react";
import Dropdown from "@/components/dropdown";
import { IoIosArrowDown } from "react-icons/io";
import { RxReload } from "react-icons/rx";
import { CiSearch } from "react-icons/ci";
import Image from "next/image";
import loader from "@/../../public/loader2.svg";

const CoachPage = () => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coaches, setCoaches] = useState([]);

  // Fetch Coaches
  const fetchCoaches = async () => {
    const access_token = sessionStorage.getItem("authAdmin");
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${baseURL}/clients`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch Coach");
      }
      const data = await res.json();
      setCoaches(data);
      console.log(data);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  return (
    <main className='text-txt mt-5 h-[75vh] overflow-y-scroll'>
      <section className='flex h-16 w-full justify-between'>
        <div className='basis-1/3 flex'>
          <div>
            <p className='text-white text-2xl'>Coaches</p>
            <p className='text-sm mt-1 text-txt2'>Admin / Coaches</p>
          </div>
        </div>
        <Dropdown />
      </section>

      <section className='flex text-sm mt-5 mb-3 w-1/3 bg-[#1f232e] py-2 px-4 rounded-lg border-2 items-center border-[#262a35]'>
        <div className='basis-[13%]'>
          <CiSearch size={"1.7rem"} />
        </div>
        <input
          type='text'
          className='bg-transparent basis-full outline-none'
          placeholder='Search Coaches'
        />
      </section>
      {/* Clients */}
      <table className='table-fixed w-full text-sm'>
        <thead className='bg-[#262a35]'>
          <tr className='text-txt2'>
            <th className='text-start font-normal p-3 rounded-tl-lg'>
              Coach Details
            </th>
            <th className='text-start font-normal'>Creadted By</th>
            <th className='text-start font-normal'>Status</th>
            <th className='text-start font-normal'>Views</th>

            <th className='text-start font-normal'>Leads</th>
            <th className='text-start font-normal'>Date Created</th>
            <th className='text-start font-normal rounded-tr-lg'>Action</th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan='7'>
                <center>
                  <Image src={loader} className='h-16' alt='loading' />
                  <p>Loading ...</p>
                </center>
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan='7' className='text-center p-5'>
                <p className='inline'>{error}</p>

                <button
                  onClick={() => fetchCoaches()}
                  className='bg-border text-txt hover:animate-spin hover:text-blue  transition-all ease-in-out p-3 ml-2 rounded-full'
                >
                  <RxReload size={"1rem"} />
                </button>
              </td>
            </tr>
          ) : (
            coaches.map((item, index) => {
              const createdAt = item.created_at;
              const date = new Date(createdAt);
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
              const day = String(date.getDate()).padStart(2, "0");
              const formattedDate = `${year}-${month}-${day}`;
              return (
                <tr
                  className={`text-white border-y border-[#262a35] ${
                    index % 2 == 0 ? "bg-[#1d202a]/50" : "bg-[#1f232e]"
                  }`}
                  key={index}
                >
                  <td className='p-3'>{item.first_name}</td>
                  <td>{item.email}</td>
                  <td className='text-blue'>
                    {item.is_active ? "Active" : "Disabled"}
                  </td>
                  <td>{item.industry}</td>
                  <td>{item.role}</td>

                  <td>{formattedDate}</td>

                  <td>
                    <button className='bg-border m-1 px-4 py-1 flex items-center rounded-md'>
                      Actions <IoIosArrowDown className='text-txt' />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </main>
  );
};

export default CoachPage;
