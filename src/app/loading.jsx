import React from "react";
import loader from "../../public/loader.svg";
import Image from "next/image";
const Loading = () => {
  return (
    <div className='w-full h-screen absolute left-0 top-0 z-20 bg-primary backdrop-blur-lg flex items-center justify-center'>
      <Image src={loader} className='h-44' alt='' />
    </div>
  );
};

export default Loading;
