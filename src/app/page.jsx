"use client";
import Image from "next/image";
import Link from "next/link";
import agent from "../../public/agent.svg";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import loader from "../../public/loader.svg";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const router = useRouter();
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [error]);

  // Form Submit Function
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const userData = new FormData();
    userData.append("username", email);
    userData.append("password", password);

    try {
      setIsLoading(true);

      const res = await fetch(`${baseURL}/auth/login`, {
        method: "POST",
        body: userData,
      });

      if (!res.ok) {
        let errorMessage = "Something went wrong";
        console.log(res);
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error("Error parsing JSON:", jsonError);
        }
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      const { access_token } = data;
      sessionStorage.setItem("authAdmin", access_token);
      setIsLoading(false);
      setSuccess(true);
      // Re-route to dashboard
      router.push("/dashboard");
      e.target.reset(); // Reset the form
    } catch (error) {
      setIsLoading(false);
      setError("Network error or server not reachable");
      console.error("Error:", error);
    }
  }

  // Handle Forgot Password Modal Submit
  async function handleForgotPasswordSubmit(e) {
    e.preventDefault();
    setError("");

    const user = new FormData();
    user.append("username", forgotPasswordEmail);
    try {
      setIsLoading(true);

      const res = await fetch(`${baseURL}/auth/forgot-password/`, {
        method: "POST",
        body: user,
      });

      if (!res.ok) {
        let errorMessage = "Something went wrong";
        console.log(res);
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error("Error parsing JSON:", jsonError);
        }
        setError(errorMessage);
        setIsLoading(false);
        return;
      }
      const data = await res.json();
    } catch (error) {
      setIsLoading(false);
      setError("Network error or server not reachable");
      console.error("Error:", error);
    }
  }

  return (
    <main className='min-h-screen flex items-center justify-center flex-col bg-gradient-to-bl from-[#0d171f] via-primary to-[#0d171f]'>
      <section>
        <Image src={agent} className='h-36' alt='ai-agent' />
      </section>

      <form
        onSubmit={handleSubmit}
        className='w-[30%] mt-5 flex text-sm flex-col px-6 py-10 rounded-2xl border-border/80 border-2 bg-[#1a1c25]/30 backdrop-blur-2xl'
      >
        <p className='text-center text-white mb-5 text-lg'>
          Admin Account
        </p>

        {/* Email */}
        <label className='text-sm text-txt'>Enter Email</label>
        <input
          onChange={(e) => setEmail(e.target.value)}
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

        <div className='flex justify-end my-5'>
          <button
            type='button'
            onClick={() => setIsModalOpen(true)}
            className='text-txt2 text-sm hover:text-blue transition-all duration-200 ease-linear'
          >
            Forgot Password?
          </button>
        </div>

        {error && (
          <p className='w-full my-3 py-2 text-center text-primary font-medium rounded-xl bg-red-200'>
            {error}
          </p>
        )}
        {success && (
          <p className='w-full my-3 py-2 text-center text-primary font-medium rounded-xl bg-green-200'>
            Logging You In...
          </p>
        )}

        <button
          disabled={isLoading}
          className={` flex justify-center items-center h-12 py-2 text-center text-white mt-1 rounded-xl ${
            isLoading
              ? "animate-pulse bg-gradient-to-br from-slate-700/60 to-black/10"
              : "bg-gradient-to-r from-purple to-blue"
          }`}
        >
          {isLoading ? (
            <Image className='h-12 w-12' src={loader} alt='Loading...' />
          ) : (
            "Sign In"
          )}
        </button>
       
      </form>

      {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-primary border-border border rounded-lg p-6 w-96'>
            <h2 className='text-xl font-semibold mb-5 text-blue'>
              Forgot Password
            </h2>
            <form onSubmit={handleForgotPasswordSubmit}>
              <label className='block mb-2 text-txt'>
                Enter your email address
              </label>
              <input
                type='email'
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                required
                className='w-full px-4 py-2 bg-transparent border-border outline-none text-txt border rounded-lg mb-4'
              />
              <div className='flex justify-end'>
                <button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className='mr-2 px-4 py-2 bg-gray-800 text-white rounded-lg'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-600 bg-blue text-primary rounded-lg'
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
