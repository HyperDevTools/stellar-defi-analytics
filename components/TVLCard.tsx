import { useTVL } from '@/hooks/useTVL';

export function TVLCard() {
  const { tvl, isLoading, error } = useTVL();

  if (error) {
    return (
      <div className="p-6 border border-red-300 rounded-lg bg-red-50">
        <p className="text-red-600">Error loading TVL</p>
      </div>
    );
  }

  return (
    <div className="p-6 border border-gray-300 rounded-lg bg-white shadow">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Value Locked</h3>
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32"></div>
        </div>
      ) : (
        <p className="text-3xl font-bold text-blue-600">
          ${tvl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      )}
    </div>
  );
}
