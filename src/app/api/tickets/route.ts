import { NextRequest, NextResponse } from 'next/server';
import { getTickets, clearAllTickets } from '@/lib/tickets';

export async function GET() {
  try {
    const tickets = await getTickets();
    return NextResponse.json({ tickets });
  } catch (error) {
    console.error('Error getting tickets:', error);
    return NextResponse.json({ error: 'Failed to get tickets' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await clearAllTickets();
    return NextResponse.json({ message: 'All tickets cleared' });
  } catch (error) {
    console.error('Error clearing tickets:', error);
    return NextResponse.json({ error: 'Failed to clear tickets' }, { status: 500 });
  }
}