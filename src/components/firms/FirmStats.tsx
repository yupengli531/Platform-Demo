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
      color: 'text-brand-600',
      borderColor: 'border-brand-200',
      bgColor: 'bg-brand-50',
    },
    {
      label: 'Contacts',
      value: totalContacts.toLocaleString(),
      icon: UserGroupIcon,
      color: 'text-sage-600',
      borderColor: 'border-sage-200',
      bgColor: 'bg-sage-50',
    },
    {
      label: 'Transactions',
      value: totalTransactions.toLocaleString(),
      icon: DocumentTextIcon,
      color: 'text-warm-700',
      borderColor: 'border-sand-200',
      bgColor: 'bg-sand-50',
    },
    {
      label: 'Avg Score',
      value: avgScore !== undefined ? avgScore.toFixed(0) : '—',
      icon: ArrowTrendingUpIcon,
      color: 'text-brand-700',
      borderColor: 'border-brand-200',
      bgColor: 'bg-brand-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`${stat.bgColor} border ${stat.borderColor} rounded-xl px-4 py-4 transition-all hover:shadow-card`}
          >
            <div className="flex items-center gap-3">
              <div className={`${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xs text-warm-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold text-warm-900 mt-0.5">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
