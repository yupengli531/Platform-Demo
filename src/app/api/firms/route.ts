import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/firms - List firms with full filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const search = searchParams.get('search') || '';
    const institutionTypes = searchParams.get('institutionTypes')?.split(',').filter(Boolean) || [];
    const industries = searchParams.get('industries')?.split(',').filter(Boolean) || [];
    const states = searchParams.get('states')?.split(',').filter(Boolean) || [];
    const countries = searchParams.get('countries')?.split(',').filter(Boolean) || [];
    const crmStatuses = searchParams.get('crmStatuses')?.split(',').filter(Boolean) || [];
    const priorities = searchParams.get('priorities')?.split(',').filter(Boolean) || [];
    const stagePreferences = searchParams.get('stagePreferences')?.split(',').filter(Boolean) || [];
    const dealTypePreferences = searchParams.get('dealTypePreferences')?.split(',').filter(Boolean) || [];
    const minAum = searchParams.get('minAum') ? BigInt(Number(searchParams.get('minAum')) * 100) : undefined;
    const maxAum = searchParams.get('maxAum') ? BigInt(Number(searchParams.get('maxAum')) * 100) : undefined;
    const minCheckSize = searchParams.get('minCheckSize') ? BigInt(Number(searchParams.get('minCheckSize')) * 100) : undefined;
    const maxCheckSize = searchParams.get('maxCheckSize') ? BigInt(Number(searchParams.get('maxCheckSize')) * 100) : undefined;
    const minScore = searchParams.get('minScore') ? parseInt(searchParams.get('minScore')!) : undefined;
    const maxScore = searchParams.get('maxScore') ? parseInt(searchParams.get('maxScore')!) : undefined;
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '24')));

    // Build WHERE clause
    const where: Record<string, unknown> = {
      isActive: true,
    };

    // Full-text search across name and description
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { headquartersCity: { contains: search, mode: 'insensitive' } },
        { headquartersState: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by institution types
    if (institutionTypes.length > 0) {
      where.institutionTypes = {
        some: {
          institutionType: {
            slug: { in: institutionTypes },
          },
        },
      };
    }

    // Filter by industries
    if (industries.length > 0) {
      where.industries = {
        some: {
          industry: {
            slug: { in: industries },
          },
        },
      };
    }

    // Geography filters
    if (states.length > 0) {
      where.headquartersState = { in: states };
    }
    if (countries.length > 0) {
      where.headquartersCountry = { in: countries };
    }

    // CRM status filter
    if (crmStatuses.length > 0) {
      where.crmStatus = { in: crmStatuses };
    }

    // Priority filter
    if (priorities.length > 0) {
      where.priority = { in: priorities };
    }

    // Stage preferences (array overlap)
    if (stagePreferences.length > 0) {
      where.stagePreferences = { hasSome: stagePreferences };
    }

    // Deal type preferences (array overlap)
    if (dealTypePreferences.length > 0) {
      where.dealTypePreferences = { hasSome: dealTypePreferences };
    }

    // AUM range
    if (minAum !== undefined) {
      where.aumCents = { ...(where.aumCents as object || {}), gte: minAum };
    }
    if (maxAum !== undefined) {
      where.aumCents = { ...(where.aumCents as object || {}), lte: maxAum };
    }

    // Check size range
    if (minCheckSize !== undefined) {
      where.minCheckSizeCents = { ...(where.minCheckSizeCents as object || {}), gte: minCheckSize };
    }
    if (maxCheckSize !== undefined) {
      where.maxCheckSizeCents = { ...(where.maxCheckSizeCents as object || {}), lte: maxCheckSize };
    }

    // Internal score range
    if (minScore !== undefined) {
      where.internalScore = { ...(where.internalScore as object || {}), gte: minScore };
    }
    if (maxScore !== undefined) {
      where.internalScore = { ...(where.internalScore as object || {}), lte: maxScore };
    }

    // Tags filter
    if (tags.length > 0) {
      where.tags = {
        some: {
          tag: {
            slug: { in: tags },
          },
        },
      };
    }

    // Build ORDER BY
    const validSortFields: Record<string, string> = {
      name: 'name',
      aum: 'aumCents',
      score: 'internalScore',
      updated: 'updatedAt',
      created: 'createdAt',
      founded: 'yearFounded',
      checkSize: 'minCheckSizeCents',
    };
    const orderByField = validSortFields[sortBy] || 'name';
    const orderBy = { [orderByField]: sortOrder };

    // Execute queries in parallel
    const [firms, total] = await Promise.all([
      prisma.firm.findMany({
        where,
        include: {
          institutionTypes: {
            include: { institutionType: true },
          },
          industries: {
            include: { industry: true },
          },
          tags: {
            include: { tag: true },
          },
          _count: {
            select: {
              contacts: true,
              transactions: true,
            },
          },
        },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.firm.count({ where }),
    ]);

    // Serialize BigInt values for JSON response
    const serializedFirms = firms.map((firm) => ({
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
    }));

    return NextResponse.json({
      data: serializedFirms,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasMore: page * pageSize < total,
      },
    });
  } catch (error) {
    console.error('Error fetching firms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch firms' },
      { status: 500 }
    );
  }
}

