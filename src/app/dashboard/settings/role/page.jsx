"use client";
import React, { useState, useEffect, useRef } from "react";
import { CiSearch, CiExport } from "react-icons/ci";
import { IoAdd } from "react-icons/io5";
import { CSVLink } from "react-csv";
import { IoIosArrowDown } from "react-icons/io";
import { RxReload } from "react-icons/rx";
import Image from "next/image";
import loader from "../../../../../public/loader2.svg"

const RolePage = () => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const modalRef = useRef(null);

  const fetchUsers = async () => {
    const access_token = sessionStorage.getItem("authAdmin");
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${baseURL}/admin/users/all`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch Clients");
      }
      const data = await res.json();
      setUsers(data);
      console.log(data);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter((client) =>
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchUsers();
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
    <div>
      <section className='flex w-full justify-between'>
        <p className='text-white text-xl'>Role Settings</p>
      </section>

      <section className='flex mt-5 justify-between items-center'>
        <section className='flex text-sm w-1/2 bg-[#1f232e] py-2 px-4 rounded-lg border-2 items-center border-[#262a35]'>
          <div className='basis-[13%]'>
            <CiSearch size={"1.7rem"} />
          </div>
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='bg-transparent basis-full outline-none'
            placeholder="Search User's Role"
          />
        </section>

        <button className='bg-gradient-to-r from-purple to-blue text-white px-4 py-2 text-sm flex items-center rounded-md'>
          <IoAdd size={"1.2rem"} className='mr-2' />
          Add Account
        </button>
      </section>

      {/* Users */}
      <div className="overflow-y-scroll h-[56vh] ">
        <table className='table-fixed w-full text-sm mt-3'>
          <thead className='bg-[#13151a] uppercase'>
            <tr className='text-txt2'>
              {" "}
              <th className='text-start font-normal p-3 rounded-tl-lg'>
                Username
              </th>
              <th className='text-start font-normal'>Email</th>
              <th className='text-center font-normal'>Role</th>
              <th className='text-center font-normal rounded-tr-lg'>Action</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan='4'>
                  <center>
                    <Image src={loader} className='h-16' alt='loading' />
                    <p>Loading ...</p>
                  </center>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan='4' className='text-center p-5'>
                  <p className='inline'>{error}</p>

                  <button
                    onClick={() => fetchUsers()}
                    className='bg-border text-txt hover:animate-spin hover:text-blue  transition-all ease-in-out p-3 ml-2 rounded-full'
                  >
                    <RxReload size={"1rem"} />
                  </button>
                </td>
              </tr>
            ) : (
              filteredUsers.map((item, index) => {
                return (
                  <tr
                    className={`text-white border-y border-[#262a35] ${
                      index % 2 == 0 ? "bg-[#1d202a]/50" : "bg-[#1f232e]"
                    }`}
                    key={item.id}
                  >
                    <td className='p-3'>User-{index}</td>
                    <td>{item.email}</td>

                    <td className='text-center'>
                      {item.role}
                    </td>
                    <td className="flex justify-center">
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
      </div>
    </div>
  );
};

export default RolePage;
