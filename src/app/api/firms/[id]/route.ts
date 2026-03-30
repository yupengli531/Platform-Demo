import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/firms/[id] - Get full firm profile
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const firm = await prisma.firm.findUnique({
      where: { id: params.id, isActive: true },
      include: {
        institutionTypes: {
          include: { institutionType: true },
          orderBy: { isPrimary: 'desc' },
        },
        industries: {
          include: { industry: true },
          orderBy: { isPrimary: 'desc' },
        },
        firmSubSectors: {
          include: { subSector: { include: { industry: true } } },
        },
        contacts: {
          where: { isActive: true },
          orderBy: [{ isPrimaryContact: 'desc' }, { lastName: 'asc' }],
        },
        transactions: {
          orderBy: { closedDate: 'desc' },
          take: 50,
        },
        tags: {
          include: { tag: true },
        },
        sourceLinks: {
          orderBy: { createdAt: 'desc' },
        },
        activityLogs: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        _count: {
          select: {
            contacts: true,
            transactions: true,
            tags: true,
            sourceLinks: true,
          },
        },
      },
    });

    if (!firm) {
      return NextResponse.json(
        { error: 'Firm not found' },
        { status: 404 }
      );
    }

    // Serialize BigInt values
    const serialized = {
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
      transactions: firm.transactions.map((t) => ({
        ...t,
        dealSizeCents: t.dealSizeCents?.toString() ?? null,
        investmentCents: t.investmentCents?.toString() ?? null,
      })),
    };

    // Log view activity
    await prisma.activityLog.create({
      data: {
        firmId: firm.id,
        action: 'VIEWED',
        entityType: 'firm',
        entityId: firm.id,
        details: `Viewed firm profile: ${firm.name}`,
      },
    });

    return NextResponse.json(serialized);
  } catch (error) {
    console.error('Error fetching firm:', error);
    return NextResponse.json(
      { error: 'Failed to fetch firm' },
      { status: 500 }
    );
  }
}

// PATCH /api/firms/[id] - Update firm
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { institutionTypeIds, industryIds, tagIds, ...updateData } = body;

    // Handle BigInt fields
    const centsFields = [
      'aumCents', 'totalFundSizeCents', 'minCheckSizeCents', 'maxCheckSizeCents',
      'minRevenueCents', 'maxRevenueCents', 'minEbitdaCents', 'maxEbitdaCents',
      'targetEvRangeLowCents', 'targetEvRangeHighCents',
    ];
    for (const field of centsFields) {
      if (updateData[field] !== undefined && updateData[field] !== null) {
        updateData[field] = BigInt(updateData[field]);
      }
    }

    const firm = await prisma.firm.update({
      where: { id: params.id },
      data: updateData,
    });

    // Update institution type associations if provided
    if (Array.isArray(institutionTypeIds)) {
      await prisma.firmInstitutionType.deleteMany({ where: { firmId: params.id } });
      if (institutionTypeIds.length > 0) {
        await prisma.firmInstitutionType.createMany({
          data: institutionTypeIds.map((id: string, index: number) => ({
            firmId: params.id,
            institutionTypeId: id,
            isPrimary: index === 0,
          })),
        });
      }
    }

    // Update industry associations if provided
    if (Array.isArray(industryIds)) {
      await prisma.firmIndustry.deleteMany({ where: { firmId: params.id } });
      if (industryIds.length > 0) {
        await prisma.firmIndustry.createMany({
          data: industryIds.map((id: string, index: number) => ({
            firmId: params.id,
            industryId: id,
            isPrimary: index === 0,
          })),
        });
      }
    }

    // Update tag associations if provided
    if (Array.isArray(tagIds)) {
      await prisma.firmTag.deleteMany({ where: { firmId: params.id } });
      if (tagIds.length > 0) {
        await prisma.firmTag.createMany({
          data: tagIds.map((id: string) => ({
            firmId: params.id,
            tagId: id,
          })),
        });
      }
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        firmId: firm.id,
        action: 'UPDATED',
        entityType: 'firm',
        entityId: firm.id,
        details: `Updated firm: ${firm.name}`,
        metadata: { updatedFields: Object.keys(body) },
      },
    });

    return NextResponse.json(firm);
  } catch (error) {
    console.error('Error updating firm:', error);
    return NextResponse.json(
      { error: 'Failed to update firm' },
      { status: 500 }
    );
  }
}

// DELETE /api/firms/[id] - Soft delete firm
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const firm = await prisma.firm.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    await prisma.activityLog.create({
      data: {
        firmId: firm.id,
        action: 'DELETED',
        entityType: 'firm',
        entityId: firm.id,
        details: `Soft-deleted firm: ${firm.name}`,
      },
    });

    return NextResponse.json({ message: 'Firm deleted successfully' });
  } catch (error) {
    console.error('Error deleting firm:', error);
    return NextResponse.json(
      { error: 'Failed to delete firm' },
      { status: 500 }
    );
  }
}
