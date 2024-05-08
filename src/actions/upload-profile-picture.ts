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

  const imageMetadata = await sharp(await file.arrayBuffer()).metadata();
  const size = Math.min(
    imageMetadata.width || 999999,
    imageMetadata.height || 999999,
    512,
  );

  // check if file is gif
  let bigImage;
  let smallImage;
  let extension;
  if (imageMetadata.format === "gif") {
    bigImage = file;
    smallImage = file;
    bigImage = await sharp(await file.arrayBuffer(), { animated: true })
      .resize(size, size, { fit: "cover" })
      .gif({
        loop: 0,
        delay: imageMetadata.delay,
        effort: 4,
        force: true,
      })
      .toBuffer();
    smallImage = await sharp(await file.arrayBuffer(), { animated: true })
      .resize(96, 96, { fit: "cover" })
      .gif({
        loop: 0,
        delay: imageMetadata.delay,
        effort: 4,
        force: true,
      })
      .toBuffer();

    extension = "webp";
  } else {
    bigImage = await sharp(await file.arrayBuffer())
      .resize(size, size, { fit: "cover" })
      .jpeg()
      .toBuffer();

    smallImage = await sharp(await file.arrayBuffer())
      .resize(96, 96, { fit: "cover" })
      .jpeg()
      .toBuffer();

    extension = "jpg";
  }

  const bigUpload = new Upload({
    client: s3,
    params: {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `palstreak/profile-pictures/${userId}/big.${extension}`,
      Body: bigImage,
    },
  });

  const smallUpload = new Upload({
    client: s3,
    params: {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `palstreak/profile-pictures/${userId}/small.${extension}`,
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

  const bigUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/palstreak/profile-pictures/${userId}/big.${extension}`;
  const smallUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/palstreak/profile-pictures/${userId}/small.${extension}`;

  await db
    .update(users)
    .set({
      image: `${smallUrl}#${new Date().getTime()}`,
    })
    .where(eq(users.id, userId));

  return { smallUrl };
}
