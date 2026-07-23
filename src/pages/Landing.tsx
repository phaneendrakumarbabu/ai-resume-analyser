import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Target, BarChart3, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Target,
    title: 'Skill Matching',
    description: 'Compare your skills against job requirements with precision analysis.',
  },
  {
    icon: BarChart3,
    title: 'ATS Score',
    description: 'Optimize your resume for applicant tracking systems instantly.',
  },
  {
    icon: Zap,
    title: 'Instant Analysis',
    description: 'Get detailed, actionable feedback in seconds — powered by AI.',
  },
];

const steps = [
  { step: '01', text: 'Paste your resume or upload PDF' },
  { step: '02', text: 'Select your target job role' },
  { step: '03', text: 'Get instant skill analysis' },
  { step: '04', text: 'Improve with personalized suggestions' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-transparent pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/80 backdrop-blur-md text-xs font-medium text-muted-foreground mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Resume Analysis
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6"
            >
              Match your skills to{' '}
              <span className="relative">
                dream jobs
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M1 5.5Q50 1 100 5.5T199 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-foreground/20" />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Analyze your resume against job requirements, discover skill gaps,
              and get actionable suggestions to land your next role.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/analyzer">
                <Button size="lg" className="gap-2 px-8 h-12 text-base shadow-lg">
                  Start Analyzing
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/analyzer">
                <Button size="lg" variant="outline" className="gap-2 h-12 text-base bg-card/50 backdrop-blur-md">
                  Try Demo Resume
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
              Everything you need
            </h2>
            <p className="text-muted-foreground text-base max-w-lg mx-auto">
              Powerful tools to analyze, optimize, and improve your resume for any role.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group rounded-xl border border-border bg-card/80 backdrop-blur-md p-6 transition-all duration-200 hover:shadow-lg hover:border-foreground/20"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:bg-foreground/10 transition-colors duration-200">
                  <feature.icon className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-24 border-t border-border/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
              How it works
            </h2>
            <p className="text-muted-foreground text-base max-w-lg mx-auto">
              Four simple steps to optimize your resume for any position.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="text-center sm:text-left p-4 rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm"
              >
                <span className="inline-block text-xs font-mono font-semibold text-muted-foreground mb-3 tracking-wider">
                  {item.step}
                </span>
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24 border-t border-border/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4">
              Ready to optimize your resume?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Join thousands of job seekers improving their resumes with AI-powered analysis.
            </p>
            <Link to="/analyzer">
              <Button size="lg" className="gap-2 px-8 h-12 text-base shadow-lg">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 bg-card/40 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-foreground flex items-center justify-center">
                <FileText className="w-3 h-3 text-background" />
              </div>
              <span className="text-sm font-semibold text-foreground">ResumeAI Pro</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} ResumeAI Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