// POST /api/firms - Create a new firm
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { error: 'Firm name is required' },
        { status: 400 }
      );
    }

    // Convert dollar amounts to cents for storage
    const centsFields = [
      'aumCents', 'totalFundSizeCents', 'minCheckSizeCents', 'maxCheckSizeCents',
      'minRevenueCents', 'maxRevenueCents', 'minEbitdaCents', 'maxEbitdaCents',
      'targetEvRangeLowCents', 'targetEvRangeHighCents',
    ];

    const firmData: Record<string, unknown> = { ...body };

    // Remove relation data from main create
    const { institutionTypeIds, industryIds, tagIds, ...createData } = firmData;

    // Handle BigInt fields
    for (const field of centsFields) {
      if (createData[field] !== undefined && createData[field] !== null) {
        createData[field] = BigInt(createData[field] as string | number);
      }
    }

    const firm = await prisma.firm.create({
      data: createData as Parameters<typeof prisma.firm.create>[0]['data'],
    });

    // Create institution type associations
    if (Array.isArray(institutionTypeIds) && institutionTypeIds.length > 0) {
      await prisma.firmInstitutionType.createMany({
        data: institutionTypeIds.map((id: string, index: number) => ({
          firmId: firm.id,
          institutionTypeId: id,
          isPrimary: index === 0,
        })),
      });
    }

    // Create industry associations
    if (Array.isArray(industryIds) && industryIds.length > 0) {
      await prisma.firmIndustry.createMany({
        data: industryIds.map((id: string, index: number) => ({
          firmId: firm.id,
          industryId: id,
          isPrimary: index === 0,
        })),
      });
    }

    // Create tag associations
    if (Array.isArray(tagIds) && tagIds.length > 0) {
      await prisma.firmTag.createMany({
        data: tagIds.map((id: string) => ({
          firmId: firm.id,
          tagId: id,
        })),
      });
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        firmId: firm.id,
        action: 'CREATED',
        entityType: 'firm',
        entityId: firm.id,
        details: `Created firm: ${firm.name}`,
      },
    });

    // Fetch complete firm with relations
    const completeFirm = await prisma.firm.findUnique({
      where: { id: firm.id },
      include: {
        institutionTypes: { include: { institutionType: true } },
        industries: { include: { industry: true } },
        tags: { include: { tag: true } },
      },
    });

    return NextResponse.json(completeFirm, { status: 201 });
  } catch (error) {
    console.error('Error creating firm:', error);
    return NextResponse.json(
      { error: 'Failed to create firm' },
      { status: 500 }
    );
  }
}
