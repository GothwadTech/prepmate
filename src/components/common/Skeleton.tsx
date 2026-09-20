import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '16px',
  borderRadius = 'var(--radius-xs)',
  className = '',
  style,
}) => {
  return (
    <div
      className={`skeleton-box ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
      aria-hidden="true"
    />
  );
};

export const TaskSkeleton: React.FC = () => {
  return (
    <div className="task-item skeleton-item" style={{ opacity: 0.85, cursor: 'default' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
        <Skeleton width="22px" height="22px" borderRadius="4px" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Skeleton width="60%" height="15px" />
          <div style={{ display: 'flex', gap: '6px' }}>
            <Skeleton width="55px" height="18px" borderRadius="var(--radius-pill)" />
            <Skeleton width="110px" height="18px" />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '6px' }}>
        <Skeleton width="28px" height="28px" borderRadius="50%" />
        <Skeleton width="28px" height="28px" borderRadius="50%" />
      </div>
    </div>
  );
};

export const GoalSkeleton: React.FC = () => {
  return (
    <div className="card goal-card skeleton-item" style={{ opacity: 0.85, gap: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton width="70px" height="20px" borderRadius="var(--radius-pill)" />
        <Skeleton width="60px" height="16px" />
      </div>
      <Skeleton width="75%" height="18px" />
      <Skeleton width="100%" height="9px" borderRadius="9999px" />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton width="40%" height="14px" />
        <Skeleton width="25%" height="14px" />
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC<{ rows?: number }> = ({ rows = 3 }) => {
  return (
    <div className="card skeleton-item" style={{ opacity: 0.85, gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton width="45%" height="18px" />
        <Skeleton width="20%" height="18px" borderRadius="var(--radius-pill)" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} width={`${90 - i * 15}%`} height="14px" />
      ))}
    </div>
  );
};
