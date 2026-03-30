import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/export - Export firm data as CSV
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Re-use the same filter logic from /api/firms
    const search = searchParams.get('search') || '';
    const institutionTypes = searchParams.get('institutionTypes')?.split(',').filter(Boolean) || [];
    const industries = searchParams.get('industries')?.split(',').filter(Boolean) || [];
    const states = searchParams.get('states')?.split(',').filter(Boolean) || [];
    const countries = searchParams.get('countries')?.split(',').filter(Boolean) || [];
    const crmStatuses = searchParams.get('crmStatuses')?.split(',').filter(Boolean) || [];

    const where: Record<string, unknown> = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (institutionTypes.length > 0) {
      where.institutionTypes = { some: { institutionType: { slug: { in: institutionTypes } } } };
    }
    if (industries.length > 0) {
      where.industries = { some: { industry: { slug: { in: industries } } } };
    }
    if (states.length > 0) where.headquartersState = { in: states };
    if (countries.length > 0) where.headquartersCountry = { in: countries };
    if (crmStatuses.length > 0) where.crmStatus = { in: crmStatuses };

    const firms = await prisma.firm.findMany({
      where,
      include: {
        institutionTypes: { include: { institutionType: true } },
        industries: { include: { industry: true } },
        contacts: {
          where: { isActive: true, isPrimaryContact: true },
          take: 1,
        },
        _count: { select: { transactions: true, contacts: true } },
      },
      orderBy: { name: 'asc' },
      take: 10000, // Safety limit
    });

    // CSV headers
    const headers = [
      'Firm Name',
      'Legal Name',
      'Institution Types',
      'Industries',
      'City',
      'State',
      'Country',
      'Region',
      'Website',
      'AUM ($)',
      'Min Check Size ($)',
      'Max Check Size ($)',
      'Stage Preferences',
      'Deal Type Preferences',
      'Geographic Focus',
      'Year Founded',
      'Employees',
      'Partners',
      'Active Portfolio Size',
      'Total Deals Completed',
      'CRM Status',
      'Internal Score',
      'Priority',
      'Relationship Owner',
      'Primary Contact Name',
      'Primary Contact Title',
      'Primary Contact Email',
      'Primary Contact Phone',
      'Total Contacts',
      'Total Transactions',
      'Data Confidence',
      'Data Source',
      'Description',
    ];

    // CSV rows
    const rows = firms.map((firm) => {
      const primaryContact = firm.contacts[0];
      const toCents = (v: bigint | null) => v ? (Number(v) / 100).toString() : '';

      return [
        firm.name,
        firm.legalName || '',
        firm.institutionTypes.map((t) => t.institutionType.name).join('; '),
        firm.industries.map((i) => i.industry.name).join('; '),
        firm.headquartersCity || '',
        firm.headquartersState || '',
        firm.headquartersCountry || '',
        firm.headquartersRegion || '',
        firm.website || '',
        toCents(firm.aumCents),
        toCents(firm.minCheckSizeCents),
        toCents(firm.maxCheckSizeCents),
        firm.stagePreferences.join('; '),
        firm.dealTypePreferences.join('; '),
        firm.geographicFocus.join('; '),
        firm.yearFounded?.toString() || '',
        firm.numberOfEmployees?.toString() || '',
        firm.numberOfPartners?.toString() || '',
        firm.activePortfolioSize?.toString() || '',
        firm.totalDealsCompleted?.toString() || '',
        firm.crmStatus,
        firm.internalScore?.toString() || '',
        firm.priority,
        firm.relationshipOwner || '',
        primaryContact ? `${primaryContact.firstName} ${primaryContact.lastName}` : '',
        primaryContact?.title || '',
        primaryContact?.email || '',
        primaryContact?.phone || '',
        firm._count.contacts.toString(),
        firm._count.transactions.toString(),
        firm.dataConfidence,
        firm.dataSource || '',
        (firm.description || '').replace(/"/g, '""').replace(/\n/g, ' '),
      ];
    });

    // Build CSV string
    const escapeCSV = (val: string) => {
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    const csv = [
      headers.map(escapeCSV).join(','),
      ...rows.map((row) => row.map(escapeCSV).join(',')),
    ].join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="mpv-capital-intelligence-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
