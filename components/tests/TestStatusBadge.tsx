type TestStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

type Props = {
  status: TestStatus;
};

const statusConfig: Record<
  TestStatus,
  {
    label: string;
    className: string;
  }
> = {
  DRAFT: {
    label: "Draft",
    className: "bg-yellow-100 text-yellow-700",
  },

  PUBLISHED: {
    label: "Published",
    className: "bg-green-100 text-green-700",
  },

  ARCHIVED: {
    label: "Archived",
    className: "bg-gray-100 text-gray-700",
  },
};

export default function TestStatusBadge({ status }: Props) {
  const config = statusConfig[status];

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
