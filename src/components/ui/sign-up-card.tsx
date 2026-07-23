import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Lock, Eye, EyeClosed, ArrowRight, FileText } from 'lucide-react';
import { cn } from "@/lib/utils"
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export function SignUpCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // For 3D card effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure your passwords match',
        variant: 'destructive'
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await signUp(email, password);
      toast({
        title: 'Account created!',
        description: 'Welcome to ResumeAI Pro',
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      let errorMessage = 'Could not create account';
      if (error?.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered';
      } else if (error?.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error?.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      } else if (error?.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/Password sign-up is not enabled';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast({
        title: 'Welcome!',
        description: 'Account created successfully',
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Google sign up error:', error);
      toast({
        title: 'Sign Up Failed',
        description: error.message || 'Could not sign up with Google',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Background — clean monochrome */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black" />

      {/* Subtle noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-soft-light" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />

      {/* Subtle radial glow */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[80vh] h-[40vh] rounded-b-full bg-white/[0.03] blur-[80px]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm relative z-10 px-4"
        style={{ perspective: 1500 }}
      >
        <motion.div
          className="relative"
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative group">
            {/* Card border glow on hover */}
            <div className="absolute -inset-[0.5px] rounded-2xl bg-gradient-to-b from-white/10 to-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Card */}
            <div className="relative bg-neutral-950/80 backdrop-blur-xl rounded-2xl p-7 border border-white/[0.08] shadow-2xl">
              {/* Header */}
              <div className="text-center space-y-1.5 mb-7">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="mx-auto w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-3"
                >
                  <FileText className="w-5 h-5 text-black" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-xl font-semibold text-white tracking-tight"
                >
                  Create account
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="text-white/50 text-sm"
                >
                  Sign up to start using ResumeAI Pro
                </motion.p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  {/* Email */}
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focusedInput === "email" ? 'text-white' : 'text-white/30'}`} />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedInput("email")}
                      onBlur={() => setFocusedInput(null)}
                      className="w-full bg-white/[0.05] border-white/[0.08] focus:border-white/20 focus-visible:ring-white/10 text-white placeholder:text-white/30 h-10 pl-10 pr-3 rounded-lg"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focusedInput === "password" ? 'text-white' : 'text-white/30'}`} />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedInput("password")}
                      onBlur={() => setFocusedInput(null)}
                      className="w-full bg-white/[0.05] border-white/[0.08] focus:border-white/20 focus-visible:ring-white/10 text-white placeholder:text-white/30 h-10 pl-10 pr-10 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <Eye className="w-4 h-4 text-white/30 hover:text-white/60 transition-colors" />
                      ) : (
                        <EyeClosed className="w-4 h-4 text-white/30 hover:text-white/60 transition-colors" />
                      )}
                    </button>
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focusedInput === "confirmPassword" ? 'text-white' : 'text-white/30'}`} />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setFocusedInput("confirmPassword")}
                      onBlur={() => setFocusedInput(null)}
                      className="w-full bg-white/[0.05] border-white/[0.08] focus:border-white/20 focus-visible:ring-white/10 text-white placeholder:text-white/30 h-10 pl-10 pr-3 rounded-lg"
                    />
                  </div>
                </div>

                {/* Sign up button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2"
                >
                  <div className="relative overflow-hidden bg-white text-black font-medium h-10 rounded-lg transition-all duration-200 flex items-center justify-center hover:bg-white/90">
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center"
                        >
                          <div className="w-4 h-4 border-2 border-black/60 border-t-transparent rounded-full animate-spin" />
                        </motion.div>
                      ) : (
                        <motion.span
                          key="button-text"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-1.5 text-sm font-medium"
                        >
                          Sign Up
                          <ArrowRight className="w-3.5 h-3.5" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>

                {/* Divider */}
                <div className="relative flex items-center my-5">
                  <div className="flex-grow border-t border-white/[0.06]" />
                  <span className="mx-3 text-xs text-white/30">or</span>
                  <div className="flex-grow border-t border-white/[0.06]" />
                </div>

                {/* Google Sign Up */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={isLoading}
                  className="w-full"
                >
                  <div className="bg-white/[0.05] text-white/80 font-medium h-10 rounded-lg border border-white/[0.08] hover:border-white/15 hover:bg-white/[0.08] transition-all duration-200 flex items-center justify-center gap-2 text-sm">
                    <span className="font-semibold">G</span>
                    Sign up with Google
                  </div>
                </motion.button>

                {/* Sign in link */}
                <p className="text-center text-xs text-white/50 mt-5">
                  Already have an account?{' '}
                  <Link to="/signin" className="text-white hover:text-white/70 font-medium transition-colors underline underline-offset-4 decoration-white/30 hover:decoration-white/60">
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
