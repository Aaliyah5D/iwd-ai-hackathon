import React, { useState } from 'react';
import { Heart, Shield, Pill, GraduationCap, DollarSign, ChevronRight, ExternalLink, Landmark } from 'lucide-react';
import { cn, STUDENT_BANK_ACCOUNTS } from '../lib/utils';

const CATEGORIES = [
  { id: 'first-aid', label: 'First Aid', icon: Heart, color: 'bg-lavender text-lavender-dark' },
  { id: 'safety', label: 'Safety & DV', icon: Shield, color: 'bg-coral text-red-500' },
  { id: 'sexual', label: 'Sexual Health', icon: Pill, color: 'bg-mint text-mint-dark' },
  { id: 'academic', label: 'Academic & Stress', icon: GraduationCap, color: 'bg-secondary text-muted' },
  { id: 'financial', label: 'Financial', icon: DollarSign, color: 'bg-primary/20 text-text' },
  { id: 'banking', label: 'Student Banking', icon: Landmark, color: 'bg-blue-100 text-blue-600' },
];

const RESOURCES = [
  ...STUDENT_BANK_ACCOUNTS.map(bank => ({
    id: bank.bank.toLowerCase().replace(/\s+/g, '-'),
    category: 'banking',
    title: `${bank.bank}: ${bank.name}`,
    description: bank.description,
    link: bank.link,
    type: 'Bank'
  })),
  {
    id: 'cpr',
    category: 'first-aid',
    title: 'CPR Guide',
    description: 'Push hard and fast in the center of the chest (100-120 bpm).',
    link: 'https://www.redcross.org/take-a-class/cpr/performing-cpr/cpr-steps',
    type: 'Guide',
  },
  {
    id: 'heimlich',
    category: 'first-aid',
    title: 'Heimlich Maneuver',
    description: 'Abdominal thrusts for choking victims.',
    link: 'https://www.mayoclinic.org/first-aid/first-aid-choking/basics/art-20056637',
    type: 'Guide',
  },
  {
    id: 'study-tips',
    category: 'academic',
    title: 'Study Tips & Pomodoro',
    description: 'Maximize focus with the 25/5 minute technique.',
    link: 'https://todoist.com/productivity-methods/pomodoro-technique',
    type: 'Tips',
  },
  {
    id: 'stress-help',
    category: 'academic',
    title: 'Managing Exam Stress',
    description: 'Practical ways to stay calm during finals.',
    link: 'https://www.unicef.org/parenting/health-tips/how-to-cope-with-exam-stress',
    type: 'Wellness',
  },
  {
    id: '1',
    category: 'first-aid',
    title: 'SADAG Helpline',
    description: 'Free, 24/7 support for depression and anxiety.',
    link: 'tel:0800456789',
    type: 'Call',
  },
  {
    id: '2',
    category: 'safety',
    title: 'Lifeline South Africa',
    description: 'Crisis support and gender-based violence assistance.',
    link: 'tel:0861322322',
    type: 'Call',
  },
  {
    id: 'nsfas',
    category: 'financial',
    title: 'NSFAS Portal',
    description: 'National Student Financial Aid Scheme applications and status.',
    link: 'https://www.nsfas.org.za/content/',
    type: 'Portal',
  },
  {
    id: 'gbv-command',
    category: 'safety',
    title: 'GBV Command Centre',
    description: 'Emergency line for gender-based violence victims.',
    link: 'tel:0800428428',
    type: 'Call',
  },
  {
    id: 'campus-security',
    category: 'safety',
    title: 'Campus Security',
    description: 'Always save your specific campus security number.',
    link: 'https://www.google.com/search?q=campus+security+south+africa',
    type: 'Search',
  },
  {
    id: 'planned-parenthood',
    category: 'sexual',
    title: 'Planned Parenthood',
    description: 'Global sexual health and education resources.',
    link: 'https://www.plannedparenthood.org/',
    type: 'Web',
  },
  {
    id: 'khan-academy',
    category: 'academic',
    title: 'Khan Academy',
    description: 'Free online courses, lessons and practice.',
    link: 'https://www.khanacademy.org/',
    type: 'Web',
  },
  {
    id: 'bursaries-sa',
    category: 'financial',
    title: 'Bursaries South Africa',
    description: 'Database of available bursaries for SA students.',
    link: 'https://www.bursaries-southafrica.co.za/',
    type: 'Web',
  },
  {
    id: 'love-life',
    category: 'sexual',
    title: 'loveLife',
    description: 'Youth-led health and sexuality education.',
    link: 'https://www.lovelife.org.za/',
    type: 'Web',
  },
];

export function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('first-aid');

  const filteredResources = RESOURCES.filter(r => r.category === activeCategory);

  return (
    <div className="p-5 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-text tracking-tight">Resources</h1>
        <p className="text-[10px] font-black text-muted uppercase tracking-widest">Help for every situation.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full border-[2.5px] transition-all whitespace-nowrap font-black text-[10px] uppercase tracking-widest",
              activeCategory === cat.id
                ? "bg-primary border-primary text-text shadow-[0_3px_0_0_#E66A85]"
                : "bg-white border-border text-muted hover:border-primary/40"
            )}
          >
            <cat.icon size={14} />
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredResources.map((res) => (
          <a
            key={res.id}
            href={res.link}
            target="_blank"
            rel="noopener noreferrer"
            className="pastel-card flex items-center gap-3 group p-4"
          >
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-muted group-hover:bg-primary/20 group-hover:text-primary transition-colors shrink-0">
              <ExternalLink size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-text truncate">{res.title}</h3>
                <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-secondary rounded-full text-muted shrink-0">
                  {res.type}
                </span>
              </div>
              <p className="text-[10px] text-muted font-bold mt-0.5 leading-tight line-clamp-1">{res.description}</p>
            </div>
            <ChevronRight className="text-border group-hover:text-primary transition-colors shrink-0" size={18} />
          </a>
        ))}
      </div>

      <div className="bg-lavender p-4 rounded-[24px] border-[2.5px] border-lavender-dark/20 text-center">
        <p className="text-[10px] font-black text-lavender-dark italic uppercase tracking-wider">
          "The best way to find yourself is to lose yourself in the service of others."
        </p>
      </div>
    </div>
  );
}
