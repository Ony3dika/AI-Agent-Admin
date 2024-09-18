"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import loader from "../../../public/loader.svg";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import agent from "../../../public/agent.svg";

const ResetPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const email = params.get("email");
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess(false);
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [error, success]);

  async function verifyUser(e) {
    e.preventDefault();
    setIsLoading(true);
    const userData = { token: token, email: email, password: password };

    try {
      const res = await fetch(`${baseURL}/auth/reset-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(errorData);
      }

      const data = await res.json();
      setSuccess(true);
      setError("");
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className='min-h-screen flex items-center justify-center flex-col bg-gradient-to-bl from-[#0d171f] via-primary to-[#0d171f]'>
      <section>
        <Image src={agent} className='h-36' alt='ai-agent' />
      </section>

      <form
        onSubmit={verifyUser}
        className='w-[30%] mt-5 flex text-sm flex-col px-6 py-5 rounded-2xl border-border/80 border-2 bg-[#1a1c25]/30 backdrop-blur-2xl'
      >
        <p className='text-center text-white mb-5 text-lg'>
          Sign In to your account
        </p>

        {/* Email */}
        <label className='text-sm text-txt'>Enter Email</label>
        <input
          value={email}
          type='text'
          required
          placeholder='email@gmail.com'
          className='px-4 py-2 w-full mt-1 border outline-none text-white placeholder:text-white border-border bg-border/30 rounded-lg'
        />
        {/* Password */}
        <label className='text-sm text-txt mt-3'>Password</label>
        <div className='relative'>
          {" "}
          <input
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='*****'
            required
            className='px-4 py-2 w-full mt-1 border outline-none text-white placeholder:text-xl placeholder:text-white border-border bg-border/30 rounded-lg'
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-white'
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {error && (
          <p className='w-full my-3 py-2 text-center text-primary font-medium rounded-xl bg-red-200'>
            {error}
          </p>
        )}
        {success && (
          <p className='w-full my-3 py-2 text-center text-primary font-medium rounded-xl bg-green-200'>
            Password Updated
          </p>
        )}

        <button
          disabled={isLoading}
          className={` flex justify-center items-center h-12 py-2 text-center text-white mt-5 rounded-xl ${
            isLoading
              ? "animate-pulse bg-gradient-to-br from-slate-700/60 to-black/10"
              : "bg-gradient-to-r from-purple to-blue"
          }`}
        >
          {isLoading ? (
            <Image className='h-12 w-12' src={loader} alt='Loading...' />
          ) : (
            "Reset"
          )}
        </button>
      </form>
    </main>
  );
};

export default ResetPage;
