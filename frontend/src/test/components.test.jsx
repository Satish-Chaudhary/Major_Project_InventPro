import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: (state = {}) => state,
    },
  });
};

const renderWithProviders = (component) => {
  return render(
    <Provider store={createTestStore()}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('LoadingSkeleton Component', () => {
  it('should render TableSkeleton without crashing', () => {
    const { container } = renderWithProviders(<LoadingSkeleton.TableSkeleton rows={5} />);
    expect(container).toBeTruthy();
  });

  it('should render CardSkeleton without crashing', () => {
    const { container } = renderWithProviders(<LoadingSkeleton.CardSkeleton count={4} />);
    expect(container).toBeTruthy();
  });

  it('should render StatCardSkeleton without crashing', () => {
    const { container } = renderWithProviders(<LoadingSkeleton.StatCardSkeleton />);
    expect(container).toBeTruthy();
  });

  it('should render PageSkeleton without crashing', () => {
    const { container } = renderWithProviders(<LoadingSkeleton.PageSkeleton />);
    expect(container).toBeTruthy();
  });
});

describe('Skeleton Components', () => {
  it('should render multiple skeleton rows based on props', () => {
    const { container } = renderWithProviders(
      <table>
        <tbody>
          {[1, 2, 3].map((i) => (
            <LoadingSkeleton.TableRowSkeleton key={i} />
          ))}
        </tbody>
      </table>
    );
    
    const rows = container.querySelectorAll('tr');
    expect(rows.length).toBe(3);
  });
});