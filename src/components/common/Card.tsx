import React from 'react';

export type CardVariant = 'default' | 'physics' | 'chemistry' | 'biology' | 'hero' | 'highlight' | 'gold' | 'glass';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  clickable?: boolean;
  variant?: CardVariant;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  action,
  clickable = false,
  variant = 'default',
  glow = false,
  children,
  className = '',
  ...props
}) => {
  const variantClass = variant !== 'default' ? `card-${variant}` : '';
  const glowClass = glow ? 'card-glow' : '';

  return (
    <div
      className={`card ${variantClass} ${glowClass} ${clickable ? 'card-clickable' : ''} ${className}`}
      {...props}
    >
      {(title || subtitle || action) && (
        <div className="card-header">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {action && <div className="card-action-wrap">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
