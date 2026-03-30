import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/analytics - Dashboard statistics and aggregations
export async function GET() {
  try {
    const [
      totalFirms,
      totalContacts,
      totalTransactions,
      firmsByInstitutionType,
      firmsByIndustry,
      firmsByCrmStatusRaw,
      firmsByGeographyRaw,
      recentActivityRaw,
      topFirmsByScore,
    ] = await Promise.all([
      // Total counts
      prisma.firm.count({ where: { isActive: true } }),
      prisma.contact.count({ where: { isActive: true, firm: { isActive: true } } }),
      prisma.transaction.count({ where: { firm: { isActive: true } } }),

      // Firms by institution type
      prisma.institutionType.findMany({
        where: { isActive: true },
        select: {
          name: true,
          slug: true,
          color: true,
          _count: { select: { firms: true } },
        },
        orderBy: { displayOrder: 'asc' },
      }),

      // Firms by industry
      prisma.industry.findMany({
        where: { isActive: true, parentId: null },
        select: {
          name: true,
          slug: true,
          color: true,
          _count: { select: { firms: true } },
        },
        orderBy: { displayOrder: 'asc' },
      }),

      // Firms by CRM status
      prisma.firm.groupBy({
        by: ['crmStatus'],
        where: { isActive: true },
        _count: { _all: true },
      }),

      // Firms by geography (top states/countries)
      prisma.firm.groupBy({
        by: ['headquartersCountry', 'headquartersState'],
        where: { isActive: true, headquartersCountry: { not: null } },
        _count: { _all: true },
        orderBy: { _count: { _all: 'desc' } },
        take: 20,
      }),

      // Recent activity
      prisma.activityLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 15,
        include: {
          firm: { select: { name: true } },
        },
      }),

      // Top firms by internal score
      prisma.firm.findMany({
        where: { isActive: true, internalScore: { not: null } },
        include: {
          institutionTypes: { include: { institutionType: true } },
          industries: { include: { industry: true } },
          tags: { include: { tag: true } },
          _count: { select: { contacts: true, transactions: true } },
        },
        orderBy: { internalScore: 'desc' },
        take: 10,
      }),
    ]);

    // Format the response
    const response = {
      totalFirms,
      totalContacts,
      totalTransactions,
      firmsByInstitutionType: firmsByInstitutionType.map((it) => ({
        name: it.name,
        slug: it.slug,
        count: it._count.firms,
        color: it.color,
      })),
      firmsByIndustry: firmsByIndustry.map((ind) => ({
        name: ind.name,
        slug: ind.slug,
        count: ind._count.firms,
        color: ind.color,
      })),
      firmsByCrmStatus: firmsByCrmStatusRaw.map((item) => ({
        status: item.crmStatus,
        count: item._count._all,
      })),
      firmsByGeography: firmsByGeographyRaw.map((item) => ({
        country: item.headquartersCountry || 'Unknown',
        state: item.headquartersState,
        count: item._count._all,
      })),
      recentActivity: recentActivityRaw.map((log) => ({
        id: log.id,
        action: log.action,
        entityType: log.entityType,
        details: log.details,
        createdAt: log.createdAt.toISOString(),
        firmName: log.firm?.name || null,
      })),
      topFirmsByScore: topFirmsByScore.map((firm) => ({
        ...firm,
        aumCents: firm.aumCents?.toString() ?? null,
        totalFundSizeCents: firm.totalFundSizeCents?.toString() ?? null,
        minCheckSizeCents: firm.minCheckSizeCents?.toString() ?? null,
        maxCheckSizeCents: firm.maxCheckSizeCents?.toString() ?? null,
        minRevenueCents: firm.minRevenueCents?.toString() ?? null,
        maxRevenueCents: firm.maxRevenueCents?.toString() ?? null,
        minEbitdaCents: firm.minEbitdaCents?.toString() ?? null,
        maxEbitdaCents: firm.maxEbitdaCents?.toString() ?? null,
        targetEvRangeLowCents: firm.targetEvRangeLowCents?.toString() ?? null,
        targetEvRangeHighCents: firm.targetEvRangeHighCents?.toString() ?? null,
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
