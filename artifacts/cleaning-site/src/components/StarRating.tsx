import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ value, onChange, readOnly = false, className, size = 'md' }: StarRatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const handleMouseEnter = (index: number) => {
    if (!readOnly) setHoverValue(index);
  };

  const handleMouseLeave = () => {
    if (!readOnly) setHoverValue(null);
  };

  const handleClick = (index: number) => {
    if (!readOnly && onChange) {
      onChange(index);
    }
  };

  const currentDisplayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div 
      className={cn("flex items-center gap-1", className)}
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((index) => {
        const isFilled = index <= currentDisplayValue;
        
        return (
          <button
            key={index}
            type="button"
            className={cn(
              "text-yellow-400 focus:outline-none transition-transform",
              !readOnly && "hover:scale-110 cursor-pointer",
              readOnly && "cursor-default"
            )}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            disabled={readOnly}
          >
            <Star 
              className={cn(
                starSizes[size], 
                isFilled ? "fill-current" : "text-gray-300 fill-transparent"
              )} 
            />
          </button>
        );
      })}
    </div>
  );
}
