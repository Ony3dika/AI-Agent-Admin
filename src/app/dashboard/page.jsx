"use client";
import React, { useState, useEffect } from "react";
import { BiSolidDashboard } from "react-icons/bi";
import { FaUsers, FaUserGraduate } from "react-icons/fa";
import Dropdown from "../../components/dropdown";
import { useStore } from "../../store";
import Image from "next/image";
import head from "../../../public/profile.svg";
import loader from "../../../public/loader2.svg";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashPage = () => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const updateUser = useStore((state) => state.updateUser);

  //Settings
  const fetchSettings = async () => {
    const access_token = sessionStorage.getItem("authAdmin");
    setIsLoading(true);
    try {
      const res = await fetch(`${baseURL}/users/me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed");
      }
      const data = await res.json();

      console.log(data);
      updateUser({
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        avatar: data.avatar,
      });

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  // Fetch Workspace
  const fetchData = async function () {
    setError(null);
    setIsLoading(true);
    const access_token = sessionStorage.getItem("authAdmin");
    try {
      const res = await fetch(`${baseURL}/workspaces/`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      setWorkspaces(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch coaches
  const fetchCoaches = async () => {
    const access_token = sessionStorage.getItem("authAdmin");
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${baseURL}/coaches`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch Coaches");
      }
      const data = await res.json();
      setCoaches(data);
      updateCoachLength(data.length);
      console.log(data);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSettings();
    fetchCoaches();
  }, []);

  const options = {
    scales: {
      y: {
        grid: {
          color: "#353949", // Set the color of the gridlines for the y-axis
        },
        ticks: {
          color: "#8c90a0",
          font: {
            family: "Urbanist", // Font family
            size: 14, // Font size
          },
        },
      },
      x: {
        grid: {
          color: "transparent",
        },
        ticks: {
          color: "#8c90a0", // Set the color of the x-axis tick labels
          font: {
            family: "Urbanist", // Font family
            size: 14, // Font size
          },
        },
      },
    },
  };
  const data = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],

    datasets: [
      {
        label: "Coaches",
        data: [5, 45, 250, 99, 86],
        borderColor: "#22B9E8",
        backgroundColor: "#22B9E8",
        pointBorderColor: "#ffffff",
        tension: 0.4,
      },

      {
        label: "Users",
        data: [70, 358, 138, 6, 390],
        borderColor: "#7540dc",
        backgroundColor: "#7540dc",
        pointBorderColor: "#ffffff",
        tension: 0.4,
      },
    ],
  };

  return (
    <main className='text-txt'>
      <section className='flex h-16 w-full justify-between'>
        <div className='basis-1/3 flex'>
          <div>
            <p className='text-white text-2xl'>Dashboard</p>
            <p className='text-sm mt-1 text-txt2'>Admin / Dashboard</p>
          </div>
        </div>
        <Dropdown />
      </section>
      {isLoading ? (
        <div className=' text-white bg-primary py-3 w-full flex items-center justify-center '>
          <div className='flex flex-col items-center justify-center'>
            <Image className='h-32' src={loader} alt='Loading' />
            <p className='text-xl'>Loading...</p>
          </div>
        </div>
      ) : (
        ""
      )}

      <section className='flex justify-between mt-5'>
        <div className='basis-[32%] h-32 rounded-lg border-border border-2 bg-alt flex items-center justify-between p-5'>
          <div className='flex flex-col justify-between'>
            <p className='text-sm'>Total Workspaces</p>
            <p className='text-white text-3xl font-medium mt-5'>
              {workspaces && workspaces.length}
            </p>
          </div>

          <BiSolidDashboard className='text-blue ' size={"4rem"} />
        </div>

        <div className='basis-[32%] h-32 rounded-lg border-border border-2 bg-alt flex items-center justify-between p-5'>
          <div className='flex flex-col justify-between'>
            <p className='text-sm'>Total Users</p>
            <p className='text-white text-3xl font-medium mt-5'>13,056</p>
          </div>

          <FaUsers className='text-blue ' size={"4rem"} />
        </div>

        <div className='basis-[32%] h-32 rounded-lg border-border border-2 bg-alt flex items-center justify-between p-5'>
          <div className='flex flex-col justify-between'>
            <p className='text-sm'>Total Coaches</p>
            <p className='text-white text-3xl font-medium mt-5'>
              {coaches && coaches.length}
            </p>
          </div>

          <FaUserGraduate className='text-blue ' size={"4rem"} />
        </div>
      </section>

      {/* Performance */}

      <section className='flex justify-between mt-5 h-[60vh]'>
        <div className='rounded-lg border-border border-2 overflow-y-scroll bg-alt p-5 py-2 basis-[66%]'>
          <p className='text-3xl text-white'>Performance Report </p>

          <div>
            <Line className='mt-5' options={options} data={data} />
          </div>
        </div>

        <div className='basis-[32%] rounded-lg border-border border-2 bg-alt p-5'>
          <p className='text-white text-xl'>Recent</p>

          <div className='mt-5'>
            {workspaces.map((space) => (
              <div
                key={space.id}
                className='flex justify-between items-center py-3 border-b-2 border-border'
              >
                <div className='flex items-center'>
                  <Image
                    src={head}
                    width={700}
                    height={700}
                    className='w-10 h-10 rounded-full mr-2'
                    alt='coach'
                  />
                  <p className='text-white text-sm'>Name</p>
                </div>
                <div>
                  <p className='text-white text-sm'>Coach Status</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashPage;