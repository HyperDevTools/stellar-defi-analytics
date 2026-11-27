import { expect } from '@jest/globals';
import { createElement } from 'react';
import { render, screen } from '@testing-library/react';
import { PoolReserves } from '@/components/PoolReserves';
import { TVLCard } from '@/components/TVLCard';
import { useTVL } from '@/hooks/useTVL';

jest.mock('@/hooks/useTVL');

it('announces the unavailable TVL state with no numeric amount', () => {
  jest.mocked(useTVL).mockReturnValue({ status: 'unavailable', reason: 'No USD valuation provider is configured.' });
  render(createElement(TVLCard));
  expect(screen.getByRole('status').textContent).toMatch(/unavailable/i);
  expect(screen.queryByText(/1,000,000/)).toBeNull();
});

it('announces an unavailable pool snapshot', () => {
  render(createElement(PoolReserves, {
    snapshot: { status: 'unavailable', reason: 'Horizon could not return pool reserves.' },
  }));
  expect(screen.getByRole('status').textContent).toContain('Horizon could not return pool reserves');
  expect(screen.queryByRole('table')).toBeNull();
});
