import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ScoreCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  delay?: number;
}

export function ScoreCard({ title, value, subtitle, icon: Icon, delay = 0 }: ScoreCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className="rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:shadow-md hover:border-foreground/10 group"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="p-2 rounded-lg bg-muted group-hover:bg-foreground/5 transition-colors duration-200">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      
      <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
}
