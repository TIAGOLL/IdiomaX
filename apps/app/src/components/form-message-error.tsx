import { cva, type VariantProps } from 'class-variance-authority';
import { AlertTriangle, CircleX, LucideInfo } from 'lucide-react';
import type { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const formMessageErrorVariants = cva('', {
  variants: {
    variant: {
      error: 'text-red-500',
      info: 'text-gray-500',
      attencion: 'text-yellow-600',
    },
  },
  defaultVariants: {
    variant: 'error',
  },
});

export interface FormMessageErrorSchema
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formMessageErrorVariants> {
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl>;
}

export function FormMessageError({
  variant = 'error',
  error,
  className,
  ...props
}: FormMessageErrorSchema) {
  const errorMessage =
    error && (typeof error === 'string' ? error : (error as FieldError)?.message);

  return (
    error && (
      <div className={cn(formMessageErrorVariants({ variant }), className)} {...props}>
        <Tooltip>
          <div className='flex items-center justify-start gap-1 text-sm'>
            {variant === 'attencion' && <AlertTriangle className='w-4' />}
            {variant === 'info' && <LucideInfo className='w-4' />}
            {variant === 'error' && <CircleX className='w-4' />}
            {errorMessage}
          </div>
        </Tooltip>
      </div>
    )
  );
}
