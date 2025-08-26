import Image from "next/image";

const Navbar = () => {
  return (
    <header className="w-full border-b border-black">
      <div className="mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="btn-icon">
            <span className="font-bold font-mono leading-none tracking-[0.02em] text-[11px] scale-[0.95]">
              I<span className="px-[1px]">/</span>O
            </span>
          </div>
          <div className="leading-tight">
            <h1
              className="text-sm font-semibold tracking-[0.2em] uppercase"
              aria-label="I/O System Information"
              title="I/O System Information"
            >
              I/O SYSTEM INFORMATION
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-black/60">
              DATA • INFORMATION • KNOWLEDGE • WISDOM
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right leading-tight">
            <span className="block text-xs font-medium">John Doe</span>
            <span className="block text-[10px]">Admin</span>
          </div>
          <Image
            src="/avatar.png"
            alt="Avatar"
            width={36}
            height={36}
            className="rounded-none border border-black grayscale"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
