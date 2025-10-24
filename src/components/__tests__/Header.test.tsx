import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, beforeEach, expect, vi } from 'vitest';
import { Header } from '../Header';

// Mock the useUser hook
vi.mock('../../hooks/useApi', () => ({
  useUser: () => ({
    data: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com'
    },
    loading: false,
    error: null
  })
}));

describe('Header Dropdown', () => {
  beforeEach(() => {
    // Clear any previous DOM state
    document.body.innerHTML = '';
  });

  test('renders hamburger menu button', () => {
    render(<Header />);
    const menuButton = screen.getByRole('button', { name: /menu/i });
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('opens dropdown when hamburger button is clicked', async () => {
    render(<Header />);
    const menuButton = screen.getByRole('button', { name: /menu/i });
    
    fireEvent.click(menuButton);
    
    await waitFor(() => {
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menu', { name: /user menu/i })).toBeInTheDocument();
    });
  });

  test('displays user information in dropdown', async () => {
    render(<Header />);
    const menuButton = screen.getByRole('button', { name: /menu/i });
    
    fireEvent.click(menuButton);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    });
  });

  test('displays all menu items', async () => {
    render(<Header />);
    const menuButton = screen.getByRole('button', { name: /menu/i });
    
    fireEvent.click(menuButton);
    
    await waitFor(() => {
      expect(screen.getByRole('menuitem', { name: /settings/i })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: /purchase history/i })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: /refer and earn/i })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: /integrations/i })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: /report bug/i })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: /switch account/i })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: /sign out/i })).toBeInTheDocument();
    });
  });

  test('closes dropdown when clicking outside', async () => {
    render(<Header />);
    const menuButton = screen.getByRole('button', { name: /menu/i });
    
    // Open dropdown
    fireEvent.click(menuButton);
    await waitFor(() => {
      expect(screen.getByRole('menu', { name: /user menu/i })).toBeInTheDocument();
    });
    
    // Click outside
    fireEvent.mouseDown(document.body);
    
    await waitFor(() => {
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('menu', { name: /user menu/i })).not.toBeInTheDocument();
    });
  });

  test('closes dropdown when pressing Escape key', async () => {
    render(<Header />);
    const menuButton = screen.getByRole('button', { name: /menu/i });
    
    // Open dropdown
    fireEvent.click(menuButton);
    await waitFor(() => {
      expect(screen.getByRole('menu', { name: /user menu/i })).toBeInTheDocument();
    });
    
    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' });
    
    await waitFor(() => {
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('menu', { name: /user menu/i })).not.toBeInTheDocument();
    });
  });

  test('toggles dropdown when hamburger button is clicked multiple times', async () => {
    render(<Header />);
    const menuButton = screen.getByRole('button', { name: /menu/i });
    
    // First click - open
    fireEvent.click(menuButton);
    await waitFor(() => {
      expect(screen.getByRole('menu', { name: /user menu/i })).toBeInTheDocument();
    });
    
    // Second click - close
    fireEvent.click(menuButton);
    await waitFor(() => {
      expect(screen.queryByRole('menu', { name: /user menu/i })).not.toBeInTheDocument();
    });
  });
});

describe('Header Apps Dropdown', () => {
  beforeEach(() => {
    // Clear any previous DOM state
    document.body.innerHTML = '';
  });

  test('renders Apps button', () => {
    render(<Header />);
    const appsButton = screen.getByRole('button', { name: /apps/i });
    expect(appsButton).toBeInTheDocument();
  });

  test('toggles Apps dropdown when Apps button is clicked', async () => {
    render(<Header />);
    const appsButton = screen.getByRole('button', { name: /apps/i });

    // Initially dropdown should not be visible
    expect(screen.queryByRole('menu', { name: /apps menu/i })).not.toBeInTheDocument();

    // Click to open dropdown
    fireEvent.click(appsButton);

    await waitFor(() => {
      expect(screen.getByRole('menu', { name: /apps menu/i })).toBeInTheDocument();
    });

    // Click again to close dropdown
    fireEvent.click(appsButton);

    await waitFor(() => {
      expect(screen.queryByRole('menu', { name: /apps menu/i })).not.toBeInTheDocument();
    });
  });

  test('applies active state styling when dropdown is open', async () => {
    render(<Header />);
    const appsButton = screen.getByRole('button', { name: /apps/i });

    // Initially should not have active class
    expect(appsButton).not.toHaveClass('nav-link--active');

    // Click to open dropdown
    fireEvent.click(appsButton);

    await waitFor(() => {
      expect(appsButton).toHaveClass('nav-link--active');
    });
  });

  test('displays all app items in dropdown', async () => {
    render(<Header />);
    const appsButton = screen.getByRole('button', { name: /apps/i });
    fireEvent.click(appsButton);

    await waitFor(() => {
      // Use more specific selectors to avoid conflicts with screen reader text
      const dropdown = screen.getByRole('menu', { name: /apps menu/i });
      expect(dropdown).toBeInTheDocument();

      // Check for dropdown descriptions that are unique to each app
      expect(screen.getByText('Manage your Link in Bio')).toBeInTheDocument();
      expect(screen.getByText('Manage your Store activities')).toBeInTheDocument();
      expect(screen.getByText('Manage your Media Kit')).toBeInTheDocument();
      expect(screen.getByText('Manage your Invoices')).toBeInTheDocument();
      expect(screen.getByText('Manage your Bookings')).toBeInTheDocument();
    });
  });

  test('closes Apps dropdown when clicking outside', async () => {
    render(<Header />);
    const appsButton = screen.getByRole('button', { name: /apps/i });
    fireEvent.click(appsButton);

    await waitFor(() => {
      expect(screen.getByRole('menu', { name: /apps menu/i })).toBeInTheDocument();
    });

    // Click outside the dropdown
    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(screen.queryByRole('menu', { name: /apps menu/i })).not.toBeInTheDocument();
    });
  });

  test('closes Apps dropdown when pressing Escape key', async () => {
    render(<Header />);
    const appsButton = screen.getByRole('button', { name: /apps/i });
    fireEvent.click(appsButton);

    await waitFor(() => {
      expect(screen.getByRole('menu', { name: /apps menu/i })).toBeInTheDocument();
    });

    // Press Escape key
    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('menu', { name: /apps menu/i })).not.toBeInTheDocument();
    });
  });

  test('has proper accessibility attributes', async () => {
    render(<Header />);
    const appsButton = screen.getByRole('button', { name: /apps/i });

    // Initially aria-expanded should be false
    expect(appsButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(appsButton);

    await waitFor(() => {
      expect(appsButton).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
