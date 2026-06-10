import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#2E7D32] text-white hover:bg-[#8BC34A] shadow-md hover:shadow-[0_0_12px_rgba(124,255,178,0.5)]',
  secondary:
    'bg-[#FF9800] text-white hover:bg-[#8BC34A] shadow-md hover:shadow-[0_0_12px_rgba(124,255,178,0.5)]',
  outline:
    'border-2 border-[#2E7D32] text-[#2E7D32] bg-transparent hover:bg-[#2E7D32] hover:text-white',
  ghost:
    'bg-transparent text-[#7CFFB2] hover:bg-white/10',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm min-h-[36px]',
  md: 'px-5 py-2.5 text-base min-h-[44px]',
  lg: 'px-7 py-3.5 text-lg min-h-[52px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.04 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={[
        'inline-flex items-center justify-center rounded-lg font-heading font-semibold',
        'transition-colors duration-200 cursor-pointer select-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7CFFB2]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      disabled={disabled}
      {...(rest as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}

export default Button;
