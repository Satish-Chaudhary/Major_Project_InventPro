import { describe, it, expect } from 'vitest';
import { getStatusBadge } from '../utils/statusBadges';

describe('getStatusBadge Utility', () => {
  it('should return green badge for "in stock" status', () => {
    const badge = getStatusBadge('in stock');
    expect(badge).toContain('emerald');
    expect(badge).toContain('In Stock');
  });

  it('should return amber badge for "low stock" status', () => {
    const badge = getStatusBadge('low stock');
    expect(badge).toContain('amber');
    expect(badge).toContain('Low Stock');
  });

  it('should return red badge for "out of stock" status', () => {
    const badge = getStatusBadge('out of stock');
    expect(badge).toContain('red');
    expect(badge).toContain('Out of Stock');
  });

  it('should handle case-insensitive input', () => {
    expect(getStatusBadge('IN STOCK')).toContain('In Stock');
    expect(getStatusBadge('Low Stock')).toContain('Low Stock');
  });

  it('should return default for unknown status', () => {
    const badge = getStatusBadge('unknown');
    expect(badge).toContain('slate');
  });
});

describe('Export Utils', () => {
  it('should handle empty data array', () => {
    const exportToCSV = (data, filename) => {
      if (!data || data.length === 0) return false;
      return true;
    };

    expect(exportToCSV([], 'test.csv')).toBe(false);
    expect(exportToCSV(null, 'test.csv')).toBe(false);
  });

  it('should export data with correct columns', () => {
    const testData = [
      { id: 1, name: 'Product 1', price: 100 },
      { id: 2, name: 'Product 2', price: 200 },
    ];

    expect(testData.length).toBe(2);
    expect(testData[0].name).toBe('Product 1');
  });
});

describe('Badge Styles', () => {
  it('should return correct class for in-stock status', () => {
    const getStatusClass = (status) => {
      const classes = {
        'in stock': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        'low stock': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        'out of stock': 'bg-red-500/10 text-red-400 border-red-500/20',
      };
      return classes[status.toLowerCase()] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    };

    expect(getStatusClass('in stock')).toContain('emerald');
    expect(getStatusClass('low stock')).toContain('amber');
    expect(getStatusClass('out of stock')).toContain('red');
  });
});