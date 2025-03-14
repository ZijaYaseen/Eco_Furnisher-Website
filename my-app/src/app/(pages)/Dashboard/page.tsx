"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminDashboard from "@/components/AdminDashboard";
import UserDashboard from "@/components/UserDashboard";

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ fullName: string; role: string } | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const res = await fetch("/api/account/user", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        router.push("/Account/Login");
      }
    };
    fetchUserDetails();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/account/logout", { method: "POST", credentials: "include" });
    router.push("/Account/Login");
  };

  return (
    <div className="max-w-[1440px] font-poppins w-full mx-auto mt-[90px]">
      <h1 className="text-4xl font-semibold text-center">
        Hello {user ? user.fullName : "!"}
      </h1>
      {user?.role === "admin" && <AdminDashboard />}
      {user?.role === "user" && <UserDashboard />}

      <div className="flex justify-center mt-10">
        <button onClick={handleLogout} className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
