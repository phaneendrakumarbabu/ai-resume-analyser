import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ value, label, showPercentage = true, size = 'md' }: ProgressBarProps) {
  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const getColor = (val: number) => {
    if (val >= 75) return 'from-success to-success/80';
    if (val >= 50) return 'from-warning to-warning/80';
    return 'from-destructive to-destructive/80';
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-foreground">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-bold gradient-text">{value}%</span>
          )}
        </div>
      )}
      <div className={`progress-bar ${heights[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          className={`h-full rounded-full bg-gradient-to-r ${getColor(value)}`}
        />
      </div>
    </div>
  );
}
