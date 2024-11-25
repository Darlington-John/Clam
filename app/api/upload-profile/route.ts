import { NextRequest, NextResponse } from 'next/server';
import cloudinary from 'cloudinary';
import connectMongo from '~/lib/mongodb';
import User from '~/models/User';
import jwt from 'jsonwebtoken';

cloudinary.v2.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
   try {
      const formData = await req.formData();
      const file = formData.get('file');
      const userId = formData.get('userId');

      if (!userId) {
         return NextResponse.json(
            { error: 'UserId not fount' },
            { status: 401 }
         );
      }

      if (!file || typeof file === 'string') {
         return NextResponse.json(
            { error: 'No file uploaded or incorrect format' },
            { status: 400 }
         );
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const uploadResult = await new Promise<{ secure_url: string }>(
         (resolve, reject) => {
            const uploadStream = cloudinary.v2.uploader.upload_stream(
               { folder: 'profile_pictures' },
               (error, result) => {
                  if (error) {
                     reject(new Error(error.message || 'Upload failed'));
                  } else {
                     resolve(result as { secure_url: string });
                  }
               }
            );
            uploadStream.end(buffer);
         }
      );

      await connectMongo();
      const user = await User.findByIdAndUpdate(
         userId,
         { profile: uploadResult.secure_url },
         { new: true }
      );

      if (!user) {
         return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({ url: uploadResult.secure_url });
   } catch (error) {
      return NextResponse.json({ error: 'An error occured' }, { status: 500 });
   }
}
