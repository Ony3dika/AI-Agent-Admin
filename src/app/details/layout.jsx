"use client";
import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import Image from "next/image";
import agent from "../../../public/coach.svg";
const DetailsLayout = ({ children }) => {
  const router = useRouter();

  return (
    <main className='h-screen flex flex-col text-white justify-between bg-primary container mx-auto px-64 pb-5 pt-10'>
      <section className='basis-[33%] bg-[#191c25] rounded-xl border-2 border-txt/10 p-5'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center'>
            <IoIosArrowRoundBack
              onClick={() => router.back()}
              size={"2rem"}
              className='mr-3 cursor-pointer text-txt'
            />
            <p className='text-lg '>Coach Details</p>
          </div>
        </div>

        <div className='flex justify-around mt-5'>
          <Image
            className='h-20 w-20 rounded-lg'
            src={agent}
            width={700}
            height={700}
            alt='image'
          />
          <div>
            <p className='text-txt text-sm'>Coach Name</p>
            <p>Name</p>

            <p className='text-txt text-sm mt-5'>Category</p>
            <p>Category</p>
          </div>

          {/* Date */}
          <div>
            <p className='text-txt text-sm'>Date Created</p>
            <p>21/12/2024</p>
            <p className='text-txt text-sm mt-5'>Status</p>
            <p>Active</p>
          </div>

          <div>
            <p className='text-txt text-sm'>Default Language</p>
            <p>Portuguenese</p>
          </div>
          <div>
            <p className='text-txt text-sm'>Default Language</p>
            <p>Portuguenese</p>
          </div>
        </div>
      </section>

      <section className='basis-[65%] bg-[#191c25] rounded-xl border-2 border-txt/10'></section>
    </main>
  );
};

export default DetailsLayout;
