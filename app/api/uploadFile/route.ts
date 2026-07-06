import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/lib/constans";

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

const badRequest = (message: string) =>
  NextResponse.json(
    {
      success: false,
      message,
    },
    {
      status: 400,
    },
  );

async function uploadToCloudinary(
  file: File,
  folder: string,
): Promise<CloudinaryUploadResult> {
  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
          overwrite: false,
          unique_filename: true,
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Cloudinary upload failed"));

            return;
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        },
      )
      .end(buffer);
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const folder = formData.get("folder")?.toString().trim();

    if (!(file instanceof File)) {
      return badRequest("File is required");
    }

    if (!folder) {
      return badRequest("Folder is required");
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return badRequest(
        `Image size must be less than ${MAX_IMAGE_SIZE / 1024 / 1024} MB`,
      );
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return badRequest("Only JPG, JPEG, PNG and WEBP images are allowed");
    }

    const sanitizedFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, "");
    const result = await uploadToCloudinary(file, sanitizedFolder);

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("[CLOUDINARY_UPLOAD_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to upload image",
      },
      {
        status: 500,
      },
    );
  }
}
