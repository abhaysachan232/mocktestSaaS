"use server";

import { auth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export type UploadFileOptions = {
  folder?: string;
  maxSizeMB?: number;
  allowedTypes?: string[];
  resourceType?: "image" | "raw" | "auto";
};

export type UploadFileResult =
  | {
      success: true;
      data: {
        secure_url: string;
        public_id: string;
        resource_type: string;
        width?: number;
        height?: number;
      };
    }
  | {
      success: false;
      error: string;
    };

export async function uploadFile(
  formData: FormData,
  options: UploadFileOptions = {},
): Promise<UploadFileResult> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return {
        success: false,
        error: "File is required",
      };
    }

    const {
      folder = "uploads",
      maxSizeMB = 5,
      allowedTypes,
      resourceType = "auto",
    } = options;

    /*
     * File type validation
     */
    if (allowedTypes && !allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: `Invalid file type. Allowed: ${allowedTypes.join(", ")}`,
      };
    }

    /*
     * Size validation
     */
    const maxSize = maxSizeMB * 1024 * 1024;

    if (file.size > maxSize) {
      return {
        success: false,
        error: `File must be smaller than ${maxSizeMB}MB`,
      };
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<{
      secure_url: string;
      public_id: string;
      resource_type: string;
      width?: number;
      height?: number;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Upload failed"));

            return;
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            resource_type: result.resource_type,
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
    console.error("uploadFile:", error);

    return {
      success: false,
      error: "File upload failed",
    };
  }
}

export async function deleteCloudinaryFile(
  publicId: string,
  resourceType: string | undefined,
) {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType === "raw" ? "raw" : "image",
    });
  } catch (error) {
    console.error("deleteCloudinaryFile:", error);
  }
}
