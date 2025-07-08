"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import AdminDashboard from "@/components/Dashboard/Admin/AdminDashboard";
import UserDashboard from "@/components/Dashboard/User/UserDashboard";
import { FiLogOut } from "react-icons/fi";

const Dashboard = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/Account/Login");
    }
  }, [status, router]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/Account/Login" });
  };

  if (status === "loading") {
    return (
      <div className="max-w-[1440px] font-poppins w-full mx-auto mt-16 md:mt-28 h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>

    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (!session?.user) {
    return (
      <div className="max-w-[1440px] font-poppins w-full mx-auto mt-16 md:mt-28">
        <div className="text-center">
          <p>No session found. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] font-poppins w-full mx-auto mt-20 md:mt-28">

      {/* Role-based Dashboard Rendering */}
      {session.user?.role === "admin" ? (
        <AdminDashboard />
      ) : session.user?.role === "user" ? (
        <UserDashboard />
      ) : (
        <div className="text-center">
          <p className="text-red-600">Invalid role: {session.user?.role}</p>
          <p className="text-gray-600">Defaulting to User Dashboard</p>
          <UserDashboard />
        </div>
      )}

      <div className="flex justify-center mt-10">

        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 py-2 px-4 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors text-sm lg:text-base"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Logout Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
