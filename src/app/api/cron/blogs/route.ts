import {NextRequest, NextResponse} from 'next/server';
import { run } from '@/scripts/fetchAndUpsertBlogs';

export async function GET(request: NextRequest) {
    try {
        console.log('Starting blog data sync...');
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new Response('Unauthorized', {
                status: 401,
            });
        }

        if (process.env.ENABLE_CRON !== 'true') {
            return NextResponse.json({
                message: `Skipped: current env is '${process.env.VERCEL_ENV}'`,
            });
        }

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