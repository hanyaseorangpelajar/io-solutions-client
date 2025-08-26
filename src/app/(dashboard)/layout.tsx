import Menu from "@/components/layout/Menu";
import Navbar from "@/components/layout/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="h-screen flex">
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4 bg-[var(--mono-fg)] text-[var(--mono-bg)]">
        <Link
          href="/sysadmin"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image
            src="/logo.png"
            alt="logo"
            width={32}
            height={32}
            className="invert"
          />
          <span className="hidden lg:block font-bold">I/O SOLUTIONS</span>
        </Link>
        <Menu />
      </div>

      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[var(--mono-bg)] text-[var(--mono-fg)] overflow-scroll flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
