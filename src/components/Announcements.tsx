const Announcements = () => {
  return (
    <div className="bg-white text-black p-4 rounded-none border border-black">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Pengumuman</h1>
      </div>

      <div className="flex flex-col gap-4 mt-4 cursor-pointer">
        <div className="group border border-black rounded-none p-4 bg-white transition-colors hover:bg-black hover:text-white">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Lorem ipsum dolor sit</h2>
            <span className="text-xs px-1 py-1 rounded-none border border-black bg-black text-white transition-colors group-hover:bg-white group-hover:text-black">
              2025-01-01
            </span>
          </div>
          <p className="text-sm mt-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum,
            expedita. Rerum, quidem facilis?
          </p>
        </div>

        <div className="group border border-black rounded-none p-4 bg-white transition-colors hover:bg-black hover:text-white">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Lorem ipsum dolor sit</h2>
            <span className="text-xs px-1 py-1 rounded-none border border-black bg-black text-white transition-colors group-hover:bg-white group-hover:text-black">
              2025-01-01
            </span>
          </div>
          <p className="text-sm mt-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum,
            expedita. Rerum, quidem facilis?
          </p>
        </div>

        <div className="group border border-black rounded-none p-4 bg-white transition-colors hover:bg-black hover:text-white">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Lorem ipsum dolor sit</h2>
            <span className="text-xs px-1 py-1 rounded-none border border-black bg-black text-white transition-colors group-hover:bg-white group-hover:text-black">
              2025-01-01
            </span>
          </div>
          <p className="text-sm mt-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum,
            expedita. Rerum, quidem facilis?
          </p>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
