import React from 'react';
import './Loading.css';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  text,
  className = '',
}) => {
  return (
    <div className={`loading ${className}`}>
      <div className={`loading__spinner loading__spinner--${size}`}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {text && <p className="loading__text">{text}</p>}
    </div>
  );
};
