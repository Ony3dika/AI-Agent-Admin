"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Dropdown from "@/components/dropdown";
import Link from "next/link";

let menu = [
  { title: "Profile Settings", to: "/dashboard/settings" },

  { title: "Role Settings", to: "/dashboard/settings/role" },
];
const SettingsLayout = ({ children }) => {
  const pathname = usePathname();

  return (
    <main className='text-txt mt-5 h-[90vh]'>
      {" "}
      <section className='flex h-16 w-full justify-between'>
        <div className='basis-1/3 flex'>
          <div>
            <p className='text-white text-2xl'>Settings</p>
            <p className='text-sm mt-1 text-txt2'>Admin / Settings</p>
          </div>
        </div>
        <Dropdown />
      </section>
      <section className='flex justify-between items-center h-[75vh] mt-5 rounded-lg border-2 border-[#313542]'>
        <div className='basis-1/4 border-r-2 rounded-l-lg border-[#313542] bg-[#1f232e] h-full'>
          <div className='flex flex-col items-center'>
            {" "}
            {menu.map((item, index) => {
              return (
                <Link
                  className={`mt-5 py-2.5 px-8 rounded-full ${
                    pathname == item.to
                      ? "bg-gradient-to-r from-purple to-blue text-white"
                      : "bg-transparent text-txt2"
                  }`}
                  key={index}
                  href={item.to}
                >
                  <span className='ml-2'> {item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className='basis-full rounded-r-lg bg-alt h-full py-5 px-10'>
          {children}
        </div>
      </section>
    </main>
  );
};

export default SettingsLayout;
