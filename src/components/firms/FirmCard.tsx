'use client';

import Link from 'next/link';
import { formatCentsToUSD, formatCheckSizeRange, CRM_STATUS_CONFIG } from '@/lib/constants';
import {
  MapPinIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

interface FirmCardProps {
  id: string;
  name: string;
  description: string | null;
  headquartersCity: string | null;
  headquartersState: string | null;
  headquartersCountry: string | null;
  aumCents: string | null;
  minCheckSizeCents: string | null;
  maxCheckSizeCents: string | null;
  stagePreferences: string[];
  dealTypePreferences: string[];
  crmStatus: string;
  internalScore: number | null;
  priority: string;
  institutionTypes: { institutionType: { name: string; slug: string; color: string | null }; isPrimary: boolean }[];
  industries: { industry: { name: string; slug: string; color: string | null }; isPrimary: boolean }[];
  tags: { tag: { name: string; slug: string; color: string | null } }[];
  _count: { contacts: number; transactions: number };
}

export default function FirmCard({
  id,
  name,
  description,
  headquartersCity,
  headquartersState,
  headquartersCountry,
  aumCents,
  minCheckSizeCents,
  maxCheckSizeCents,
  stagePreferences,
  crmStatus,
  internalScore,
  institutionTypes,
  industries,
  tags,
  _count,
}: FirmCardProps) {
  const location = [headquartersCity, headquartersState, headquartersCountry]
    .filter(Boolean)
    .join(', ');

  const crmConfig = CRM_STATUS_CONFIG[crmStatus] || CRM_STATUS_CONFIG.PROSPECT;

  return (
    <Link href={`/firms/${id}`} className="block group">
      <div className="relative bg-white border border-sand-200 rounded-xl p-5 transition-all duration-300 hover:border-brand-300 hover:shadow-card-hover hover:-translate-y-0.5">
        {/* Score indicator bar */}
        {internalScore !== null && (
          <div className="absolute top-0 left-4 right-4 h-0.5 rounded-b overflow-hidden">
            <div
              className="h-full rounded-b transition-all duration-500"
              style={{
                width: `${internalScore}%`,
                background: internalScore >= 80
                  ? '#5c674f'
                  : internalScore >= 60
                    ? '#a67c4a'
                    : internalScore >= 40
                      ? '#7c92b1'
                      : '#9a8d7c',
              }}
            />
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-warm-900 font-semibold text-base truncate group-hover:text-brand-700 transition-colors">
              {name}
            </h3>
            {location && (
              <div className="flex items-center gap-1.5 mt-1 text-warm-400 text-xs">
                <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{location}</span>
              </div>
            )}
          </div>
          <span
            className="text-2xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ color: crmConfig.color, backgroundColor: crmConfig.bgColor }}
          >
            {crmConfig.label}
          </span>
        </div>

        {/* Institution Type Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {institutionTypes.slice(0, 3).map(({ institutionType: it }) => (
            <span
              key={it.slug}
              className="text-2xs font-medium px-2 py-0.5 rounded-md"
              style={{
                color: it.color || '#6b5e4f',
                backgroundColor: `${it.color || '#6b5e4f'}12`,
                border: `1px solid ${it.color || '#6b5e4f'}25`,
              }}
            >
              {it.name}
            </span>
          ))}
          {institutionTypes.length > 3 && (
            <span className="text-2xs text-warm-400 px-1.5 py-0.5">
              +{institutionTypes.length - 3}
            </span>
          )}
        </div>

        {/* Industry Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {industries.slice(0, 3).map(({ industry: ind }) => (
            <span
              key={ind.slug}
              className="text-2xs text-warm-600 px-1.5 py-0.5 rounded bg-sand-100"
            >
              {ind.name}
            </span>
          ))}
          {industries.length > 3 && (
            <span className="text-2xs text-warm-400 px-1 py-0.5">
              +{industries.length - 3}
            </span>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-xs text-warm-500 line-clamp-2 mb-3 leading-relaxed">
            {description}
          </p>
        )}

        {/* Financial Metrics */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {aumCents && (
            <div className="bg-brand-50 rounded-lg px-3 py-2">
              <div className="text-2xs text-warm-400 uppercase tracking-wider">AUM</div>
              <div className="text-sm font-semibold text-brand-700">
                {formatCentsToUSD(Number(aumCents))}
              </div>
            </div>
          )}
          {(minCheckSizeCents || maxCheckSizeCents) && (
            <div className="bg-sand-50 rounded-lg px-3 py-2">
              <div className="text-2xs text-warm-400 uppercase tracking-wider">Check Size</div>
              <div className="text-sm font-semibold text-warm-800">
                {formatCheckSizeRange(
                  minCheckSizeCents ? Number(minCheckSizeCents) : null,
                  maxCheckSizeCents ? Number(maxCheckSizeCents) : null
                )}
              </div>
            </div>
          )}
        </div>

        {/* Stage Preferences */}
        {stagePreferences.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {stagePreferences.slice(0, 3).map((stage) => (
              <span
                key={stage}
                className="text-2xs text-brand-700 px-1.5 py-0.5 rounded bg-brand-50 border border-brand-200"
              >
                {stage}
              </span>
            ))}
            {stagePreferences.length > 3 && (
              <span className="text-2xs text-warm-400 px-1">
                +{stagePreferences.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 4).map(({ tag }) => (
              <span
                key={tag.slug}
                className="text-2xs text-warm-500 px-1.5 py-0.5 rounded-full bg-sand-100 border border-sand-200"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Footer Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-sand-200">
          <div className="flex items-center gap-3 text-xs text-warm-400">
            <div className="flex items-center gap-1">
              <UserGroupIcon className="h-3.5 w-3.5" />
              <span>{_count.contacts}</span>
            </div>
            <div className="flex items-center gap-1">
              <DocumentTextIcon className="h-3.5 w-3.5" />
              <span>{_count.transactions}</span>
            </div>
          </div>
          {internalScore !== null && (
            <div className="flex items-center gap-1.5">
              <ArrowTrendingUpIcon className="h-3.5 w-3.5 text-warm-400" />
              <span className="text-xs font-medium text-warm-500">{internalScore}/100</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
