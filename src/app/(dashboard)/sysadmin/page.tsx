// src/app/(dashboard)/sysadmin/page.tsx
import CountChart from "@/components/organisms/CountChart";
import FinanceChart from "@/components/organisms/FinanceChart";
import StockChart from "@/components/organisms/StockChart";
import Announcements from "@/components/organisms/Announcements";
import Log from "@/components/organisms/Log";
import UserCard from "@/components/molecules/UserCard";

export default function SysAdminView() {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT COLUMN */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* KPI Cards */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="ticket" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
          <UserCard type="staff" />
        </div>

        {/* Charts Row */}
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="w-full lg:w-1/3">
            <CountChart className="h-[450px]" />
          </div>
          <div className="w-full lg:w-2/3">
            <StockChart className="h-[450px]" />
          </div>
        </div>

        {/* Finance Chart */}
        <div className="w-full">
          <FinanceChart className="h-[500px]" />
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <Log />
        <Announcements />
      </div>
    </div>
  );
}
