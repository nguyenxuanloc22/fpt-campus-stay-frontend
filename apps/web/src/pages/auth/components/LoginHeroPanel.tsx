export function LoginHeroPanel() {
  return (
    <div className="hidden lg:flex lg:w-[56%] relative flex-col justify-between p-12 overflow-hidden bg-slate-900 text-white select-none">
      {/* Background Campus Photo with dark gradient overlay */}
      <img
        src="/assets/campus-building.png"
        alt="FPT University Campus"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-slate-900/40" />

      {/* Top Brand Header */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-[#F26F21] flex items-center justify-center font-black text-white text-base tracking-wider shadow-lg">
          FPT
        </div>
        <div>
          <div className="text-white font-bold text-lg leading-tight">CampusStay</div>
          <div className="text-slate-300 text-xs">Dormitory Management System</div>
        </div>
      </div>

      {/* Bottom Content & Statistics */}
      <div className="relative z-10 max-w-xl">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-3">
          Smart &amp; efficient<br />dormitory management
        </h1>
        <p className="text-slate-200/90 text-sm leading-relaxed mb-8 max-w-lg">
          A fully digital platform for room registration, auto-assignment, maintenance, and payments.
        </p>

        {/* 3 Stats */}
        <div className="flex items-center gap-10 pt-6 border-t border-white/15">
          <div>
            <div className="text-2xl lg:text-3xl font-black text-white">2.400+</div>
            <div className="text-xs text-slate-300 font-medium mt-0.5">Students</div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-black text-white">600</div>
            <div className="text-xs text-slate-300 font-medium mt-0.5">Rooms</div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-black text-white">98%</div>
            <div className="text-xs text-slate-300 font-medium mt-0.5">Sem 1 Occupancy</div>
          </div>
        </div>
      </div>
    </div>
  );
}
