import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/industries - List all industries with firm counts and sub-sectors
export async function GET() {
  try {
    const industries = await prisma.industry.findMany({
      where: { isActive: true, parentId: null },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
        },
        subSectors: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
        _count: {
          select: { firms: true },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json(
      industries.map((ind) => ({
        id: ind.id,
        name: ind.name,
        slug: ind.slug,
        description: ind.description,
        displayOrder: ind.displayOrder,
        iconName: ind.iconName,
        color: ind.color,
        firmCount: ind._count.firms,
        subSectors: ind.subSectors.map((ss) => ({
          id: ss.id,
          name: ss.name,
          slug: ss.slug,
        })),
        children: ind.children.map((child) => ({
          id: child.id,
          name: child.name,
          slug: child.slug,
        })),
      }))
    );
  } catch (error) {
    console.error('Error fetching industries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch industries' },
      { status: 500 }
    );
  }
}
