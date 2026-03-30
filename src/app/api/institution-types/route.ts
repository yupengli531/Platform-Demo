import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/institution-types - List all institution types with firm counts
export async function GET() {
  try {
    const types = await prisma.institutionType.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { firms: true },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json(
      types.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        description: t.description,
        displayOrder: t.displayOrder,
        iconName: t.iconName,
        color: t.color,
        firmCount: t._count.firms,
      }))
    );
  } catch (error) {
    console.error('Error fetching institution types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch institution types' },
      { status: 500 }
    );
  }
}
