"use client";
import Link from "next/link";
import { BiSolidDashboard, } from "react-icons/bi";
import { FaCompressArrowsAlt } from "react-icons/fa";
import { FaUsers, FaUserGraduate } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { HiMiniCurrencyDollar } from "react-icons/hi2";
import { GiExitDoor } from "react-icons/gi";
import { usePathname } from "next/navigation";
import logo from "../../../public/logo.svg";
import Image from "next/image";

let menu = [
  { title: "Dashboard", to: "/dashboard", icon: <BiSolidDashboard /> },
  {
    title: "Users",
    to: "/dashboard/users",
    icon: <FaUsers />,
  },
  {
    title: "Coaches",
    to: "/dashboard/coaches",
    icon: <FaUserGraduate />,
  },
  {
    title: "Subscriptions",
    to: "/dashboard/subscription",
    icon: <HiMiniCurrencyDollar />,
  },
  {
    title: "Integrations",
    to: "/dashboard/integrations",
    icon: <FaCompressArrowsAlt />,
  },
];

let menu2 = [
  { title: "Settings", to: "/dashboard/settings", icon: <IoSettings /> },

  { title: "Logout", to: "/", icon: <GiExitDoor /> },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  return (
    <main className='bg-primary min-h-screen flex'>
      <section className='basis-[20%] bg-alt border-r-2 border-border flex flex-col '>
        <div className='h-[70%] border-b-[1.5px] px-5 border-border'>
          <div className='flex items-center mt-5'>
            <Image src={logo} className='h-10 mr-3' alt='ProAgents' />
            <p className='text-white text-xl'>ProAgents</p>
          </div>
          <div className='flex flex-col mt-10'>
            {menu.map((item, index) => {
              return (
                <Link
                  className={`flex xl:text-base text-sm items-center my-1 py-2.5 px-3 rounded-lg ${
                    pathname == item.to
                      ? "bg-gradient-to-r from-purple to-blue text-white"
                      : "bg-transparent text-txt2"
                  }`}
                  key={index}
                  href={item.to}
                >
                  {item.icon}
                  <span className='ml-2'> {item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className='flex flex-col px-5'>
          {menu2.map((item, index) => (
            <Link
              className={` flex items-center my-1 py-2.5 px-3 rounded-lg ${
                pathname == item.to
                  ? "bg-gradient-to-r from-purple to-blue text-white"
                  : "bg-transparent text-txt2"
              }`}
              key={index}
              href={item.to}
            >
              {item.icon}
              <span className='ml-2'> {item.title}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className='basis-full mx-5 mt-5'>{children}</section>
    </main>
  );
}
