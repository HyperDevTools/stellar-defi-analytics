import type { PoolReserveSnapshot } from '@/lib/poolReserves';

export function PoolReserves({ snapshot }: { snapshot: PoolReserveSnapshot }) {
  return (
    <section className="p-6 border border-gray-300 rounded-lg bg-white shadow space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Liquidity pool reserves</h2>
      {snapshot.status === 'unavailable' ? (
        <p role="status">{snapshot.reason}</p>
      ) : (
        <>
          <p className="text-sm text-gray-600">
            {snapshot.source} · {snapshot.network} ·{' '}
            <time dateTime={snapshot.observedAt}>{snapshot.observedAt}</time>
          </p>
          {snapshot.pools.length === 0 ? (
            <p role="status">Horizon returned no pools for this page.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Horizon liquidity pools and raw asset reserves</caption>
                <thead>
                  <tr>
                    <th scope="col" className="py-2 pr-4">Pool ID</th>
                    <th scope="col" className="py-2 pr-4">Reserves in asset units</th>
                    <th scope="col" className="py-2 pr-4">Issued shares</th>
                    <th scope="col" className="py-2">Fee (basis points)</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshot.pools.map((pool) => (
                    <tr key={pool.id} className="border-t">
                      <th scope="row" className="py-3 pr-4 font-normal">
                        <code className="break-all">{pool.id}</code>
                      </th>
                      <td className="py-3 pr-4">
                        <ul>
                          {pool.reserves.map(({ asset, amount }) => (
                            <li key={asset}>
                              <span className="tabular-nums">{amount}</span>{' '}
                              <span className="break-all">{asset === 'native' ? 'XLM' : asset}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-3 pr-4 tabular-nums">{pool.total_shares}</td>
                      <td className="py-3 tabular-nums">{pool.fee_bp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
}
