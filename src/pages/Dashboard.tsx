import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  FileText, 
  Target, 
  Download, 
  Trash2, 
  BarChart3,
  Calendar,
  Award,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { historyService, AnalysisHistory } from '@/lib/historyService';
import { exportAnalysisToPDF, exportComparisonToPDF } from '@/lib/pdfExport';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [stats, setStats] = useState(historyService.getStats());
  const [chartData, setChartData] = useState(historyService.getChartData());
  const [selectedAnalyses, setSelectedAnalyses] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!currentUser) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to view your dashboard.',
        variant: 'destructive',
      });
      navigate('/signin');
    }
  }, [currentUser, navigate, toast]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = historyService.getHistory();
    setHistory(data);
    setStats(historyService.getStats());
    setChartData(historyService.getChartData());
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this analysis?')) {
      historyService.deleteAnalysis(id);
      loadData();
      setSelectedAnalyses(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      historyService.clearHistory();
      loadData();
      setSelectedAnalyses(new Set());
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedAnalyses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleExportSelected = () => {
    const selected = history.filter(item => selectedAnalyses.has(item.id));
    if (selected.length === 0) {
      alert('Please select at least one analysis to export');
      return;
    }
    
    if (selected.length === 1) {
      exportAnalysisToPDF(selected[0]);
    } else {
      exportComparisonToPDF(selected);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-foreground';
    if (score >= 50) return 'text-muted-foreground';
    return 'text-destructive';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 75) return 'bg-muted/70';
    if (score >= 50) return 'bg-muted/70';
    return 'bg-destructive/10';
  };

  return (
    <div className="min-h-screen bg-transparent pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Track your resume improvement journey
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <div className="rounded-xl border border-border bg-card/80 backdrop-blur-md p-5 transition-all duration-200 hover:shadow-md hover:border-foreground/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground">Total Analyses</span>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold tabular-nums text-foreground">{stats.totalAnalyses}</div>
              <p className="text-xs text-muted-foreground mt-1">Resume scans completed</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <div className="rounded-xl border border-border bg-card/80 backdrop-blur-md p-5 transition-all duration-200 hover:shadow-md hover:border-foreground/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground">Avg Skill Match</span>
                <Target className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className={`text-2xl font-bold tabular-nums ${getScoreColor(stats.averageScore)}`}>
                {stats.averageScore}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Across all analyses</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="rounded-xl border border-border bg-card/80 backdrop-blur-md p-5 transition-all duration-200 hover:shadow-md hover:border-foreground/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground">Avg ATS Score</span>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className={`text-2xl font-bold tabular-nums ${getScoreColor(stats.averageATS)}`}>
                {stats.averageATS}/100
              </div>
              <p className="text-xs text-muted-foreground mt-1">Resume optimization</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            <div className="rounded-xl border border-border bg-card/80 backdrop-blur-md p-5 transition-all duration-200 hover:shadow-md hover:border-foreground/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground">Improvement</span>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className={`text-2xl font-bold tabular-nums ${stats.improvement >= 0 ? 'text-foreground' : 'text-destructive'}`}>
                {stats.improvement >= 0 ? '+' : ''}{stats.improvement}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Recent vs older analyses</p>
            </div>
          </motion.div>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mb-8"
          >
            <div className="rounded-xl border border-border bg-card/80 backdrop-blur-md">
              <div className="p-5 sm:p-6 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Score Trends</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Track your improvement over time</p>
              </div>
              <div className="p-5 sm:p-6">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                      tickLine={false}
                      axisLine={{ stroke: 'var(--border)' }}
                    />
                    <YAxis 
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                      tickLine={false}
                      axisLine={{ stroke: 'var(--border)' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        fontSize: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                      }}
                      labelStyle={{ color: 'var(--foreground)', fontWeight: 600 }}
                      itemStyle={{ color: 'var(--muted-foreground)' }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="skillMatch" 
                      stroke="var(--foreground)" 
                      strokeWidth={2}
                      name="Skill Match %"
                      dot={{ fill: 'var(--foreground)', r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="atsScore" 
                      stroke="var(--muted-foreground)" 
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      name="ATS Score"
                      dot={{ fill: 'var(--muted-foreground)', r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {/* Actions Bar */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            <Button
              onClick={handleExportSelected}
              disabled={selectedAnalyses.size === 0}
              size="sm"
              className="gap-2 text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Export Selected ({selectedAnalyses.size})
            </Button>
            
            <Button
              onClick={handleClearAll}
              variant="outline"
              size="sm"
              className="gap-2 text-xs text-destructive hover:text-destructive bg-card/60 backdrop-blur-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </Button>

            <Button
              onClick={loadData}
              variant="outline"
              size="sm"
              className="gap-2 text-xs bg-card/60 backdrop-blur-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </Button>
          </motion.div>
        )}

        {/* History List */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className="rounded-xl border border-border bg-card/80 backdrop-blur-md">
            <div className="p-5 sm:p-6 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Analysis History</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {history.length === 0 
                  ? 'No analyses yet. Start by analyzing your resume!' 
                  : `${history.length} analysis${history.length > 1 ? 'es' : ''} saved`
                }
              </p>
            </div>
            <div className="p-5 sm:p-6">
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">No analyses yet</h3>
                  <p className="text-xs text-muted-foreground mb-5">
                    Start analyzing your resume to see your progress here
                  </p>
                  <Link to="/analyzer">
                    <Button size="sm" className="gap-2 text-xs">
                      Analyze Resume
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index, duration: 0.3 }}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        selectedAnalyses.has(item.id)
                          ? 'border-foreground/30 bg-muted/60'
                          : 'border-border hover:border-foreground/20 bg-background/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedAnalyses.has(item.id)}
                          onChange={() => toggleSelection(item.id)}
                          className="mt-1 h-4 w-4 rounded border-border accent-foreground cursor-pointer"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h4 className="font-semibold text-sm text-foreground">{item.roleName}</h4>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(item.timestamp).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                                {item.results.isAIPowered && (
                                  <span className="px-1.5 py-0.5 rounded-md bg-muted text-[10px] font-medium border border-border">
                                    AI
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex gap-1.5 flex-shrink-0">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => exportAnalysisToPDF(item)}
                                className="h-7 px-2 text-xs gap-1"
                              >
                                <Download className="w-3 h-3" />
                                PDF
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(item.id)}
                                className="h-7 px-2 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-2 mt-3">
                            <div className={`p-2.5 rounded-lg ${getScoreBgColor(item.results.matchPercentage)}`}>
                              <div className="text-[10px] text-muted-foreground mb-0.5">Skill Match</div>
                              <div className={`text-base font-bold tabular-nums ${getScoreColor(item.results.matchPercentage)}`}>
                                {item.results.matchPercentage}%
                              </div>
                            </div>

                            <div className={`p-2.5 rounded-lg ${getScoreBgColor(item.results.atsScore)}`}>
                              <div className="text-[10px] text-muted-foreground mb-0.5">ATS Score</div>
                              <div className={`text-base font-bold tabular-nums ${getScoreColor(item.results.atsScore)}`}>
                                {item.results.atsScore}
                              </div>
                            </div>

                            <div className="p-2.5 rounded-lg bg-muted/60">
                              <div className="text-[10px] text-muted-foreground mb-0.5">Matched</div>
                              <div className="text-base font-bold tabular-nums text-foreground">
                                {item.results.matchedSkills.length}
                              </div>
                            </div>

                            <div className="p-2.5 rounded-lg bg-muted/60">
                              <div className="text-[10px] text-muted-foreground mb-0.5">Missing</div>
                              <div className="text-base font-bold tabular-nums text-foreground">
                                {item.results.missingSkills.length}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
