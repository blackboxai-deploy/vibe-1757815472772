import { NextRequest, NextResponse } from 'next/server';

interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  email: string;
  password: string;
  displayName: string;
}

// In a real application, this would be stored in a database with proper password hashing
// For demo purposes, we'll use a simple in-memory store
let users: User[] = [
  {
    id: 'demo_user_1',
    email: 'demo@example.com',
    displayName: 'Demo User',
    createdAt: new Date().toISOString()
  }
];

let sessions: Record<string, { userId: string; createdAt: string; expiresAt: string }> = {};

// POST - Handle login and signup
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, displayName } = body;

    if (!action || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (action === 'login') {
      return handleLogin(email, password);
    } else if (action === 'signup') {
      if (!displayName || displayName.trim().length === 0) {
        return NextResponse.json(
          { success: false, error: 'Display name is required' },
          { status: 400 }
        );
      }
      return handleSignup(email, password, displayName.trim());
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Use "login" or "signup"' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Check authentication status
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: 'No valid authentication token'
      });
    }

    const token = authHeader.substring(7);
    const session = sessions[token];

    if (!session) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: 'Invalid session token'
      });
    }

    // Check if session is expired
    if (new Date() > new Date(session.expiresAt)) {
      delete sessions[token];
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: 'Session expired'
      });
    }

    const user = users.find(u => u.id === session.userId);
    if (!user) {
      delete sessions[token];
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: 'User not found'
      });
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName
      }
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({
      success: false,
      authenticated: false,
      error: 'Internal server error'
    });
  }
}

// DELETE - Logout
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'No authentication token provided'
      }, { status: 400 });
    }

    const token = authHeader.substring(7);
    delete sessions[token];

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleLogin(email: string, password: string): Promise<NextResponse> {
  // In a real app, you would hash the password and compare with the stored hash
  // For demo purposes, we'll accept any password for existing users
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Invalid email or password' },
      { status: 401 }
    );
  }

  // Create session
  const sessionToken = generateSessionToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

  sessions[sessionToken] = {
    userId: user.id,
    createdAt: new Date().toISOString(),
    expiresAt
  };

  return NextResponse.json({
    success: true,
    message: 'Login successful',
    token: sessionToken,
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName
    }
  });
}

async function handleSignup(email: string, password: string, displayName: string): Promise<NextResponse> {
  // Check if user already exists
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (existingUser) {
    return NextResponse.json(
      { success: false, error: 'User with this email already exists' },
      { status: 409 }
    );
  }

  // Create new user
  const newUser: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email: email.toLowerCase(),
    displayName,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  // Create session
  const sessionToken = generateSessionToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

  sessions[sessionToken] = {
    userId: newUser.id,
    createdAt: new Date().toISOString(),
    expiresAt
  };

  return NextResponse.json({
    success: true,
    message: 'Account created successfully',
    token: sessionToken,
    user: {
      id: newUser.id,
      email: newUser.email,
      displayName: newUser.displayName
    }
  });
}

function generateSessionToken(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Utility function to clean up expired sessions (would be called periodically in a real app)
function cleanupExpiredSessions() {
  const now = new Date();
  Object.keys(sessions).forEach(token => {
    if (new Date(sessions[token].expiresAt) <= now) {
      delete sessions[token];
    }
  });
}

// Clean up expired sessions every hour (in a real app, this would be a background job)
setInterval(cleanupExpiredSessions, 60 * 60 * 1000);