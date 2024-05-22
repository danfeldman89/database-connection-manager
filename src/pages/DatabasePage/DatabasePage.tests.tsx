import React from 'react';
import { render } from '@testing-library/react';
import { describe, it } from "node:test";
import DatabasePage from './DatabasePage';

describe('DatabasePage', () => {
  it('renders without crashing', () => {
    render(<DatabasePage />);
  });

  it('renders with custom props', () => {
    const customProps = {
      // customProps
    };

    render(<DatabasePage {...customProps} />);
  });
});
