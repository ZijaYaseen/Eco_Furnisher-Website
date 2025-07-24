import dynamic from "next/dynamic";

const ResetPasswordClient = dynamic(() => import("../../../../components/Account/ResetPasswordClient"), { ssr: false });

export default function ResetPasswordPage() {
  return <ResetPasswordClient />;
} 