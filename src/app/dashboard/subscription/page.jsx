"use client";
import React, { useState, useEffect, useRef } from "react";
import Dropdown from "@/components/dropdown";
import { IoIosArrowDown } from "react-icons/io";
import { RxReload } from "react-icons/rx";
import { CiSearch, CiExport } from "react-icons/ci";
import { CSVLink } from "react-csv";
import Image from "next/image";
import loader from "@/../../public/loader2.svg";

const SubPage = () => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);
  const [error, setError] = useState(null);
  const [subs, setSubs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  //Fetch subs
  const fetchSubs = async () => {
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
        const errorData = await res.text();
        throw new Error(errorData);
      }
      const data = await res.json();
      setSubs(data);
      console.log(data);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const filteredSubs = subs.filter(
    (sub) =>
      sub.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchSubs();
  }, []);

  const openModal = () => {
    setIsOpen(true);
  };

  const handleModalClick = (e) => {
    e.stopPropagation(); // Prevent closing modal when modal content is clicked
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <main className='text-txt mt-5 h-[90vh] overflow-y-scroll'>
      <section className='flex h-16 w-full justify-between'>
        <div className='basis-1/3 flex'>
          <div>
            <p className='text-white text-2xl'>Subscriptions</p>
            <p className='text-sm mt-1 text-txt2'>Admin / Subscriptions</p>
          </div>
        </div>
        <Dropdown />
      </section>

      <section className='flex justify-between items-center'>
        <section className='flex text-sm mt-5 mb-3 w-1/3 bg-[#1f232e] py-2 px-4 rounded-lg border-2 items-center border-[#262a35]'>
          <div className='basis-[13%]'>
            <CiSearch size={"1.7rem"} />
          </div>
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='bg-transparent basis-full outline-none'
            placeholder='Search Subscriptions'
          />
        </section>

        <section className='flex items-center text-sm'>
          <div className='flex items-center relative mr-5'>
            <p className='text-txt mr-3'>Status</p>

            <select className='w-20 py-2 px-3 mt-2 bg-border placeholder:text-white text-white border-2 border-[#262A35] rounded-lg transition duration-300 ease focus:shadow-md appearance-none cursor-pointer outline-none'>
              <option onClick={() => setSearchQuery("Online")}>Online</option>
              <option onClick={() => setSearchQuery("Offline")}>Offline</option>
            </select>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke-width='1'
              stroke='currentColor'
              className='h-6 text-txt2'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                d='M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9'
              />
            </svg>
          </div>

          <CSVLink
            className='bg-gradient-to-r from-purple to-blue text-white px-4 py-2 flex items-center rounded-md'
            data={subs}
          >
            {" "}
            <CiExport size={"1.2rem"} className='mr-2' />
            Export CSV
          </CSVLink>
        </section>
      </section>

      {/* Clients */}
      <table className='table-fixed w-full text-sm'>
        <thead className='bg-[#262a35]'>
          <tr className='text-txt2'>
            <th className='text-center font-normal p-3 rounded-tl-lg'>
              Customer
            </th>
            <th className='text-center font-normal'>Amount Paid</th>
            <th className='text-center font-normal'>Credit Units</th>
            <th className='text-center font-normal'>Credit Left</th>

            <th className='text-center font-normal'>Status</th>
            <th className='text-center font-normal'>Date Subscribed</th>
            <th className='text-centerfont-normal rounded-tr-lg'>Action</th>
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
                  onClick={() => fetchSubs()}
                  className='bg-border text-txt hover:animate-spin hover:text-blue  transition-all ease-in-out p-3 ml-2 rounded-full'
                >
                  <RxReload size={"1rem"} />
                </button>
              </td>
            </tr>
          ) : (
            filteredSubs.map((item, index) => {
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
                  <td className='p-3 text-center'>{item.first_name}</td>
                  <td className='text-center'>{item.email}</td>
                  <td className='text-center'>{item.credits}</td>
                  <td className='text-center'> {item.industry}</td>
                  <td className='text-blue text-center'>
                    {item.is_active ? "Online" : "Offline"}
                  </td>
                  <td className='text-center'>{formattedDate}</td>

                  <td className='flex justify-center'>
                    <button
                      onClick={openModal}
                      className='bg-border m-1 px-4 py-1 flex items-center rounded-md'
                    >
                      Actions <IoIosArrowDown className='text-txt' />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {isOpen && (
        <section className='fixed top-0 left-0 w-screen z-20 h-screen bg-black/30 backdrop-blur rounded-md shadow-md'>
          <div
            onClick={handleModalClick}
            ref={modalRef}
            className='h-[16%] aspect-square absolute bg-[#14161c] flex flex-col border border-border items-center justify-center right-20 top-40 rounded-md'
          ></div>
        </section>
      )}
    </main>
  );
};

export default SubPage;
