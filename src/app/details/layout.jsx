"use client";
import React, { useState, useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Image from "next/image";
import agent from "../../../public/coach.svg";
import { useStore } from "../../store";

const DetailsLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const coach = useStore((state) => state.coach);

  return (
    <main className='h-screen flex flex-col text-white justify-between bg-primary container mx-auto px-64 py-5'>
      <section className='basis-[30%] bg-[#191c25] rounded-xl border-2 border-txt/10 p-5'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center'>
            <IoIosArrowRoundBack
              onClick={() => router.push("/dashboard/coaches")}
              size={"2rem"}
              className='mr-3 cursor-pointer text-txt'
            />
            <p className='text-lg '>Coach Details</p>
          </div>
        </div>

        <div className='flex justify-around mt-5'>
          <Image
            className='h-20 w-20 rounded-lg'
            src={coach.avatar ? coach.avatar : agent}
            width={700}
            height={700}
            alt='image'
          />
          <div>
            <p className='text-txt text-sm'>Coach Name</p>
            <p>{coach.name}</p>

            <p className='text-txt text-sm mt-5'>Category</p>
            <p>{coach.category}</p>
          </div>

          {/* Date */}
          <div>
            <p className='text-txt text-sm'>Date Created</p>
            <p>21/12/2024</p>
            <p className='text-txt text-sm mt-5'>Status</p>
            <p>{coach.status}</p>
          </div>

          <div>
            <p className='text-txt text-sm'>Default Language</p>
            <p>{coach.language}</p>
          </div>
          <div>
            <p className='text-txt text-sm'>Coach Voice</p>
            <p>{coach.voice}</p>
          </div>
        </div>
      </section>

      <section className='basis-[67%] bg-[#191c25] rounded-xl border-2 border-txt/10 p-5'>
        <div className='w-fit bg-primary rounded-full border-2 border-border h-12 flex p-0.5 items-center'>
          <button
            onClick={() => router.push("/details")}
            className={`w-fit px-8 h-full rounded-full transition-all duration-300 ease-linear text-center  ${
              pathname == "/details"
                ? "bg-gradient-to-r from-purple to-blue text-white"
                : "text-white"
            }`}
          >
            Leads
          </button>
          <button
            className={`w-fit px-8 h-full rounded-full transition-all duration-300 ease-linear text-center ${
              pathname == "/details/orders"
                ? "bg-gradient-to-r from-purple to-blue text-white"
                : "text-white"
            }`}
            onClick={() => router.push("/details/orders")}
          >
            Orders
          </button>
        </div>

        <div className='mt-2 h-[48vh] overflow-y-scroll'>{children}</div>
      </section>
    </main>
  );
};

export default DetailsLayout;
