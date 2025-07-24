import dynamic from "next/dynamic";

const LoginClient = dynamic(() => import("../../../../components/Account/LoginClient"), { ssr: false });

export default function LoginPage() {
  return <LoginClient />;
}