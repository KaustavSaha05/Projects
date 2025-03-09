import React, { LabelHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
}

const Label: React.FC<LabelProps> = ({ className, children, htmlFor, ...props }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('block text-sm font-medium text-foreground', className)}
      {...props}
    >
      {children}
    </label>
  );
};

export { Label };
