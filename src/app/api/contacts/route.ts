import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/contacts - List contacts with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const firmId = searchParams.get('firmId');
    const search = searchParams.get('search');
    const seniority = searchParams.get('seniority');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '25')));

    const where: Record<string, unknown> = {
      isActive: true,
      firm: { isActive: true },
    };

    if (firmId) where.firmId = firmId;
    if (seniority) where.seniority = seniority;

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        include: {
          firm: { select: { id: true, name: true } },
        },
        orderBy: [{ isPrimaryContact: 'desc' }, { lastName: 'asc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.contact.count({ where }),
    ]);

    return NextResponse.json({
      data: contacts,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasMore: page * pageSize < total,
      },
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

// POST /api/contacts - Create a new contact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.firmId || !body.firstName || !body.lastName) {
      return NextResponse.json(
        { error: 'firmId, firstName, and lastName are required' },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.create({
      data: body,
      include: { firm: { select: { id: true, name: true } } },
    });

    await prisma.activityLog.create({
      data: {
        firmId: body.firmId,
        action: 'CREATED',
        entityType: 'contact',
        entityId: contact.id,
        details: `Added contact: ${contact.firstName} ${contact.lastName}`,
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
  }
}
