"use server";

import { users } from "@/db/schema";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { eq } from "drizzle-orm";
import sharp from "sharp";
import { z } from "zod";
import { db } from "@/db";

const s3 = new S3Client({ region: process.env.AWS_REGION });

const uploadProfilePictureSchema = z.object({
  userId: z.string(),
  file: z.instanceof(File),
});

export default async function uploadProfilePicture(formData: FormData) {
  const { userId, file } = uploadProfilePictureSchema.parse(
    Object.fromEntries(formData.entries()),
  );

  let size = await sharp(await file.arrayBuffer())
    .metadata()
    .then(({ width, height }) =>
      Math.min(width || 999999, height || 999999, 512),
    );

  const bigImage = await sharp(await file.arrayBuffer())
    .resize(size, size, { fit: "cover" })
    .jpeg()
    .toBuffer();

  const smallImage = await sharp(await file.arrayBuffer())
    .resize(96, 96, { fit: "cover" })
    .jpeg()
    .toBuffer();

  const bigUpload = new Upload({
    client: s3,
    params: {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `palstreak/profile-pictures/${userId}/big.jpg`,
      Body: bigImage,
    },
  });

  const smallUpload = new Upload({
    client: s3,
    params: {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `palstreak/profile-pictures/${userId}/small.jpg`,
      Body: smallImage,
    },
  });

  const [bigResult, smallResult] = await Promise.allSettled([
    bigUpload.done(),
    smallUpload.done(),
  ]);

  if (bigResult.status === "rejected" || smallResult.status === "rejected") {
    throw new Error("Failed to upload profile picture");
  }

  const bigUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/palstreak/profile-pictures/${userId}/big.jpg`;
  const smallUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/palstreak/profile-pictures/${userId}/small.jpg`;

  await db
    .update(users)
    .set({
      image: `${smallUrl}#${new Date().getTime()}`,
    })
    .where(eq(users.id, userId));

  return { smallUrl };
}
