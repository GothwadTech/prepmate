import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  clickable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  action,
  clickable = false,
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`card ${clickable ? 'card-clickable' : ''} ${className}`}
      {...props}
    >
      {(title || subtitle || action) && (
        <div className="card-header">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
