import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectMongo from '~/lib/mongodb';
import User from '~/models/User';
import { mailOptions, transporter } from '~/lib/nodemailer';

export async function POST(req: NextRequest) {
   try {
      await connectMongo();
      const { email } = await req.json();

      const user = await User.findOne({ email });
      if (!user) {
         return NextResponse.json(
            { error: 'Email does not exist.' },
            { status: 404 }
         );
      }

      const verificationCode = Math.floor(1000 + Math.random() * 9000);
      const hashedVerificationCode = await bcrypt.hash(
         verificationCode.toString(),
         10
      );

      user.verificationHash = hashedVerificationCode;
      await user.save();

      await transporter.sendMail({
         ...mailOptions,
         to: email,
         subject: 'Your Password Reset Code',
         html: `
 <table
  style="
    background-color: #5d1ec2;
    font-family: Arial, sans-serif;
    border-radius: 10px;
    max-width: 400px;
    margin: 10px auto;
    padding: 50px 30px;
  "
>
  <tr>
    <td align="center" style="padding: 0px">
      <img
        src="https://res.cloudinary.com/dycw73vuy/image/upload/v1729863759/Logo_1_apiq75.png"
        style="width: 200px"
      />
    </td>
  </tr>
  <tr>
    <td
      style="
        border-top: 1px solid #ffffff;
        padding: 50px 15px;
        box-sizing: border-box;
        color: #ffffff;
      "
    >
      <p style="margin: 0; padding-bottom: 10px">Trouble signing in?</p>
      <p
        style="
          font-size: 14px;
          font-weight: 300;
          line-height: 20px;
          margin: 0 0 20px 0;
        "
      >
        Resetting your password is easy.
        <br />
        Just copy the verification code below and follow the instructions. We’ll
        have you up and running in no time.
      </p>
    </td>
  </tr>
  <tr>
    <td align="center" style="padding: 10px 0">
      <p style="font-size: 40px; color: #ffffff; font-weight: bold; margin: 0">
        ${verificationCode}
      </p>
    </td>
  </tr>
  <tr>
    <td align="start" style="padding-top: 20px">
      <p style="font-size: 14px; color: #ffffff; margin: 0">© Clam. 2024</p>
    </td>
  </tr>
</table>
      `,
      });

      return NextResponse.json(
         {
            message: 'Reset email sent, if the email exists.',
            email: email,
         },
         { status: 200 }
      );
   } catch (error) {
      console.error('Error in reset password route:', error);
      return NextResponse.json(
         { error: 'An error occurred.' },
         { status: 500 }
      );
   }
}
