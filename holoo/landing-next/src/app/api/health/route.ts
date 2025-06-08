import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'exists' : 'missing');
    
    await connectDB();
    
    console.log('Successfully connected to MongoDB');
    return NextResponse.json({ 
      status: 'healthy',
      message: 'Successfully connected to MongoDB' 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Failed to connect to MongoDB',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 