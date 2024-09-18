"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import profile from "@/../../public/profile.svg";
import loader from "@/../../public/loader2.svg";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useStore } from "../../../store";

const SettingsPage = () => {
  const user = useStore((state) => state.user);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [img, setImg] = useState(user.avatar ? user.avatar : profile);
  const [imgUpload, setImgUpload] = useState("");
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Put Settings
  const handleSettings = async (e) => {
    e.preventDefault();
    const access_token = sessionStorage.getItem("authAdmin");
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    setSuccess(false);
    const userData = new FormData();
    userData.append("first_name", firstName);
    userData.append("last_name", lastName);
    userData.append("avatar", imgUpload);
    userData.append("password", password)
    userData.append("confirm_password", confirmPassword)

    try {
      const res = await fetch(`${baseURL}/admin/users/update/profile`, {
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
    <main>
      <p className='text-white text-xl'>Profile Settings</p>

      <form onSubmit={handleSettings}>
        {" "}
        <div className='mt-3 flex items-center'>
          <Image
            className='h-28 w-28 rounded-full border object-cover border-border bg-primary'
            alt='profile'
            height={700}
            width={700}
            src={img}
          />
          <div className='relative ml-5'>
            {" "}
            <button className='ml-3 px-5 py-2.5 bg-primary border cursor-pointer border-blue text-blue rounded-lg'>
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
            Saved Successfully
          </p>
        )}
        {/* Grid */}
        <section className='grid grid-cols-2 gap-x-5 gap-y-6 mt-2 text-txt'>
          {" "}
          {/* Row 1 */}
          <div className='flex flex-col'>
            <label>First name</label>
            <input
              type='text'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className='mt-2 px-4 py-2 rounded-lg text-txt2 placeholder:text-txt2 outline-none bg-[#1F232E] border-2 border-[#262A35]'
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
              className='mt-2 px-4 py-2 rounded-lg text-txt2 placeholder:text-txt2 outline-none bg-[#1F232E] border-2 border-[#262A35]'
              placeholder='Last name'
            />
          </div>
          {/* Row 2 */}
          <div className='flex flex-col relative'>
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='mt-2 px-4 py-2 rounded-lg text-txt2 placeholder:text-txt2 outline-none bg-[#1F232E] border-2 border-[#262A35]'
              placeholder='........'
              required
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 transform translate-y-1/2 text-white'
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className='flex flex-col relative'>
            <label>Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='mt-2 px-4 py-2 rounded-lg text-txt2 placeholder:text-txt2 outline-none bg-[#1F232E] border-2 border-[#262A35]'
              placeholder='........'
              required
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 transform translate-y-1/2 text-white'
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </section>
        <div className='flex justify-center'>
          <button
            disabled={isLoading}
            className='bg-gradient-to-r from-purple  to-blue text-[#0C1132] mt-10 py-3 w-full rounded-md font-semibold'
          >
            Save
          </button>
        </div>
      </form>
    </main>
  );
};

export default SettingsPage;
