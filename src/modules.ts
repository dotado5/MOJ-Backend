import aws from "aws-sdk";

const region = process.env.AWS_REGION;
const bucket_name = process.env.AWS_S3_BUCKET;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// const s3 = new aws.S3({
//   region,
//   accessKeyId,
//   secretAccessKey,
//   signatureVersion: "v4",
// });

// export async function generateUploadUrl() {
//   const imageName = "random";

//   const params = { Bucket: bucket_name, Key: imageName, Expires: 60 };

//   const uploadUrl = await s3.getSignedUrlPromise("putObject", params);

//   return uploadUrl;
// }

import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

// Setup S3 client
const s3 = new S3Client({
  region: region ?? "",
  credentials: {
    accessKeyId: accessKeyId ?? "",
    secretAccessKey: secretAccessKey ?? "",
  },
});

async function uploadImageToS3FromInput(file: File, keyPrefix = "uploads/") {
  const fileName = `${Date.now()}-${file.name}`;
  const key = `${keyPrefix}${fileName}`;

  const upload = new Upload({
    client: s3,
    params: {
      Bucket: bucket_name,
      Key: key,
      Body: file,
      ContentType: file.type,
    },
  });

  upload.on("httpUploadProgress", (progress) => {
    console.log(`Uploaded ${progress.loaded} / ${progress.total}`);
  });

  await upload.done();
  console.log(`✅ Upload successful: s3://${bucket_name}/${key}`);
  return `https://${bucket_name}.s3.amazonaws.com/${key}`;
}
