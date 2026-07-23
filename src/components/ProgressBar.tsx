import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ value, label, showPercentage = true, size = 'md' }: ProgressBarProps) {
  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5',
  };

  const getColor = (val: number) => {
    if (val >= 75) return 'bg-foreground';
    if (val >= 50) return 'bg-muted-foreground';
    return 'bg-destructive';
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-foreground">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-semibold tabular-nums text-foreground">{value}%</span>
          )}
        </div>
      )}
      <div className={`w-full rounded-full overflow-hidden bg-muted ${heights[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          className={`h-full rounded-full ${getColor(value)}`}
        />
      </div>
    </div>
  );
}
