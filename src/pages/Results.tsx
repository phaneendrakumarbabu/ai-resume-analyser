import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Target, 
  FileCheck, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  ArrowLeft,
  RotateCcw,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ProgressBar';
import { SkillTag } from '@/components/SkillTag';
import { ScoreCard } from '@/components/ScoreCard';
import { AnalysisResult } from '@/lib/resumeData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface StoredResults extends AnalysisResult {
  roleName: string;
  analyzedAt: string;
  detailedFeedback?: string;
  isAIPowered?: boolean;
}

export default function Results() {
  const [results, setResults] = useState<StoredResults | null>(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!currentUser) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to view results.',
        variant: 'destructive',
      });
      navigate('/signin');
    }
  }, [currentUser, navigate, toast]);

  useEffect(() => {
    const stored = sessionStorage.getItem('analysisResults');
    if (stored) {
      setResults(JSON.parse(stored));
    }
  }, []);

  if (!results) {
    return (
      <div className="min-h-screen bg-transparent pt-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl border border-border bg-card/80 backdrop-blur-md p-8 text-center max-w-sm"
        >
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <FileCheck className="w-5 h-5 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">No Analysis Results</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Analyze a resume first to see your results here.
          </p>
          <Link to="/analyzer">
            <Button className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Go to Analyzer
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Analysis Results
              </h1>
              {results.isAIPowered && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-card/80 backdrop-blur-sm text-xs font-medium text-muted-foreground border border-border">
                  <Sparkle className="w-3 h-3" />
                  AI
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Target Role: <span className="font-medium text-foreground">{results.roleName}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="gap-2 text-xs bg-card/60 backdrop-blur-sm">
                <FileCheck className="w-3.5 h-3.5" />
                Dashboard
              </Button>
            </Link>
            <Link to="/analyzer">
              <Button variant="outline" size="sm" className="gap-2 text-xs bg-card/60 backdrop-blur-sm">
                <RotateCcw className="w-3.5 h-3.5" />
                New Analysis
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Score Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <ScoreCard
            title="Skill Match"
            value={`${results.matchPercentage}%`}
            subtitle={results.matchPercentage >= 75 ? 'Excellent match' : results.matchPercentage >= 50 ? 'Good match' : 'Needs improvement'}
            icon={Target}
            delay={0.1}
          />
          <ScoreCard
            title="ATS Score"
            value={`${results.atsScore}/100`}
            subtitle="Resume optimization"
            icon={FileCheck}
            delay={0.15}
          />
          <ScoreCard
            title="Matched Skills"
            value={results.matchedSkills.length}
            subtitle="Skills found"
            icon={CheckCircle2}
            delay={0.2}
          />
          <ScoreCard
            title="Missing Skills"
            value={results.missingSkills.length}
            subtitle="Skills to add"
            icon={XCircle}
            delay={0.25}
          />
        </div>

        {/* Progress Bars */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="rounded-xl border border-border bg-card/80 backdrop-blur-md p-5 sm:p-6 mb-6"
        >
          <h2 className="text-sm font-semibold text-foreground mb-5">Score Overview</h2>
          <div className="space-y-5">
            <ProgressBar value={results.matchPercentage} label="Skill Match Score" size="md" />
            <ProgressBar value={results.atsScore} label="ATS Compatibility Score" size="md" />
          </div>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Matched Skills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="rounded-xl border border-border bg-card/80 backdrop-blur-md p-5 sm:p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 text-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Matched Skills</h2>
              <span className="ml-auto text-xs font-mono text-muted-foreground">
                {results.matchedSkills.length} found
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {results.matchedSkills.length > 0 ? (
                results.matchedSkills.map((skill, index) => (
                  <SkillTag key={skill} skill={skill} matched index={index} />
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No matching skills found</p>
              )}
            </div>
          </motion.div>

          {/* Missing Skills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="rounded-xl border border-border bg-card/80 backdrop-blur-md p-5 sm:p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-4 h-4 text-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Missing Skills</h2>
              <span className="ml-auto text-xs font-mono text-muted-foreground">
                {results.missingSkills.length} to add
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {results.missingSkills.length > 0 ? (
                results.missingSkills.map((skill, index) => (
                  <SkillTag key={skill} skill={skill} matched={false} index={index} />
                ))
              ) : (
                <p className="text-sm text-foreground">Perfect! You have all required skills.</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="rounded-xl border border-border bg-card/80 backdrop-blur-md p-5 sm:p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-4 h-4 text-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Improvement Suggestions</h2>
          </div>
          <ul className="space-y-2.5">
            {results.suggestions.map((suggestion, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.06, duration: 0.3 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/60"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-foreground/10 flex items-center justify-center text-[10px] font-bold font-mono text-foreground">
                  {index + 1}
                </span>
                <span className="text-sm text-foreground leading-relaxed">{suggestion}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* AI Detailed Feedback */}
        {results.detailedFeedback && results.isAIPowered && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.4 }}
            className="rounded-xl border border-border bg-card/80 backdrop-blur-md p-5 sm:p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-4 h-4 text-foreground" />
              <h2 className="text-sm font-semibold text-foreground">AI Detailed Analysis</h2>
            </div>
            <div className="prose prose-sm max-w-none text-foreground/90">
              {results.detailedFeedback.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-3 text-sm leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Sparkle({ className }: { className?: string }) {
  return <Lightbulb className={className} />;
}
