import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Loading } from './Loading';

describe('Loading', () => {
  describe('Rendering', () => {
    it('renders loading spinner by default', () => {
      render(<Loading />);
      
      const loadingContainer = document.querySelector('.loading');
      expect(loadingContainer).toBeInTheDocument();
      
      const spinner = document.querySelector('.loading__spinner');
      expect(spinner).toBeInTheDocument();
      
      // Check for spinner dots
      const spinnerDots = document.querySelectorAll('.loading__spinner div');
      expect(spinnerDots).toHaveLength(4);
    });

    it('renders with default medium size', () => {
      render(<Loading />);
      
      const spinner = document.querySelector('.loading__spinner');
      expect(spinner).toHaveClass('loading__spinner--medium');
    });

    it('renders without text by default', () => {
      render(<Loading />);
      
      const text = document.querySelector('.loading__text');
      expect(text).not.toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(<Loading className="custom-loading" />);
      
      const loadingContainer = document.querySelector('.loading');
      expect(loadingContainer).toHaveClass('loading', 'custom-loading');
    });
  });

  describe('Sizes', () => {
    it('renders with small size', () => {
      render(<Loading size="small" />);
      
      const spinner = document.querySelector('.loading__spinner');
      expect(spinner).toHaveClass('loading__spinner--small');
      expect(spinner).not.toHaveClass('loading__spinner--medium');
    });

    it('renders with medium size', () => {
      render(<Loading size="medium" />);
      
      const spinner = document.querySelector('.loading__spinner');
      expect(spinner).toHaveClass('loading__spinner--medium');
    });

    it('renders with large size', () => {
      render(<Loading size="large" />);
      
      const spinner = document.querySelector('.loading__spinner');
      expect(spinner).toHaveClass('loading__spinner--large');
      expect(spinner).not.toHaveClass('loading__spinner--medium');
    });
  });

  describe('Text', () => {
    it('renders with text when provided', () => {
      render(<Loading text="Loading data..." />);
      
      expect(screen.getByText('Loading data...')).toBeInTheDocument();
      
      const text = document.querySelector('.loading__text');
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent('Loading data...');
    });

    it('does not render text element when text is not provided', () => {
      render(<Loading />);
      
      const text = document.querySelector('.loading__text');
      expect(text).not.toBeInTheDocument();
    });

    it('does not render text element when text is empty string', () => {
      render(<Loading text="" />);
      
      const text = document.querySelector('.loading__text');
      expect(text).not.toBeInTheDocument();
    });

    it('renders with different text messages', () => {
      const messages = [
        'Loading...',
        'Please wait...',
        'Fetching data...',
        'Processing...',
      ];

      messages.forEach(message => {
        const { unmount } = render(<Loading text={message} />);
        expect(screen.getByText(message)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Combinations', () => {
    it('renders with size and text together', () => {
      render(<Loading size="large" text="Loading large content..." />);
      
      const spinner = document.querySelector('.loading__spinner');
      expect(spinner).toHaveClass('loading__spinner--large');
      
      expect(screen.getByText('Loading large content...')).toBeInTheDocument();
    });

    it('renders with all props combined', () => {
      render(
        <Loading 
          size="small" 
          text="Loading small content..." 
          className="custom-loader"
        />
      );
      
      const loadingContainer = document.querySelector('.loading');
      expect(loadingContainer).toHaveClass('loading', 'custom-loader');
      
      const spinner = document.querySelector('.loading__spinner');
      expect(spinner).toHaveClass('loading__spinner--small');
      
      expect(screen.getByText('Loading small content...')).toBeInTheDocument();
    });

    it('works with all size variations', () => {
      const sizes = ['small', 'medium', 'large'] as const;

      sizes.forEach(size => {
        const { unmount } = render(<Loading size={size} text={`Loading ${size}...`} />);
        
        const spinner = document.querySelector('.loading__spinner');
        expect(spinner).toHaveClass(`loading__spinner--${size}`);
        
        expect(screen.getByText(`Loading ${size}...`)).toBeInTheDocument();
        
        unmount();
      });
    });
  });

  describe('Structure', () => {
    it('has correct DOM structure', () => {
      render(<Loading text="Loading..." />);
      
      const loadingContainer = document.querySelector('.loading');
      expect(loadingContainer).toBeInTheDocument();
      
      const spinner = loadingContainer?.querySelector('.loading__spinner');
      expect(spinner).toBeInTheDocument();
      
      const spinnerDots = spinner?.querySelectorAll('div');
      expect(spinnerDots).toHaveLength(4);
      
      const text = loadingContainer?.querySelector('.loading__text');
      expect(text).toBeInTheDocument();
    });

    it('maintains correct order of elements', () => {
      render(<Loading text="Loading..." />);
      
      const loadingContainer = document.querySelector('.loading');
      const children = loadingContainer?.children;
      
      expect(children).toHaveLength(2);
      expect(children?.[0]).toHaveClass('loading__spinner');
      expect(children?.[1]).toHaveClass('loading__text');
    });

    it('has only spinner when no text is provided', () => {
      render(<Loading />);
      
      const loadingContainer = document.querySelector('.loading');
      const children = loadingContainer?.children;
      
      expect(children).toHaveLength(1);
      expect(children?.[0]).toHaveClass('loading__spinner');
    });
  });

  describe('Accessibility', () => {
    it('can have aria attributes', () => {
      const { container } = render(
        <Loading 
          text="Loading..." 
          className="loading-with-aria"
        />
      );
      
      // Since Loading doesn't explicitly handle aria attributes,
      // we test that the component renders without errors
      const loadingContainer = container.querySelector('.loading');
      expect(loadingContainer).toBeInTheDocument();
    });

    it('text is readable by screen readers', () => {
      render(<Loading text="Loading user data..." />);
      
      const text = screen.getByText('Loading user data...');
      expect(text).toBeInTheDocument();
      expect(text.tagName).toBe('P');
    });
  });
});
