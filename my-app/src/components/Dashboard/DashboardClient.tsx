"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import AdminDashboard from "@/components/Dashboard/Admin/AdminDashboard";
import UserDashboard from "@/components/Dashboard/User/UserDashboard";
import ClientHeader from "@/components/Header/ClientHeader";
import Footer from "@/components/Footer";

const DashboardClient = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/Account/Login");
    }
  }, [status, router]);

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
    <div className="max-w-[1440px] font-poppins w-full mx-auto">
      {/* Role-based Dashboard Rendering */}
      {session.user?.role === "admin" ? (
        <AdminDashboard />
      ) : session.user?.role === "user" ? (
        <>
          <ClientHeader />
          <div className="mt-20 md:mt-28">
            <UserDashboard />
          </div>
          <Footer />
        </>
      ) : (
        <div className="text-center">
          <p className="text-red-600">Invalid role: {session.user?.role}</p>
          <p className="text-gray-600">Defaulting to User Dashboard</p>
          <UserDashboard />
        </div>
      )}
    </div>
  );
};

export default DashboardClient; 