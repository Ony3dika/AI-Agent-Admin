"use client";
import React, { useState, useEffect } from "react";
import Dropdown from "@/components/dropdown";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { RxReload } from "react-icons/rx";
import { CiSearch, CiExport } from "react-icons/ci";
import { CSVLink } from "react-csv";
import Image from "next/image";
import loader from "@/../../public/loader2.svg";
import head from "@/../../public/profile.svg";
import Link from "next/link";
import { useStore } from "../../../store";

const CoachPage = () => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [coaches, setCoaches] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const updateCoach = useStore((state) => state.updateCoach);

  // Fetch Coaches
  const fetchCoaches = async () => {
    const access_token = sessionStorage.getItem("authAdmin");
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${baseURL}/admin/coaches/?skip=0&limit=99`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(errorData);
      }
      const data = await res.json();
      setCoaches(data);
      // console.log(data);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const filteredCoaches = coaches.filter((coach) =>
    coach.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchCoaches();
  }, []);

  return (
    <main className='text-txt mt-5 h-[90vh] overflow-y-scroll'>
      <section className='flex h-16 w-full justify-between'>
        <div className='basis-1/3 flex'>
          <div>
            <p className='text-white text-2xl'>Coaches</p>
            <p className='text-sm mt-1 text-txt2'>Admin / Coaches</p>
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
            placeholder='Search Coach'
          />
        </section>

        <section className='flex items-center text-sm'>
          <div className='flex items-center relative mr-5'>
            <p className='text-txt mr-3'>Status</p>

            <select className='w-20 py-2 px-3 mt-2 bg-border placeholder:text-white text-white border-2 border-[#262A35] rounded-lg transition duration-300 ease focus:shadow-md appearance-none cursor-pointer outline-none'>
              <option onClick={() => setSearchQuery("Red")}>Active</option>
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
            data={coaches}
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
            <th className='text-start font-normal p-3 rounded-tl-lg'>
              Coach Details
            </th>
            <th className='text-start font-normal'>Creadted By</th>
            <th className='text-start font-normal'>Status</th>
            <th className='text-start font-normal'>Views</th>

            {/* <th className='text-start font-normal'>Leads</th> */}
            <th className='text-start font-normal'>Date Created</th>
            <th className='text-start font-normal rounded-tr-lg'>Action</th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan='6'>
                <center>
                  <Image src={loader} className='h-16' alt='loading' />
                  <p>Loading ...</p>
                </center>
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan='6' className='text-center p-5'>
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
            filteredCoaches.map((item, index) => {
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
                  <td className='p-3 flex items-center'>
                    <Image
                      width={700}
                      height={700}
                      className='w-10 h-10 rounded-full mr-2 object-center object-cover'
                      src={item.avatar ? item.avatar : head}
                      alt='coach'
                    />
                    <div>
                      {item.name} <br />
                      <span className='text-xs text-txt2'>{item.category}</span>
                    </div>
                  </td>
                  <td>{item.email}</td>
                  <td className='text-blue'>{item.status}</td>
                  <td>{item.views}</td>
                  {/* <td>{item.role}</td> */}

                  <td>{formattedDate}</td>

                  <td>
                    <Link
                      onClick={() => {
                        updateCoach({
                          name: item.name,
                          voice: item.voice,
                          language: item.language,
                          status: item.status,
                          category: item.category,
                          avatar: item.avatar,
                          id: item.id,
                          date:formattedDate
                        });
                      }}
                      href={"/details"}
                      className='bg-border w-fit text-txt m-1 px-4 py-1 flex items-center rounded-md'
                    >
                      Details <MdOutlineMoreHoriz className='ml-2' />
                    </Link>
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
