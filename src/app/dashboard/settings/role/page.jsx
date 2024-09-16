"use client";
import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { IoAdd, IoCloseOutline } from "react-icons/io5";
import { RxReload } from "react-icons/rx";
import Image from "next/image";
import profile from "../../../../../public/profile.svg";
import loader from "../../../../../public/loader2.svg";

const RolePage = () => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [users, setUsers] = useState([]);
  const [img, setImg] = useState(profile);
  const [imgUpload, setImgUpload] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");

  //fetch Users
  const fetchUsers = async () => {
    const access_token = sessionStorage.getItem("authAdmin");
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${baseURL}/admin/users/all-users`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(errorData);
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

  const addUser = async (e) => {
    e.preventDefault();
    const access_token = sessionStorage.getItem("authAdmin");
    setError(null);
    setIsLoading(true);
    setSuccess(false);
    const userData = new FormData();
    userData.append("first_name", firstName);
    userData.append("last_name", lastName);
    userData.append("email", email);
    userData.append("role", role);
    userData.append("avatar", imgUpload);

    try {
      const res = await fetch(`${baseURL}/admin/users/add/new/user`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        body: userData,
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(errorData);
      }
      const data = await res.json();
      console.log(data);
      setSuccess(true);
    } catch (error) {
      setError(error.message);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const filteredUsers = users.filter((client) =>
    client.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess(false);
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className='relative'>
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

        <button
          onClick={() => setPopUp(true)}
          className='bg-gradient-to-r from-purple to-blue text-white px-4 py-2 text-sm flex items-center rounded-md'
        >
          <IoAdd size={"1.2rem"} className='mr-2' />
          Add Account
        </button>
      </section>

      {/* Users */}
      <div className='overflow-y-scroll h-[56vh] '>
        <table className='table-fixed w-full text-sm mt-3'>
          <thead className='bg-[#13151a] uppercase'>
            <tr className='text-txt2'>
              {" "}
              <th className='text-start font-normal p-3 rounded-tl-lg'>
                Username
              </th>
              <th className='text-start font-normal'>Email</th>
              <th className='text-center font-normal'>Role</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan='3'>
                  <center>
                    <Image src={loader} className='h-16' alt='loading' />
                    <p>Loading ...</p>
                  </center>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan='3' className='text-center p-5'>
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
                    <td className='pl-3'>
                      {item.first_name} {item.last_name}
                    </td>
                    <td className='p-3'>{item.email}</td>

                    <td className='text-center'>{item.role}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {popUp && (
        <div className='absolute border border-[#313542]/60 rounded-lg bg-alt h-full w-full top-0 left-0 p-5 text-white'>
          <div className='flex justify-between'>
            <p>Add Account</p>

            <IoCloseOutline
              onClick={(e) => setPopUp(false)}
              size={"2rem"}
              className='p-1 bg-[#292d39]  text-white rounded-full '
            />
          </div>
          {isLoading ? (
            <div className='w-full flex flex-col justify-center items-center mb-2'>
              <Image src={loader} className='h-16' alt='Saving' />
            </div>
          ) : (
            ""
          )}
          {error && (
            <p className='w-full my-3 py-2 text-center text-primary font-medium rounded bg-red-200'>
              {error}
            </p>
          )}
          {success && (
            <p className='w-full my-3 py-2 text-center text-primary font-medium rounded-xl bg-green-200'>
              New User Added
            </p>
          )}
          <form onSubmit={addUser}>
            {" "}
            <div className='mt-3 flex flex-col justify-center items-center'>
              <Image
                className='h-28 w-28 rounded-full border object-cover border-border bg-primary'
                alt='profile'
                height={700}
                width={700}
                src={img}
              />
              <div className='relative'>
                {" "}
                <button className='mt-1 px-5 py-2.5 bg-primary border cursor-pointer border-blue text-blue rounded-lg'>
                  Upload Image
                </button>
                <input
                  type='file'
                  accept='image/*'
                  onChange={(e) => {
                    let file = e.target.files?.[0];

                    setImg(file ? URL.createObjectURL(file) : profile);
                    setImgUpload(file);
                  }}
                  className='px-4 py-1.5 absolute w-full left-0 opacity-0 cursor-pointer'
                />
              </div>
            </div>
            <section className='grid grid-cols-2 gap-x-5 gap-y-6 mt-4 text-txt'>
              <div className='flex flex-col'>
                <label>First name</label>
                <input
                  type='text'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className='mt-1 px-4 py-2 rounded-lg text-txt2 placeholder:text-txt2 outline-none bg-[#1F232E] border-2 border-[#262A35]'
                  placeholder='First name'
                />
              </div>
              <div className='flex flex-col'>
                <label>Last name</label>
                <input
                  type='text'
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className='mt-1 px-4 py-2 rounded-lg text-txt2 placeholder:text-txt2 outline-none bg-[#1F232E] border-2 border-[#262A35]'
                  placeholder='Last name'
                />
              </div>
              {/* Row 2 */}
              <div className='flex flex-col'>
                <label>Email</label>
                <input
                  type='email'
                  required
                  value={email}
                  onChange={(e)=> setEmail(e.target.value)}
                  className='mt-1 px-4 py-2 rounded-lg text-txt2 placeholder:text-txt2 outline-none bg-[#1F232E] border-2 border-[#262A35]'
                  placeholder='Email'
                />
              </div>
              <div className='flex flex-col'>
                <label>Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className='mt-1 px-4 py-2 rounded-lg text-txt2 placeholder:text-txt2 outline-none bg-[#1F232E] border-2 border-[#262A35]'
                >
                  <option value='user'>User</option>
                  <option value='client'>Client</option>
                  <option value='admin'>Admin</option>
                </select>
              </div>
            </section>
            <div className='flex justify-center'>
              <button
                disabled={isLoading}
                className='bg-gradient-to-r from-purple  to-blue text-[#0C1132] mt-3 py-3 w-full rounded-md font-semibold'
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RolePage;
