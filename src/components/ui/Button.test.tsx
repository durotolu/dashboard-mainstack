import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  describe('Rendering', () => {
    it('renders with correct text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('renders with default classes when no props are provided', () => {
      render(<Button>Default Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn', 'btn--primary', 'btn--medium');
    });

    it('renders with custom className', () => {
      render(<Button className="custom-class">Custom Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn', 'btn--primary', 'btn--medium', 'custom-class');
    });

    it('renders children correctly', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      );
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('applies primary variant class by default', () => {
      render(<Button>Primary Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--primary');
    });

    it('applies secondary variant class', () => {
      render(<Button variant="secondary">Secondary Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--secondary');
      expect(button).not.toHaveClass('btn--primary');
    });

    it('applies outline variant class', () => {
      render(<Button variant="outline">Outline Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--outline');
      expect(button).not.toHaveClass('btn--primary');
    });
  });

  describe('Sizes', () => {
    it('applies medium size class by default', () => {
      render(<Button>Medium Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--medium');
    });

    it('applies small size class', () => {
      render(<Button size="small">Small Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--small');
      expect(button).not.toHaveClass('btn--medium');
    });

    it('applies large size class', () => {
      render(<Button size="large">Large Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--large');
      expect(button).not.toHaveClass('btn--medium');
    });
  });

  describe('Interactions', () => {
    it('handles click events', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick} disabled>Disabled Button</Button>);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('handles keyboard events', () => {
      const handleKeyDown = vi.fn();
      render(<Button onKeyDown={handleKeyDown}>Keyboard Button</Button>);

      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'Enter' });

      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });

    it('handles focus events', () => {
      const handleFocus = vi.fn();
      render(<Button onFocus={handleFocus}>Focus Button</Button>);

      const button = screen.getByRole('button');
      fireEvent.focus(button);

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });
  });

  describe('States', () => {
    it('can be disabled', () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('can have type attribute', () => {
      render(<Button type="submit">Submit Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('can have aria attributes', () => {
      render(<Button aria-label="Custom label" aria-describedby="description">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom label');
      expect(button).toHaveAttribute('aria-describedby', 'description');
    });

    it('can have data attributes', () => {
      render(<Button data-testid="test-button" data-custom="value">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-testid', 'test-button');
      expect(button).toHaveAttribute('data-custom', 'value');
    });
  });

  describe('Combinations', () => {
    it('applies multiple classes correctly', () => {
      render(
        <Button variant="outline" size="large" className="custom-class">
          Combined Button
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn', 'btn--outline', 'btn--large', 'custom-class');
    });

    it('works with all variants and sizes', () => {
      const variants = ['primary', 'secondary', 'outline'] as const;
      const sizes = ['small', 'medium', 'large'] as const;

      variants.forEach(variant => {
        sizes.forEach(size => {
          const { unmount } = render(
            <Button variant={variant} size={size}>
              {variant} {size}
            </Button>
          );
          const button = screen.getByRole('button');
          expect(button).toHaveClass(`btn--${variant}`, `btn--${size}`);
          unmount();
        });
      });
    });
  });
});
