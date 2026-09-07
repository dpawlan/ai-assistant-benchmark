import { NextRequest, NextResponse } from 'next/server';

interface RequestPayload {
  agentName: string;
  agentUrl?: string;
  categories: string[];
  contact?: string;
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const payload: RequestPayload = await request.json();

    if (!payload.agentName || typeof payload.agentName !== 'string') {
      return NextResponse.json(
        { error: 'Agent name is required' },
        { status: 400 }
      );
    }

    const requestEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      agentName: payload.agentName.trim(),
      agentUrl: payload.agentUrl?.trim() || null,
      categories: Array.isArray(payload.categories) ? payload.categories : [],
      contact: payload.contact?.trim() || null,
      notes: payload.notes?.trim() || null,
    };

    console.log('[Request Submission]', JSON.stringify(requestEntry, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Request submitted successfully',
      id: requestEntry.id,
    });
  } catch (error) {
    console.error('[Request Error]', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
