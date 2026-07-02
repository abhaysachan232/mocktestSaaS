import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogOutButton() {
  async function handleLogOut() {
    await signOut({
      callbackUrl: "/login", // logout ke baad redirect
    });
  }
  return (
    <button
      onClick={handleLogOut}
      className="h-14 px-6 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold flex items-center gap-2 shadow-lg hover:scale-[1.02] transition"
    >
      <LogOutIcon size={18} />
      Logout
    </button>
  );
}
