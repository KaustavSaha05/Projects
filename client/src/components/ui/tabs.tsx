import React, { useState } from 'react';
import { cn } from '../../lib/utils';

interface TabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  className?: string;
}

export const Tabs = ({ children, defaultValue, className }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={cn('flex flex-col', className)}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === TabsList) {
          return React.cloneElement(child as React.ReactElement<any>, { activeTab, setActiveTab });
        }
        return child;
      })}
    </div>
  );
};

interface TabsListProps {
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (value: string) => void;
}

export const TabsList = ({ children, activeTab, setActiveTab }: TabsListProps) => {
  return (
    <div className="flex border-b">
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === TabsTrigger) {
          return React.cloneElement(child as React.ReactElement<any>, { activeTab, setActiveTab });
        }
        return child;
      })}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (value: string) => void;
}

export const TabsTrigger = ({ value, children, activeTab, setActiveTab }: TabsTriggerProps) => {
  const isActive = activeTab === value;

  return (
    <button
      className={cn(
        'px-4 py-2 text-sm font-medium',
        isActive ? 'border-b-2 border-secondary text-secondary' : 'text-muted-foreground'
      )}
      onClick={() => setActiveTab?.(value)}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  activeTab?: string;
}

export const TabsContent = ({ value, children, activeTab }: TabsContentProps) => {
  return activeTab === value ? <div className="p-4">{children}</div> : null;
};
