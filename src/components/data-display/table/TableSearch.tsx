// src/components/TableSearch.tsx
"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type Props = {
  placeholder?: string;
  className?: string;
};

const TableSearch = ({ placeholder = "Search...", className = "" }: Props) => {
  return (
    <div
      className={`
        w-full md:w-auto inline-flex items-center gap-2
        h-8 px-2 rounded-none border border-black bg-white text-xs
        ${className}
      `}
    >
      <MagnifyingGlassIcon className="w-4 h-4 text-black/60" />
      <label htmlFor="table-search" className="sr-only">
        Search
      </label>
      <input
        id="table-search"
        type="search"
        placeholder={placeholder}
        className="
          w-[200px] h-full bg-transparent outline-none
          placeholder:text-gray-400 text-black
        "
      />
    </div>
  );
};

export default TableSearch;
