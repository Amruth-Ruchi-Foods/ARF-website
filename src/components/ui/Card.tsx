import type { HTMLAttributes, ReactNode } from 'react';

type CardVariant = 'glass' | 'solid' | 'outlined';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  glass: 'glassmorphism',
  solid: 'bg-neutral-darkBg border border-white/10',
  outlined: 'bg-transparent border-2 border-[#2E7D32]',
};

export function Card({
  variant = 'glass',
  children,
  className = '',
  ...rest
}: CardProps) {
  return (
    <div
      className={[
        'rounded-xl p-6',
        variantClasses[variant],
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Card;
