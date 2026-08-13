interface PaletteLegendProps {
  showMarked?: boolean;
}

export default function PaletteLegend({
  showMarked = true,
}: PaletteLegendProps) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-slate-600">
      <LegendItem
        className="bg-emerald-500"
        label="Answered"
      />

      <LegendItem
        className="bg-slate-200"
        label="Not Visited"
      />

      {showMarked && (
        <LegendItem
          className="bg-amber-500"
          label="Marked"
        />
      )}

      <LegendItem
        className="bg-indigo-600"
        label="Current"
      />
    </div>
  );
}

function LegendItem({
  className,
  label,
}: {
  className: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-3 w-3 shrink-0 rounded-sm ${className}`}
      />

      <span>{label}</span>
    </div>
  );
}