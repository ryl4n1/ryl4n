import { NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';

// Email validation schema
const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Rate limiting setup
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5; // 5 requests per hour
const ipRequests = new Map<string, { count: number; timestamp: number }>();

export async function POST(request: Request) {
  try {
    // Get client IP and user agent
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Check rate limit
    const now = Date.now();
    const userRequests = ipRequests.get(ip);
    
    if (userRequests) {
      if (now - userRequests.timestamp > RATE_LIMIT_WINDOW) {
        // Reset if window has passed
        ipRequests.set(ip, { count: 1, timestamp: now });
      } else if (userRequests.count >= MAX_REQUESTS) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      } else {
        // Increment request count
        ipRequests.set(ip, { 
          count: userRequests.count + 1, 
          timestamp: userRequests.timestamp 
        });
      }
    } else {
      // First request from this IP
      ipRequests.set(ip, { count: 1, timestamp: now });
    }

    // Parse and validate request body
    const body = await request.json();
    const { email } = emailSchema.parse(body);

    // Connect to MongoDB
    await connectDB();

    // Check if email already exists
    const existingSubscriber = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existingSubscriber) {
      if (existingSubscriber.status === 'unsubscribed') {
        // Reactivate unsubscribed user
        existingSubscriber.status = 'pending';
        existingSubscriber.lastUpdatedAt = new Date();
        existingSubscriber.metadata = { ip, userAgent };
        await existingSubscriber.save();
        
        return NextResponse.json({ 
          success: true, 
          message: 'Welcome back! Your subscription has been reactivated.' 
        });
      }
      
      return NextResponse.json(
        { error: 'This email is already subscribed.' },
        { status: 400 }
      );
    }

    // Create new subscriber
    await Subscriber.create({
      email: email.toLowerCase(),
      metadata: {
        ip,
        userAgent
      }
    });

    // Clean up old rate limit entries
    for (const [storedIp, data] of ipRequests.entries()) {
      if (now - data.timestamp > RATE_LIMIT_WINDOW) {
        ipRequests.delete(storedIp);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed to beta!' 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
} 