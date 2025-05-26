import { NextResponse } from 'next/server';
import { run } from '@/scripts/fetchAndUpsertBlogs';

export async function GET() {
    try {
        console.log('Starting blog data sync...');
        await run();
        console.log('Blog data sync completed successfully');
        
        return NextResponse.json({ 
            success: true, 
            message: 'Blogs fetched and upserted successfully' 
        });
    } catch (error) {
        console.error('Error syncing blog data:', error);
        
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to sync blog data',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}