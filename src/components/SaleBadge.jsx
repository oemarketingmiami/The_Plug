export default function SaleBadge({ label = 'SALE' }) {
  return (
    <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded border border-[#00FF88]/60 text-[#00FF88] bg-[#00FF88]/5 tracking-widest uppercase">
      {label}
    </span>
  );
}
