"use server";

import { auth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

type UploadQuestionImageResult =
  | {
      success: true;
      data: {
        secure_url: string;
        width?: number;
        public_id: string;
      };
    }
  | {
      success: false;
      error: string;
    };

export async function uploadQuestionImage(
  formData: FormData,
): Promise<UploadQuestionImageResult> {
  console.log("formData", formData);
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return {
        success: false,
        error: "File is required",
      };
    }

    if (!file.type.startsWith("image/")) {
      return {
        success: false,
        error: "Only image files are allowed",
      };
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return {
        success: false,
        error: "Image must be smaller than 5MB",
      };
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<{
      secure_url: string;
      public_id: string;
      width: number;
      height: number;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `${session?.user?.id}/questions`,
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Upload failed"));

            return;
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
          });
        },
      );

      stream.end(buffer);
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("uploadQuestionImage:", error);

    return {
      success: false,
      error: "Image upload failed",
    };
  }
}
