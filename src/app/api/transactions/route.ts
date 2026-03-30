import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/transactions - List transactions with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const firmId = searchParams.get('firmId');
    const type = searchParams.get('type');
    const industry = searchParams.get('industry');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '25')));

    const where: Record<string, unknown> = {
      firm: { isActive: true },
    };

    if (firmId) where.firmId = firmId;
    if (type) where.transactionType = type;
    if (industry) where.industry = { contains: industry, mode: 'insensitive' };
    if (status) where.status = status;

    if (startDate || endDate) {
      where.closedDate = {};
      if (startDate) (where.closedDate as Record<string, unknown>).gte = new Date(startDate);
      if (endDate) (where.closedDate as Record<string, unknown>).lte = new Date(endDate);
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          firm: { select: { id: true, name: true } },
        },
        orderBy: { closedDate: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.transaction.count({ where }),
    ]);

    const serialized = transactions.map((t) => ({
      ...t,
      dealSizeCents: t.dealSizeCents?.toString() ?? null,
      investmentCents: t.investmentCents?.toString() ?? null,
    }));

    return NextResponse.json({
      data: serialized,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasMore: page * pageSize < total,
      },
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

// POST /api/transactions - Create a new transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.firmId || !body.transactionName || !body.transactionType) {
      return NextResponse.json(
        { error: 'firmId, transactionName, and transactionType are required' },
        { status: 400 }
      );
    }

    // Handle BigInt fields
    if (body.dealSizeCents) body.dealSizeCents = BigInt(body.dealSizeCents);
    if (body.investmentCents) body.investmentCents = BigInt(body.investmentCents);

    // Handle date fields
    if (body.announcedDate) body.announcedDate = new Date(body.announcedDate);
    if (body.closedDate) body.closedDate = new Date(body.closedDate);

    const transaction = await prisma.transaction.create({
      data: body,
      include: { firm: { select: { id: true, name: true } } },
    });

    await prisma.activityLog.create({
      data: {
        firmId: body.firmId,
        action: 'CREATED',
        entityType: 'transaction',
        entityId: transaction.id,
        details: `Added transaction: ${transaction.transactionName}`,
      },
    });

    return NextResponse.json(
      {
        ...transaction,
        dealSizeCents: transaction.dealSizeCents?.toString() ?? null,
        investmentCents: transaction.investmentCents?.toString() ?? null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
