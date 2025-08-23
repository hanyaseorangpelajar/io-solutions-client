import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const Pagination = () => {
  const btnBase =
    "inline-flex items-center justify-center gap-1 h-8 px-3 border border-black rounded-none " +
    "bg-white text-black hover:bg-black hover:text-white transition " +
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black";

  const pageBase =
    "h-8 min-w-8 px-2 inline-flex items-center justify-center border border-black rounded-none " +
    "bg-white text-black hover:bg-black hover:text-white transition";
  const pageActive = "bg-white text-black";

  return (
    <nav
      className="w-full border-t border-black bg-white text-black"
      aria-label="Pagination Navigation"
    >
      <div className="p-4 flex items-center justify-between">
        <button className={btnBase} aria-label="Previous page" disabled>
          <ChevronLeftIcon className="w-4 h-4" />
          <span className="text-xs font-medium">Prev</span>
        </button>

        <div className="flex items-center gap-1 text-sm select-none">
          <button className={`${pageBase} ${pageActive}`} aria-current="page">
            1
          </button>
          <button className={pageBase}>2</button>
          <button className={pageBase}>3</button>
          <span className="px-2 text-black/60">…</span>
          <button className={pageBase}>10</button>
        </div>

        <button className={btnBase} aria-label="Next page">
          <span className="text-xs font-medium">Next</span>
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
