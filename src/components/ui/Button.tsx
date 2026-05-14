'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'outline-light';
  href?: string;
  children: React.ReactNode;
}

export const Button = ({ variant = 'primary', href, children, className, ...props }: ButtonProps) => {
  const baseStyles = "btn";
  const variantStyles = {
    primary: "btn-primary",
    outline: "btn-outline",
    ghost: "btn-ghost",
    'outline-light': "btn-outline-light",
  };

  const combinedStyles = cn(baseStyles, variantStyles[variant], className);

  if (href) {
    return (
      <Link href={href} className={combinedStyles}>
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <button className={combinedStyles} {...props}>
      <span>{children}</span>
    </button>
  );
};
