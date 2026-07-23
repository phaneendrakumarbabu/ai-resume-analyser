import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Upload, Sparkles, Briefcase, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { sampleResumeText, jobRoles, analyzeResume, skillsByRole } from '@/lib/resumeData';
import { extractTextFromPDF } from '@/lib/pdfParser';
import { analyzeResumeWithAI, isAIConfigured } from '@/lib/aiService';
import { testEnvironment } from '@/lib/testEnv';
import { historyService } from '@/lib/historyService';
import { firestoreService } from '@/lib/firestoreService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import * as Icons from 'lucide-react';

// Test environment on component load
testEnvironment();

export default function Analyzer() {
  const [resumeText, setResumeText] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!currentUser) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to analyze resumes.',
        variant: 'destructive',
      });
      navigate('/signin');
    }
  }, [currentUser, navigate, toast]);

  const loadSample = () => {
    setResumeText(sampleResumeText);
    toast({
      title: 'Sample Resume Loaded',
      description: 'You can now select a job role and analyze!',
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'application/pdf') {
      setIsParsing(true);
      try {
        const text = await extractTextFromPDF(file);
        setResumeText(text);
        toast({
          title: 'PDF Parsed Successfully',
          description: `Extracted ${text.length} characters from your resume.`,
        });
      } catch (error) {
        console.error('PDF parsing error:', error);
        toast({
          title: 'PDF Parsing Failed',
          description: 'Could not extract text from PDF. Please try pasting the text manually.',
          variant: 'destructive',
        });
      } finally {
        setIsParsing(false);
      }
      return;
    }

    const text = await file.text();
    setResumeText(text);
    toast({
      title: 'File Loaded',
      description: 'Resume text has been loaded successfully.',
    });
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast({
        title: 'Resume Required',
        description: 'Please paste or upload your resume first.',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedRole) {
      toast({
        title: 'Job Role Required',
        description: 'Please select a target job role.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Wrap everything in a try-catch to ensure we always navigate
    const performAnalysis = async () => {
      try {
        const roleName = jobRoles.find(r => r.id === selectedRole)?.name || '';
        const requiredSkills = skillsByRole[selectedRole] || [];
        
        let results;
        let analysisMethod = 'basic';
        
        // Priority: 1. Gemini AI, 2. Basic keyword matching
        
        // Try Gemini AI first
        console.log('🔍 Checking if AI is configured...');
        const aiConfigured = isAIConfigured();
        console.log('🔍 AI configured result:', aiConfigured);
        
        if (aiConfigured) {
          console.log('✅ AI is configured, starting Gemini AI analysis...');
          try {
            console.log('Starting Gemini AI analysis...');
            const aiResults = await analyzeResumeWithAI(resumeText, selectedRole, roleName, requiredSkills);
            results = {
              ...aiResults,
              isAIPowered: true,
              modelType: 'gemini',
            };
            analysisMethod = 'ai';
            
            toast({
              title: 'AI Analysis Complete',
              description: 'Your resume has been analyzed using Gemini AI.',
            });
          } catch (error: any) {
            console.error('❌ AI analysis failed:', error);
            console.error('❌ Error details:', {
              message: error.message,
              status: error.status,
              code: error.code,
              type: error.constructor.name
            });
            
            // Show specific error message for server overload
            if (error.message.includes('overloaded') || error.message.includes('temporarily') || error.message.includes('503')) {
              toast({
                title: 'AI Servers Busy',
                description: 'Gemini servers are overloaded. Using enhanced keyword analysis instead.',
                variant: 'default',
              });
            } else {
              toast({
                title: 'AI Temporarily Unavailable',
                description: 'Using keyword analysis. AI will be back shortly.',
                variant: 'default',
              });
            }
            // Continue to basic analysis
          }
        }
        
        // Fallback to basic keyword matching
        if (!results) {
          console.log('Using basic keyword matching analysis');
          results = {
            ...analyzeResume(resumeText, selectedRole),
            isAIPowered: false,
            modelType: 'basic',
          };
          analysisMethod = 'basic';
          
          toast({
            title: 'Using Basic Analysis',
            description: 'Advanced analysis unavailable. Using keyword matching.',
          });
        }
        
        // Store results in sessionStorage
        sessionStorage.setItem('analysisResults', JSON.stringify({
          ...results,
          roleName,
          analyzedAt: new Date().toISOString(),
        }));
        
        // Save to history (localStorage for non-logged in users)
        historyService.saveAnalysis(roleName, selectedRole, results, 'My Resume');
        
        // Save to Firestore if user is logged in (don't wait for it)
        if (currentUser) {
          firestoreService.saveAnalysis(
            currentUser.uid,
            roleName,
            selectedRole,
            results,
            'My Resume'
          ).catch(error => {
            console.error('Error saving to Firestore:', error);
            // Continue anyway - localStorage backup exists
          });
        }
        
        return true;
      } catch (error) {
        console.error('Analysis error:', error);
        toast({
          title: 'Analysis Failed',
          description: 'An error occurred during analysis. Please try again.',
          variant: 'destructive',
        });
        return false;
      }
    };
    
    // Perform analysis and navigate regardless of outcome
    const success = await performAnalysis();
    
    if (success) {
      console.log('Analysis complete, navigating to results...');
      navigate('/results');
    } else {
      setIsAnalyzing(false);
    }
  };

  // Show loading state while checking authentication
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center p-8 rounded-xl border border-border bg-card/80 backdrop-blur-md">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
            Resume Analyzer
          </h1>
          <p className="text-muted-foreground text-sm">
            Paste your resume and select a job role to get instant skill matching analysis.
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Resume Input */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="rounded-xl border border-border bg-card/80 backdrop-blur-md p-5 sm:p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">Your Resume</h2>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={loadSample} className="gap-1.5 text-xs bg-card hover:bg-muted/80 text-foreground border-border/80">
                  <Sparkles className="w-3.5 h-3.5" />
                  Load Sample
                </Button>
                <label>
                  <Button variant="outline" size="sm" asChild className="gap-1.5 cursor-pointer text-xs bg-card hover:bg-muted/80 text-foreground border-border/80" disabled={isParsing}>
                    <span>
                      {isParsing ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      {isParsing ? 'Parsing...' : 'Upload PDF'}
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept=".txt,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isParsing}
                  />
                </label>
              </div>
            </div>
            
            <Textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here..."
              className="min-h-[240px] resize-none font-mono text-xs leading-relaxed bg-card text-foreground dark:bg-card dark:text-foreground dark:border-border/80 dark:placeholder:text-muted-foreground/80 shadow-xs"
            />
            
            <p className="text-xs text-muted-foreground mt-3 font-mono">
              {resumeText.length} characters · Include skills, experience, and education
            </p>
          </motion.div>

          {/* Job Role Selection */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="rounded-xl border border-border bg-card/80 backdrop-blur-md p-5 sm:p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Target Job Role</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {jobRoles.map((role) => {
                const IconComponent = Icons[role.icon as keyof typeof Icons] as Icons.LucideIcon;
                const isSelected = selectedRole === role.id;
                
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                      isSelected
                        ? 'border-foreground bg-foreground/10 ring-1 ring-foreground'
                        : 'border-border/80 hover:border-foreground/30 hover:bg-muted/60 bg-card text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-md ${isSelected ? 'bg-foreground/15' : 'bg-muted'}`}>
                        <IconComponent className={`w-4 h-4 ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`} />
                      </div>
                      <span className={`font-medium text-xs ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {role.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Analyze Button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !resumeText.trim() || !selectedRole}
              className="w-full h-12 text-sm gap-2 shadow-lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze Resume
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
