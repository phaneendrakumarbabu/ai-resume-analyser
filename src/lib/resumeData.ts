export const sampleResumeText = `John Smith
Senior Software Developer
john.smith@email.com | (555) 123-4567 | linkedin.com/in/johnsmith

PROFESSIONAL SUMMARY
Results-driven software developer with 5+ years of experience in full-stack web development. Proficient in JavaScript, React, Node.js, and cloud technologies. Strong problem-solving skills with a passion for creating efficient, scalable applications.

TECHNICAL SKILLS
Programming Languages: JavaScript, TypeScript, Python, HTML, CSS
Frameworks & Libraries: React, Node.js, Express.js, Next.js, Tailwind CSS
Databases: MongoDB, PostgreSQL, MySQL, Redis
Cloud & DevOps: AWS, Docker, Git, CI/CD, Linux
Tools: VS Code, Jira, Figma, Postman

WORK EXPERIENCE
Senior Frontend Developer | TechCorp Inc. | 2021 - Present
• Led development of customer-facing dashboard using React and TypeScript
• Implemented responsive designs and improved performance by 40%
• Mentored junior developers and conducted code reviews
• Collaborated with UX team to improve user experience

Full Stack Developer | StartupXYZ | 2019 - 2021
• Built RESTful APIs using Node.js and Express
• Developed database schemas and optimized queries
• Integrated third-party APIs and payment gateways
• Participated in agile development sprints

EDUCATION
Bachelor of Science in Computer Science
State University | 2019

CERTIFICATIONS
• AWS Certified Developer - Associate
• Google Analytics Certified`;

export const jobRoles = [
  { id: 'cybersecurity', name: 'Cybersecurity Analyst', icon: 'Shield' },
  { id: 'webdev', name: 'Web Developer', icon: 'Code' },
  { id: 'data', name: 'Data Analyst', icon: 'BarChart3' },
  { id: 'devops', name: 'DevOps Engineer', icon: 'Server' },
  { id: 'mobile', name: 'Mobile Developer', icon: 'Smartphone' },
  { id: 'cloud', name: 'Cloud Engineer', icon: 'Cloud' },
];

export const skillsByRole: Record<string, string[]> = {
  cybersecurity: [
    'Network Security', 'Penetration Testing', 'SIEM', 'Firewall Management',
    'Incident Response', 'Vulnerability Assessment', 'Security Auditing',
    'Cryptography', 'Python', 'Linux', 'Risk Assessment', 'Compliance',
    'Threat Intelligence', 'Malware Analysis', 'Security Frameworks'
  ],
  webdev: [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'HTML', 'CSS',
    'REST APIs', 'Git', 'Responsive Design', 'Testing', 'Next.js',
    'Tailwind CSS', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker'
  ],
  data: [
    'Python', 'SQL', 'Excel', 'Tableau', 'Power BI', 'Statistics',
    'Data Visualization', 'Machine Learning', 'R', 'ETL',
    'Data Cleaning', 'A/B Testing', 'Pandas', 'NumPy', 'BigQuery'
  ],
  devops: [
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'CI/CD', 'Jenkins',
    'Terraform', 'Ansible', 'Linux', 'Git', 'Python', 'Bash',
    'Monitoring', 'Prometheus', 'Grafana', 'Networking'
  ],
  mobile: [
    'React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android',
    'Mobile UI/UX', 'REST APIs', 'Firebase', 'App Store Deployment',
    'Push Notifications', 'Offline Storage', 'Testing'
  ],
  cloud: [
    'AWS', 'Azure', 'GCP', 'Kubernetes', 'Docker', 'Terraform',
    'CloudFormation', 'Serverless', 'Lambda', 'S3', 'EC2',
    'Networking', 'Security', 'Cost Optimization', 'Python'
  ],
};

export interface AnalysisResult {
  matchPercentage: number;
  atsScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  detailedFeedback?: string;
  isAIPowered?: boolean;
}

export function analyzeResume(resumeText: string, roleId: string): AnalysisResult {
  const requiredSkills = skillsByRole[roleId] || [];
  const resumeLower = resumeText.toLowerCase();
  
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  
  requiredSkills.forEach(skill => {
    if (resumeLower.includes(skill.toLowerCase())) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });
  
  const matchPercentage = Math.round((matchedSkills.length / requiredSkills.length) * 100);
  
  // Calculate ATS score based on various factors
  const hasContactInfo = /email|phone|linkedin/i.test(resumeLower) ? 15 : 0;
  const hasExperience = /experience|work/i.test(resumeLower) ? 20 : 0;
  const hasEducation = /education|degree|bachelor|master/i.test(resumeLower) ? 15 : 0;
  const hasSkillsSection = /skills|technical/i.test(resumeLower) ? 15 : 0;
  const skillsScore = Math.min(35, Math.round((matchedSkills.length / requiredSkills.length) * 35));
  
  const atsScore = hasContactInfo + hasExperience + hasEducation + hasSkillsSection + skillsScore;
  
  // Generate suggestions
  const suggestions: string[] = [];
  
  if (missingSkills.length > 0) {
    suggestions.push(`Add these key skills to your resume: ${missingSkills.slice(0, 3).join(', ')}`);
  }
  
  if (!hasContactInfo) {
    suggestions.push('Include complete contact information (email, phone, LinkedIn)');
  }
  
  if (matchPercentage < 50) {
    suggestions.push('Consider taking courses or certifications in the missing skill areas');
  }
  
  if (matchPercentage >= 50 && matchPercentage < 75) {
    suggestions.push('Highlight projects that demonstrate your skills with specific metrics');
  }
  
  if (matchPercentage >= 75) {
    suggestions.push('Your skills match well! Focus on quantifying your achievements');
  }
  
  suggestions.push('Use action verbs and include measurable results in your experience section');
  
  return {
    matchPercentage,
    atsScore,
    matchedSkills,
    missingSkills,
    suggestions: suggestions.slice(0, 5),
  };
}
