import Image from "next/image";

type UserCardProps = {
  type: string;
};

const UserCard = ({ type }: UserCardProps) => {
  return (
    <div className="flex-1 min-w-[130px] p-4 border border-gray-200 bg-white rounded-none dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-between">
        <span className="text-[10px] px-2 py-1 rounded-none border border-gray-300 bg-gray-100 text-gray-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
          2024/25
        </span>
        <Image
          src="/more.png"
          alt="more"
          width={20}
          height={20}
          className="grayscale"
        />
      </div>
      <h1 className="my-4 text-2xl font-semibold text-gray-900 dark:text-neutral-100">1,234</h1>
      <h2 className="text-sm font-medium text-gray-500 capitalize dark:text-neutral-400">
        {type}s
      </h2>
    </div>
  );
};

export default UserCard;
