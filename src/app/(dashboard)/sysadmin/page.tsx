import CountChart from "@/components/data-display/charts/CountChart";
import FinanceChart from "@/components/data-display/charts/FinanceChart";
import StockChart from "@/components/data-display/charts/StockChart";
import Announcements from "@/components/data-display/Announcements";
import Log from "@/components/data-display/cards/Log";
import UserCard from "@/components/data-display/cards/UserCard";

const SysAdminView = () => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="ticket" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
          <UserCard type="staff" />
        </div>
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart />
          </div>
          <div className="w-full lg:w-2/3 h-[450px]">
            <StockChart />
          </div>
        </div>
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <Log />
        <Announcements />
      </div>
    </div>
  );
};

export default SysAdminView;
