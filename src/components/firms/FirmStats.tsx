'use client';

import {
  BuildingOfficeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

interface FirmStatsProps {
  totalFirms: number;
  totalContacts: number;
  totalTransactions: number;
  avgScore?: number;
}

export default function FirmStats({
  totalFirms,
  totalContacts,
  totalTransactions,
  avgScore,
}: FirmStatsProps) {
  const stats = [
    {
      label: 'Total Firms',
      value: totalFirms.toLocaleString(),
      icon: BuildingOfficeIcon,
      color: 'text-brand-400',
      borderColor: 'border-brand-500/20',
      bgColor: 'bg-brand-500/5',
    },
    {
      label: 'Contacts',
      value: totalContacts.toLocaleString(),
      icon: UserGroupIcon,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      bgColor: 'bg-emerald-500/5',
    },
    {
      label: 'Transactions',
      value: totalTransactions.toLocaleString(),
      icon: DocumentTextIcon,
      color: 'text-gold-400',
      borderColor: 'border-gold-500/20',
      bgColor: 'bg-gold-500/5',
    },
    {
      label: 'Avg Score',
      value: avgScore !== undefined ? avgScore.toFixed(0) : '—',
      icon: ArrowTrendingUpIcon,
      color: 'text-purple-400',
      borderColor: 'border-purple-500/20',
      bgColor: 'bg-purple-500/5',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`${stat.bgColor} border ${stat.borderColor} rounded-xl px-4 py-4 transition-all hover:shadow-glow`}
          >
            <div className="flex items-center gap-3">
              <div className={`${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xs text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className={`text-xl font-bold text-white mt-0.5`}>{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
