import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/search - Global search across firms, contacts, and transactions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();
    const types = searchParams.get('types')?.split(',') || ['firm', 'contact', 'transaction'];
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [], query: query || '' });
    }

    const results: Array<{
      type: string;
      id: string;
      title: string;
      subtitle: string;
      description: string | null;
      url: string;
      relevance: number;
    }> = [];

    // Search firms
    if (types.includes('firm')) {
      const firms = await prisma.firm.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { legalName: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { headquartersCity: { contains: query, mode: 'insensitive' } },
            { headquartersState: { contains: query, mode: 'insensitive' } },
            { headquartersCountry: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: {
          institutionTypes: { include: { institutionType: true }, take: 3 },
          industries: { include: { industry: true }, take: 3 },
        },
        take: limit,
        orderBy: { name: 'asc' },
      });

      firms.forEach((firm) => {
        const nameMatch = firm.name.toLowerCase().includes(query.toLowerCase());
        const exactMatch = firm.name.toLowerCase() === query.toLowerCase();

        results.push({
          type: 'firm',
          id: firm.id,
          title: firm.name,
          subtitle: [
            firm.institutionTypes.map((t) => t.institutionType.name).join(', '),
            [firm.headquartersCity, firm.headquartersState].filter(Boolean).join(', '),
          ].filter(Boolean).join(' · '),
          description: firm.description?.substring(0, 200) || null,
          url: `/firms/${firm.id}`,
          relevance: exactMatch ? 100 : nameMatch ? 80 : 40,
        });
      });
    }

    // Search contacts
    if (types.includes('contact')) {
      const contacts = await prisma.contact.findMany({
        where: {
          isActive: true,
          firm: { isActive: true },
          OR: [
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { title: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: {
          firm: { select: { id: true, name: true } },
        },
        take: limit,
        orderBy: { lastName: 'asc' },
      });

      contacts.forEach((contact) => {
        const fullName = `${contact.firstName} ${contact.lastName}`;
        const nameMatch = fullName.toLowerCase().includes(query.toLowerCase());

        results.push({
          type: 'contact',
          id: contact.id,
          title: fullName,
          subtitle: [contact.title, contact.firm.name].filter(Boolean).join(' at '),
          description: contact.email || null,
          url: `/firms/${contact.firm.id}?tab=contacts&contact=${contact.id}`,
          relevance: nameMatch ? 70 : 30,
        });
      });
    }

    // Search transactions
    if (types.includes('transaction')) {
      const transactions = await prisma.transaction.findMany({
        where: {
          firm: { isActive: true },
          OR: [
            { transactionName: { contains: query, mode: 'insensitive' } },
            { targetCompany: { contains: query, mode: 'insensitive' } },
            { industry: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: {
          firm: { select: { id: true, name: true } },
        },
        take: limit,
        orderBy: { closedDate: 'desc' },
      });

      transactions.forEach((tx) => {
        const nameMatch = tx.transactionName.toLowerCase().includes(query.toLowerCase());

        results.push({
          type: 'transaction',
          id: tx.id,
          title: tx.transactionName,
          subtitle: [tx.firm.name, tx.transactionType.replace(/_/g, ' ')].join(' · '),
          description: tx.targetCompany ? `Target: ${tx.targetCompany}` : null,
          url: `/firms/${tx.firm.id}?tab=transactions&transaction=${tx.id}`,
          relevance: nameMatch ? 60 : 25,
        });
      });
    }

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);

    return NextResponse.json({
      results: results.slice(0, limit),
      query,
      total: results.length,
    });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
