import React from 'react';
import { render } from '@testing-library/react';
import { describe, it } from "node:test";
import DbDisplayTable from './DbDisplayTable';

describe('DbDisplayTable', () => {
  it('renders without crashing', () => {
    render(<DbDisplayTable />);
  });

  it('renders with custom props', () => {
    const customProps = {
      // customProps
    };

    render(<DbDisplayTable {...customProps} />);
  });
});
