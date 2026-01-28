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
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      className={`skill-tag inline-flex items-center gap-1.5 ${
        matched ? 'skill-tag-matched' : 'skill-tag-missing'
      }`}
    >
      {matched ? (
        <Check className="w-3.5 h-3.5" />
      ) : (
        <X className="w-3.5 h-3.5" />
      )}
      {skill}
    </motion.span>
  );
}
