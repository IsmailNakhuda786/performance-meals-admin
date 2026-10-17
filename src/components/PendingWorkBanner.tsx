interface Props {
  count: number;
  itemLabel: string;
  detail: string;
  reviewing?: boolean;
  onReview?: () => void;
  onShowAll?: () => void;
}

export default function PendingWorkBanner({
  count,
  itemLabel,
  detail,
  reviewing = false,
  onReview,
  onShowAll,
}: Props) {
  if (count === 0) return null;

  return (
    <div
      className="flex flex-col gap-3 border border-yellow-300 bg-yellow-50 px-4 py-3 text-yellow-900 sm:flex-row sm:items-center sm:justify-between"
      role="status"
    >
      <div>
        <div className="text-xs font-extrabold uppercase tracking-wider">
          Action required · {count} {itemLabel}{count === 1 ? "" : "s"}
        </div>
        <div className="mt-1 text-sm">{detail}</div>
      </div>
      {onReview && (
        <button
          type="button"
          onClick={reviewing && onShowAll ? onShowAll : onReview}
          className="flex-shrink-0 border border-yellow-500 bg-white px-3 py-2 text-xs font-extrabold text-yellow-900 transition-colors hover:bg-yellow-100"
        >
          {reviewing && onShowAll ? "Show all" : `Review ${count}`}
        </button>
      )}
    </div>
  );
}
