"use client";
import React, { useState, useEffect, useRef } from "react";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { IoIosArrowDown } from "react-icons/io";
import { GiExitDoor } from "react-icons/gi";
import Image from "next/image";
import Link from "next/link";
import head from "../../public/profile.svg";
import { IoSettings } from "react-icons/io5";
import { useStore } from "../store";

const Modal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useStore((state) => state.user);

  const modalRef = useRef(null);
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
    <div className='justify-end flex items-center'>
      <div className='flex items-center'>
        <RxQuestionMarkCircled className='text-txt' size={"1.7rem"} />

        {/* Sub Menu */}
        <div className='flex items-center cursor-pointer' onClick={openModal}>
          <div className='relative h-9 w-9 ml-3'>
            <Image
              src={user.avatar ? user.avatar : head}
              height={700}
              width={700}
              className='object-cover h-9 w-9 rounded-full border-2 border-txt/60'
              alt=''
            />
          </div>
          <IoIosArrowDown className='text-txt ml-1' />

          {isOpen && (
            <section>
              <div className='fixed top-0 left-0 w-screen z-20 h-screen bg-black/30 backdrop-blur rounded-md shadow-md'>
                <div
                  onClick={handleModalClick}
                  ref={modalRef}
                  className='w-1/6 aspect-square absolute py-8 px-5 bg-alt/75 backdrop-blur-lg right-10 top-10 rounded-lg'
                >
                  {/* Menu Content */}
                  <section>
                    <div className='flex items-center'>
                      <Image
                        src={user.avatar ? user.avatar : head}
                        height={700}
                        width={700}
                        className='object-cover border border-txt h-10 w-10 rounded-full'
                        alt=''
                      />
                      <p className='text-white leading-none ml-3'>
                        {user.firstName} {user.lastName} <br />
                        <span className='text-txt text-xs'>{user.email}</span>
                      </p>
                    </div>
                  </section>

                  <section className='pl-5 mt-10 text-txt2'>
                    <Link
                      href='/dashboard/settings'
                      className='flex items-center'
                    >
                      <IoSettings className='mr-2' /> Settings
                    </Link>

                    <Link href='/' className='flex items-center mt-5'>
                      <GiExitDoor className='mr-2' /> Sign Out
                    </Link>
                  </section>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
