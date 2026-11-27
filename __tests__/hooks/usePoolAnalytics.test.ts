import { renderHook, waitFor } from '@testing-library/react';
import { usePoolAnalytics } from '@/hooks/usePoolAnalytics';
import { calculatePoolAnalytics } from '@/lib/analytics/pools';

jest.mock('@/lib/analytics/pools', () => ({
  calculatePoolAnalytics: jest.fn(),
}));

const calculatePoolAnalyticsMock = jest.mocked(calculatePoolAnalytics);
const { calculatePoolAnalytics: calculatePoolAnalyticsReal } =
  jest.requireActual<typeof import('@/lib/analytics/pools')>('@/lib/analytics/pools');

describe('usePoolAnalytics', () => {
  it('returns to loading when the pool changes while the next result is pending', async () => {
    const analytics = await calculatePoolAnalyticsReal('pool-a', '30d');
    calculatePoolAnalyticsMock.mockResolvedValue(analytics);

    const { result, rerender } = renderHook(
      ({ poolId }) => usePoolAnalytics(poolId),
      { initialProps: { poolId: 'pool-a' } },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    rerender({ poolId: 'pool-b' });
    expect(result.current.analytics).toBe(null);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });
});
