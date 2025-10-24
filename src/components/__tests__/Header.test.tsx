import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
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
