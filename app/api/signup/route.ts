import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';
import { mailOptions, transporter } from '~/lib/nodemailer';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
   try {
      await connectMongo();

      const {
         email,
         password,
         authProvider = 'local',
         oauthId,
         profile,
         firstName,
         name,
      } = await req.json();
      const verificationCode = Math.floor(1000 + Math.random() * 9000);
      const hashedVerificationCode =
         authProvider === 'local'
            ? await bcrypt.hash(verificationCode.toString(), 10)
            : undefined;

      if (authProvider === 'local' && (!email || !password)) {
         return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
         );
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return NextResponse.json(
            {
               error: 'This email is already in use. Try something else.',
            },
            { status: 409 }
         );
      }

      const hashedPassword = password
         ? await bcrypt.hash(password, 10)
         : undefined;

      const newUser = new User({
         email,
         password: hashedPassword,
         name: firstName || name,
         oauthId,
         authProvider,
         profile: profile,
         verificationHash: hashedVerificationCode,
      });

      await newUser.save();

      if (authProvider === 'local') {
         await transporter.sendMail({
            ...mailOptions,
            to: email,
            subject: `Clam email verification`,
            html: `
     <table style=" background-color: #5D1EC2;font-family: Arial, sans-serif; border-radius: 10px; max-width: 400px; margin: 10px auto; padding: 50px 30px; ">
      <tr>
        <td align="center" style="padding: 0px;">
          <img src="https:
        </td>
      </tr>
      <tr>
        <td style="border-top: 1px solid #ffffff; padding: 50px 15px; box-sizing: border-box; color: #ffffff;">
          <p style="margin: 0; padding-bottom: 10px;">Hello ${firstName},</p>
          <p style="font-size: 14px; font-weight: 300; line-height: 20px; margin: 0 0 20px 0;">
            Thanks for signing up with Clam! Before you get started with the  Clam experience, we need you to confirm your email address. Please copy this number below to complete your signup.
          </p>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 10px 0;">
          <p style="font-size: 40px; color: #ffffff; font-weight: bold; margin: 0;">
            ${verificationCode}
          </p>
        </td>
      </tr>
      <tr>
        <td align="start" style="padding-top: 20px;">
          <p style="font-size: 14px; color: #ffffff; margin: 0;">
              © Clam. 2024
          </p>
        </td>
      </tr>
    </table>
        `,
         });
      }

      let token;
      if (authProvider === 'google' && JWT_SECRET) {
         token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
            expiresIn: '1y',
         });
      }
      console.log('token', token);
      return NextResponse.json(
         {
            message:
               authProvider === 'local'
                  ? 'User created successfully. Please verify your email.'
                  : 'Google user created successfully.',
            email: email,
            token: token,
         },
         { status: 201 }
      );
   } catch (error) {
      return NextResponse.json(
         { error: 'An error occurred during sign up' },
         { status: 500 }
      );
   }
}
