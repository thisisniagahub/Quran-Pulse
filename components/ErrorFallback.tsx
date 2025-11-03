import React from 'react';
import { WrenchScrewdriverIcon, RefreshIcon } from './icons/Icons';
import { Button } from './ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';

interface ErrorFallbackProps {
  error: Error | null;
  resetErrorBoundary: () => void;
  title?: string;
  message?: string;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  title = "Maaf, Sesuatu Telah Berlaku",
  message = "Terdapat ralat yang tidak dijangka dalam bahagian aplikasi ini. Sila cuba lagi atau muat semula halaman.",
}) => {
  return (
    <div
      role="alert"
      className="flex items-center justify-center h-full"
    >
      <Card className="w-full max-w-lg text-center p-8 bg-card-light dark:bg-card-dark">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit">
            <WrenchScrewdriverIcon className="w-10 h-10" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-foreground-light/80 dark:text-foreground-dark/80">
            {message}
          </p>
          <Button onClick={resetErrorBoundary}>
            <RefreshIcon className="w-4 h-4 mr-2" />
            Cuba Semula
          </Button>

          {process.env.NODE_ENV === 'development' && error && (
            <details className="mt-6 text-left bg-background-light dark:bg-background-dark p-4 rounded-md">
              <summary className="cursor-pointer font-semibold text-xs text-foreground-light/70 dark:text-foreground-dark/70">
                Butiran Teknikal
              </summary>
              <pre className="mt-2 text-xs text-red-500 whitespace-pre-wrap break-words">
                {error.message}
                {'\n\n'}
                {error.stack}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
