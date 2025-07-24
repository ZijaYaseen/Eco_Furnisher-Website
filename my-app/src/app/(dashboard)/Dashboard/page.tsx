import dynamic from "next/dynamic";

const DashboardClient = dynamic(() => import("../../../components/Dashboard/DashboardClient"), { ssr: false });

export default function DashboardPage() {
  return <DashboardClient />;
}
