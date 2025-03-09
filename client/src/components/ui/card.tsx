import React, { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  className?: string;
  children: ReactNode;
}

const Card: React.FC<CardProps> = ({ className, children }) => {
  return (
    <div className={cn('bg-white shadow-md rounded-2xl p-4', className)}>
      {children}
    </div>
  );
};

interface CardContentProps {
  className?: string;
  children: ReactNode;
}

const CardContent: React.FC<CardContentProps> = ({ className, children }) => {
  return <div className={cn('p-2', className)}>{children}</div>;
};

export { Card, CardContent };
