import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';
import { RefreshCwIcon } from '../icons/SvgIcons';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('PrepMate Uncaught Error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backgroundColor: 'var(--bg)',
            color: 'var(--text-primary)',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '400px',
              textAlign: 'center',
              padding: '24px',
              gap: '16px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--danger-container)',
                color: 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                fontSize: '28px',
              }}
            >
              ⚠️
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>
              Oops! Kuch galat ho gaya
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Aapka study data local cache me surakshit hai. App ko refresh karke restart karein.
            </p>
            {this.state.error && (
              <pre
                style={{
                  fontSize: '11px',
                  backgroundColor: 'var(--surface-variant)',
                  padding: '8px',
                  borderRadius: 'var(--radius-xs)',
                  color: 'var(--danger)',
                  overflowX: 'auto',
                  textAlign: 'left',
                  maxHeight: '100px',
                }}
              >
                {this.state.error.message}
              </pre>
            )}
            <Button
              variant="primary"
              onClick={this.handleReset}
              leftIcon={<RefreshCwIcon size={16} />}
            >
              App Refresh Karein
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
