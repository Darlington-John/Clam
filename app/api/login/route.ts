import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    await connectMongo();

    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: `Sorry, we couldn't find an account with that email address.` }, { status: 404 });
    }

    // Check if the password is provided
    if (password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
      }
    } else if (user.authProvider === 'google') {
      // If the user is signing in with Google, allow it without password check
      console.log("User logging in with Google, no password check required.");
    } else {
      // If the user has a different auth provider and didn't provide a password
      return NextResponse.json({ error: 'Password is required for this account.' }, { status: 401 });
    }

    // Generate JWT for the user
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1y' });

    return NextResponse.json({ token });
  } catch (error: any) {
    const errorMessage = error.message || 'An error occurred during login';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
