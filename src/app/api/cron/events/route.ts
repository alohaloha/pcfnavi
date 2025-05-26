import { NextResponse } from 'next/server';
import { run } from '@/scripts/fetchAndUpsertEvents';

export async function GET() {
    try {
        console.log('Starting event data sync...');
        await run();
        console.log('Event data sync completed successfully');
        
        return NextResponse.json({ 
            success: true, 
            message: 'Events fetched and upserted successfully' 
        });
    } catch (error) {
        console.error('Error syncing event data:', error);
        
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to sync event data',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}