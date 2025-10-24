import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Modal } from './Modal';

const mockProps = {
  isOpen: true,
  onClose: vi.fn(),
  children: <div>Modal content</div>,
};

describe('Modal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset body overflow style
    document.body.style.overflow = 'unset';
  });

  afterEach(() => {
    // Clean up any remaining modals
    document.body.style.overflow = 'unset';
  });

  describe('Rendering', () => {
    it('does not render when isOpen is false', () => {
      render(<Modal {...mockProps} isOpen={false} />);
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
    });

    it('renders when isOpen is true', () => {
      render(<Modal {...mockProps} />);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('renders with title when provided', () => {
      render(<Modal {...mockProps} title="Test Modal" />);
      
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Test Modal');
    });

    it('renders without title when not provided', () => {
      render(<Modal {...mockProps} />);
      
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(<Modal {...mockProps} className="custom-modal" />);
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('modal', 'custom-modal');
    });

    it('renders close button', () => {
      render(<Modal {...mockProps} />);
      
      const closeButton = screen.getByLabelText('Close modal');
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveTextContent('×');
    });

    it('renders children content', () => {
      render(
        <Modal {...mockProps}>
          <div>Custom content</div>
          <button>Action button</button>
        </Modal>
      );
      
      expect(screen.getByText('Custom content')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action button' })).toBeInTheDocument();
    });
  });

  describe('Portal rendering', () => {
    it('renders modal in document.body', () => {
      render(<Modal {...mockProps} />);
      
      // Modal should be rendered as a direct child of body
      const modalBackdrop = document.querySelector('.modal-backdrop');
      expect(modalBackdrop?.parentElement).toBe(document.body);
    });

    it('creates modal backdrop', () => {
      render(<Modal {...mockProps} />);
      
      const backdrop = document.querySelector('.modal-backdrop');
      expect(backdrop).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<Modal {...mockProps} title="Accessible Modal" />);
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('role', 'dialog');
    });

    it('has accessible close button', () => {
      render(<Modal {...mockProps} />);
      
      const closeButton = screen.getByLabelText('Close modal');
      expect(closeButton).toHaveAttribute('aria-label', 'Close modal');
    });

    it('sets body overflow to hidden when open', () => {
      render(<Modal {...mockProps} />);
      
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('resets body overflow when closed', () => {
      const { rerender } = render(<Modal {...mockProps} />);
      
      expect(document.body.style.overflow).toBe('hidden');
      
      rerender(<Modal {...mockProps} isOpen={false} />);
      
      expect(document.body.style.overflow).toBe('unset');
    });

    it('resets body overflow on unmount', () => {
      const { unmount } = render(<Modal {...mockProps} />);
      
      expect(document.body.style.overflow).toBe('hidden');
      
      unmount();
      
      expect(document.body.style.overflow).toBe('unset');
    });
  });

  describe('Interactions', () => {
    it('calls onClose when close button is clicked', () => {
      render(<Modal {...mockProps} />);
      
      const closeButton = screen.getByLabelText('Close modal');
      fireEvent.click(closeButton);
      
      expect(mockProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop is clicked', () => {
      render(<Modal {...mockProps} />);
      
      const backdrop = document.querySelector('.modal-backdrop');
      fireEvent.click(backdrop!);
      
      expect(mockProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when modal content is clicked', () => {
      render(<Modal {...mockProps} />);
      
      const modal = screen.getByRole('dialog');
      fireEvent.click(modal);
      
      expect(mockProps.onClose).not.toHaveBeenCalled();
    });

    it('calls onClose when Escape key is pressed', () => {
      render(<Modal {...mockProps} />);
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      expect(mockProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when other keys are pressed', () => {
      render(<Modal {...mockProps} />);
      
      fireEvent.keyDown(document, { key: 'Enter' });
      fireEvent.keyDown(document, { key: 'Space' });
      fireEvent.keyDown(document, { key: 'Tab' });
      
      expect(mockProps.onClose).not.toHaveBeenCalled();
    });

    it('does not respond to Escape key when modal is closed', () => {
      render(<Modal {...mockProps} isOpen={false} />);
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      expect(mockProps.onClose).not.toHaveBeenCalled();
    });
  });

  describe('Event listeners', () => {
    it('adds event listener when modal opens', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      
      render(<Modal {...mockProps} />);
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      
      addEventListenerSpy.mockRestore();
    });

    it('removes event listener when modal closes', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
      
      const { rerender } = render(<Modal {...mockProps} />);
      
      rerender(<Modal {...mockProps} isOpen={false} />);
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      
      removeEventListenerSpy.mockRestore();
    });

    it('removes event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
      
      const { unmount } = render(<Modal {...mockProps} />);
      
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Structure', () => {
    it('has correct DOM structure', () => {
      render(<Modal {...mockProps} title="Test Modal" />);
      
      const backdrop = document.querySelector('.modal-backdrop');
      expect(backdrop).toBeInTheDocument();
      
      const modal = backdrop?.querySelector('.modal');
      expect(modal).toBeInTheDocument();
      
      const header = modal?.querySelector('.modal__header');
      expect(header).toBeInTheDocument();
      
      const title = header?.querySelector('.modal__title');
      expect(title).toBeInTheDocument();
      
      const closeButton = header?.querySelector('.modal__close');
      expect(closeButton).toBeInTheDocument();
      
      const content = modal?.querySelector('.modal__content');
      expect(content).toBeInTheDocument();
    });

    it('maintains correct element hierarchy', () => {
      render(<Modal {...mockProps} title="Test Modal" />);
      
      const modal = screen.getByRole('dialog');
      const header = modal.querySelector('.modal__header');
      const content = modal.querySelector('.modal__content');
      
      expect(header).toBeInTheDocument();
      expect(content).toBeInTheDocument();
      
      // Header should come before content
      expect(header?.nextElementSibling).toBe(content);
    });
  });

  describe('Multiple modals', () => {
    it('handles multiple modal instances', () => {
      const { rerender } = render(<Modal {...mockProps} title="First Modal" />);
      
      expect(screen.getByText('First Modal')).toBeInTheDocument();
      expect(document.body.style.overflow).toBe('hidden');
      
      rerender(<Modal {...mockProps} title="Second Modal" />);
      
      expect(screen.getByText('Second Modal')).toBeInTheDocument();
      expect(screen.queryByText('First Modal')).not.toBeInTheDocument();
      expect(document.body.style.overflow).toBe('hidden');
    });
  });

  describe('Edge cases', () => {
    it('handles empty title gracefully', () => {
      render(<Modal {...mockProps} title="" />);
      
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    it('handles onClose being called multiple times', () => {
      render(<Modal {...mockProps} />);
      
      const closeButton = screen.getByLabelText('Close modal');
      
      fireEvent.click(closeButton);
      fireEvent.click(closeButton);
      fireEvent.keyDown(document, { key: 'Escape' });
      
      expect(mockProps.onClose).toHaveBeenCalledTimes(3);
    });

    it('handles rapid open/close state changes', async () => {
      const { rerender } = render(<Modal {...mockProps} isOpen={false} />);
      
      rerender(<Modal {...mockProps} isOpen={true} />);
      expect(document.body.style.overflow).toBe('hidden');
      
      rerender(<Modal {...mockProps} isOpen={false} />);
      expect(document.body.style.overflow).toBe('unset');
      
      rerender(<Modal {...mockProps} isOpen={true} />);
      expect(document.body.style.overflow).toBe('hidden');
    });
  });
});
