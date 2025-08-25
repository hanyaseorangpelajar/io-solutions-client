type UserCardProps = {
  type: string;
};

const UserCard = ({ type }: UserCardProps) => {
  return (
    <div className="flex-1 min-w-[130px] p-4 border border-white bg-black rounded-none">
      <div className="flex items-center justify-between">
        <span className="text-[10px] px-2 py-1 border border-white bg-black text-white">
          2024/25
        </span>
      </div>

      <h1 className="my-4 text-2xl font-semibold text-white">1,234</h1>
      <h2 className="text-sm font-bold text-white capitalize">{type}s</h2>
    </div>
  );
};

export default UserCard;
