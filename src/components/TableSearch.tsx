import Image from "next/image";

const TableSearch = () => {
  return (
    <div
      className="w-full md:w-auto flex items-center gap-2 text-xs
                 rounded-none border border-gray-300 px-2 py-1 bg-white
                 focus-within:border-gray-400
                 dark:bg-neutral-900 dark:border-neutral-800 dark:focus-within:border-neutral-600"
    >
      <Image
        src="/search.png"
        alt="Search"
        width={14}
        height={14}
        className="opacity-60 grayscale dark:invert"
      />
      <label htmlFor="table-search" className="sr-only">
        Search
      </label>
      <input
        id="table-search"
        type="search"
        placeholder="Search..."
        className="w-[200px] p-2 bg-transparent outline-none
                   placeholder:text-gray-400 text-gray-900
                   dark:placeholder:text-neutral-500 dark:text-neutral-100"
      />
    </div>
  );
};

export default TableSearch;
