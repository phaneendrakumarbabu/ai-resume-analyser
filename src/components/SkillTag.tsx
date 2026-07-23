import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface SkillTagProps {
  skill: string;
  matched: boolean;
  index?: number;
}

export function SkillTag({ skill, matched, index = 0 }: SkillTagProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04, duration: 0.2, ease: 'easeOut' }}
      className={`skill-tag inline-flex items-center gap-1.5 ${
        matched ? 'skill-tag-matched' : 'skill-tag-missing'
      }`}
    >
      {matched ? (
        <Check className="w-3 h-3" strokeWidth={2.5} />
      ) : (
        <X className="w-3 h-3" strokeWidth={2.5} />
      )}
      {skill}
    </motion.span>
  );
}
