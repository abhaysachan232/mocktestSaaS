"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/enums";
import bcrypt from "bcrypt";
import {
  createCoachingSchema,
  updateCoachingSchema,
} from "@/schemas/coaching.schema";
import { deleteCloudinaryFile, uploadFile } from "@/actions/upload.actions";



function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getFile(formData: FormData, key: string): File | null {
  const value = formData.get(key);
  if (value instanceof File && value.size > 0) {
    return value;
  }
  return null;
}

/* =========================================================
   CREATE
========================================================= */

export async function createCoaching(formData: FormData) {
  try {
    const session = await auth();

    if (session?.user?.role !== Role.ADMIN) {
      return {
        success: false,
        error: "Only admin can create coaching",
      };
    }

    const rawData = {
      code: getString(formData, "code"),
      coachingName: getString(formData, "coachingName"),
      ownerName: getString(formData, "ownerName"),
      email: getString(formData, "email"),
      password: getString(formData, "password"),
      mobile: getString(formData, "mobile"),
      address: getString(formData, "address"),
      idNumber: getString(formData, "idNumber"),
    };

    const parsed = createCoachingSchema.safeParse(rawData);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues.map((issue) => issue.message).join(", "),
      };
    }

    const data = parsed.data;

    const logoFile = getFile(formData, "logo");

    const idProofFile = getFile(formData, "idProof");

    /* -----------------------------------------
       Duplicate checks
    ----------------------------------------- */

    const existingCode = await prisma.coaching.findUnique({
      where: {
        code: data.code,
      },
    });

    if (existingCode) {
      return {
        success: false,
        error: "Coaching code already exists",
      };
    }

    const existingMobile = await prisma.coaching.findUnique({
      where: {
        mobile: data.mobile,
      },
    });

    if (existingMobile) {
      return {
        success: false,
        error: "Mobile number already exists",
      };
    }

    const existingIdNumber = await prisma.coaching.findUnique({
      where: {
        idNumber: data.idNumber,
      },
    });

    if (existingIdNumber) {
      return {
        success: false,
        error: "ID number already exists",
      };
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      return {
        success: false,
        error: "Email already exists",
      };
    }

    /* -----------------------------------------
       Upload files
    ----------------------------------------- */

    let logoData: {
      secure_url: string;
      public_id: string;
      resource_type: string;
    } | null = null;

    let idProofData: {
      secure_url: string;
      public_id: string;
      resource_type: string;
    } | null = null;

    try {
      if (logoFile) {
        const logoForm = new FormData();

        logoForm.append("file", logoFile);

        const result = await uploadFile(logoForm, {
          folder: "coaching/logos",
          maxSizeMB: 2,
          resourceType: "image",
          allowedTypes: ["image/jpeg", "image/png", "image/webp"],
        });

        if (!result.success) {
          return result;
        }

        logoData = result.data;
      }

      if (idProofFile) {
        const proofForm = new FormData();

        proofForm.append("file", idProofFile);

        const result = await uploadFile(proofForm, {
          folder: "coaching/id-proofs",
          maxSizeMB: 5,
          resourceType: "auto",
          allowedTypes: [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/webp",
          ],
        });

        if (!result.success) {
          if (logoData) {
            await deleteCloudinaryFile(
              logoData.public_id,
              logoData.resource_type,
            );
          }

          return result;
        }

        idProofData = result.data;
      }

      /* -----------------------------------------
         Password
      ----------------------------------------- */

      const hashedPassword = await bcrypt.hash(data.password, 12);

      /* -----------------------------------------
         Transaction
      ----------------------------------------- */

      const coaching = await prisma.$transaction(async (tx) => {
        const coaching = await tx.coaching.create({
          data: {
            code: data.code,
            coachingName: data.coachingName,
            mobile: data.mobile,
            address: data.address,
            ownerName: data.ownerName,
            idNumber: data.idNumber,

            logo: logoData?.secure_url ?? null,

            logoPublicId: logoData?.public_id ?? null,

            logoResourceType: logoData?.resource_type ?? null,

            idProof: idProofData?.secure_url ?? null,

            idProofPublicId: idProofData?.public_id ?? null,

            idProofResourceType: idProofData?.resource_type ?? null,

            isActive: true,
          },
        });

        await tx.user.create({
          data: {
            email: data.email,
            password: hashedPassword,
            role: Role.COACHING,
            isActive: true,
            coachingId: coaching.id,
          },
        });

        return coaching;
      });

      return {
        success: true,
        data: {
          id: coaching.id,
        },
      };
    } catch (error) {
      console.error("createCoaching transaction:", error);

      if (logoData) {
        await deleteCloudinaryFile(logoData.public_id, logoData.resource_type);
      }

      if (idProofData) {
        await deleteCloudinaryFile(
          idProofData.public_id,
          idProofData.resource_type,
        );
      }

      return {
        success: false,
        error: "Failed to create coaching",
      };
    }
  } catch (error) {
    console.error("createCoaching:", error);

    return {
      success: false,
      error: "Something went wrong",
    };
  }
}

/* =========================================================
   GET ALL
========================================================= */

export async function getCoachings() {
  try {
    const session = await auth();

    if (session?.user?.role !== Role.ADMIN) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const coachings = await prisma.coaching.findMany({
      orderBy: {
        createdAt: "desc",
      },

      include: {
        _count: {
          select: {
            users: true,
          },
        },

        users: {
          where: {
            role: Role.COACHING,
          },

          select: {
            id: true,
            email: true,
            isActive: true,
          },

          take: 1,
        },
      },
    });

    const data = coachings.map((coaching) => ({
      id: coaching.id,
      code: coaching.code,
      coachingName: coaching.coachingName,
      mobile: coaching.mobile,
      address: coaching.address,
      ownerName: coaching.ownerName,

      logo: coaching.logo,

      idNumber: coaching.idNumber,

      isActive: coaching.isActive,

      createdAt: coaching.createdAt,

      updatedAt: coaching.updatedAt,

      totalUsers: coaching._count.users,

      email: coaching.users[0]?.email ?? null,

      userIsActive: coaching.users[0]?.isActive ?? false,
    }));

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("getCoachings:", error);

    return {
      success: false,
      error: "Failed to fetch coachings",
    };
  }
}

/* =========================================================
   GET BY ID
========================================================= */

export async function getCoachingById(id: string) {
  try {
    const session = await auth();

    if (session?.user?.role !== Role.ADMIN) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    if (!id) {
      return {
        success: false,
        error: "Coaching ID is required",
      };
    }

    const coaching = await prisma.coaching.findUnique({
      where: {
        id,
      },

      include: {
        users: {
          where: {
            role: Role.COACHING,
          },

          select: {
            id: true,
            email: true,
            isActive: true,
          },

          take: 1,
        },
      },
    });

    if (!coaching) {
      return {
        success: false,
        error: "Coaching not found",
      };
    }

    return {
      success: true,

      data: {
        id: coaching.id,
        code: coaching.code,
        coachingName: coaching.coachingName,
        mobile: coaching.mobile,
        address: coaching.address,
        ownerName: coaching.ownerName,
        idNumber: coaching.idNumber,

        isActive: coaching.isActive,

        logo: coaching.logo,

        logoPublicId: coaching.logoPublicId,

        logoResourceType: coaching.logoResourceType,

        idProof: coaching.idProof,

        idProofPublicId: coaching.idProofPublicId,

        idProofResourceType: coaching.idProofResourceType,

        email: coaching.users[0]?.email ?? "",

        userId: coaching.users[0]?.id ?? null,

        userIsActive: coaching.users[0]?.isActive ?? false,
      },
    };
  } catch (error) {
    console.error("getCoachingById:", error);

    return {
      success: false,
      error: "Failed to fetch coaching",
    };
  }
}

/* =========================================================
   UPDATE
========================================================= */

export async function updateCoaching(formData: FormData) {
  let newLogoData: {
    secure_url: string;
    public_id: string;
    resource_type: string;
  } | null = null;

  let newIdProofData: {
    secure_url: string;
    public_id: string;
    resource_type: string;
  } | null = null;

  try {
    const session = await auth();
    if (session?.user?.role !== Role.ADMIN) {
      return {
        success: false,
        error: "Only admin can update coaching",
      };
    }

    const isActive = formData.get("isActive") === "true";
    const rawData = {
      id: getString(formData, "id"),
      code: getString(formData, "code"),
      coachingName: getString(formData, "coachingName"),
      ownerName: getString(formData, "ownerName"),
      email: getString(formData, "email"),
      password: getString(formData, "password"),
      mobile: getString(formData, "mobile"),
      address: getString(formData, "address"),
      idNumber: getString(formData, "idNumber"),
      isActive,
    };

    const parsed = updateCoachingSchema.safeParse(rawData);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues.map((issue) => issue.message).join(", "),
      };
    }

    const data = parsed.data;

    const existing = await prisma.coaching.findUnique({
      where: {
        id: data.id,
      },

      include: {
        users: {
          where: {
            role: Role.COACHING,
          },

          select: {
            id: true,
            email: true,
          },

          take: 1,
        },
      },
    });

    if (!existing) {
      return {
        success: false,
        error: "Coaching not found",
      };
    }

    /* -----------------------------------------
       Duplicate checks
    ----------------------------------------- */

    const duplicateCode = await prisma.coaching.findFirst({
      where: {
        code: data.code,
        NOT: {
          id: data.id,
        },
      },
    });

    if (duplicateCode) {
      return {
        success: false,
        error: "Coaching code already exists",
      };
    }

    const duplicateMobile = await prisma.coaching.findFirst({
      where: {
        mobile: data.mobile,
        NOT: {
          id: data.id,
        },
      },
    });

    if (duplicateMobile) {
      return {
        success: false,
        error: "Mobile number already exists",
      };
    }

    const duplicateIdNumber = await prisma.coaching.findFirst({
      where: {
        idNumber: data.idNumber,
        NOT: {
          id: data.id,
        },
      },
    });

    if (duplicateIdNumber) {
      return {
        success: false,
        error: "ID number already exists",
      };
    }

    const coachingUser = existing.users[0];

    if (!coachingUser) {
      return {
        success: false,
        error: "Coaching login user not found",
      };
    }

    const duplicateEmail = await prisma.user.findFirst({
      where: {
        email: data.email,

        NOT: {
          id: coachingUser.id,
        },
      },
    });

    if (duplicateEmail) {
      return {
        success: false,
        error: "Email already exists",
      };
    }

    /* -----------------------------------------
       New files
    ----------------------------------------- */

    const logoFile = getFile(formData, "logo");

    const idProofFile = getFile(formData, "idProof");

    if (logoFile) {
      const logoForm = new FormData();

      logoForm.append("file", logoFile);

      const result = await uploadFile(logoForm, {
        folder: "coaching/logos",
        maxSizeMB: 2,
        resourceType: "image",
        allowedTypes: ["image/jpeg", "image/png", "image/webp"],
      });

      if (!result.success) {
        return result;
      }

      newLogoData = result.data;
    }

    if (idProofFile) {
      const proofForm = new FormData();

      proofForm.append("file", idProofFile);

      const result = await uploadFile(proofForm, {
        folder: "coaching/id-proofs",
        maxSizeMB: 5,
        resourceType: "auto",
        allowedTypes: [
          "application/pdf",
          "image/jpeg",
          "image/png",
          "image/webp",
        ],
      });

      if (!result.success) {
        if (newLogoData) {
          await deleteCloudinaryFile(
            newLogoData.public_id,
            newLogoData.resource_type,
          );
        }

        return result;
      }

      newIdProofData = result.data;
    }

    /* -----------------------------------------
       Password
    ----------------------------------------- */

    let hashedPassword: string | undefined;

    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 12);
    }

    /* -----------------------------------------
       Update transaction
    ----------------------------------------- */

    try {
      await prisma.$transaction(async (tx) => {
        await tx.coaching.update({
          where: {
            id: data.id,
          },

          data: {
            code: data.code,

            coachingName: data.coachingName,

            ownerName: data.ownerName,

            mobile: data.mobile,

            address: data.address,

            idNumber: data.idNumber,

            isActive: data.isActive,

            ...(newLogoData
              ? {
                  logo: newLogoData.secure_url,

                  logoPublicId: newLogoData.public_id,

                  logoResourceType: newLogoData.resource_type,
                }
              : {}),

            ...(newIdProofData
              ? {
                  idProof: newIdProofData.secure_url,

                  idProofPublicId: newIdProofData.public_id,

                  idProofResourceType: newIdProofData.resource_type,
                }
              : {}),
          },
        });

        await tx.user.update({
          where: {
            id: coachingUser.id,
          },

          data: {
            email: data.email,

            isActive: data.isActive,

            ...(hashedPassword
              ? {
                  password: hashedPassword,
                }
              : {}),
          },
        });
      });
    } catch (error) {
      console.error("updateCoaching transaction:", error);

      if (newLogoData) {
        await deleteCloudinaryFile(
          newLogoData.public_id,
          newLogoData.resource_type,
        );
      }

      if (newIdProofData) {
        await deleteCloudinaryFile(
          newIdProofData.public_id,
          newIdProofData.resource_type,
        );
      }

      return {
        success: false,
        error: "Failed to update coaching",
      };
    }

    /* -----------------------------------------
       Delete old files AFTER DB success
    ----------------------------------------- */

    if (newLogoData) {
      if (existing.logoPublicId) {
        await deleteCloudinaryFile(
          existing.logoPublicId,
          existing.logoResourceType ?? "image",
        );
      }
    }

    if (newIdProofData) {
      if (existing.idProofPublicId) {
        await deleteCloudinaryFile(
          existing.idProofPublicId,
          existing.idProofResourceType ?? "raw",
        );
      }
    }

    return {
      success: true,
      data: {
        id: data.id,
      },
    };
  } catch (error) {
    console.error("updateCoaching:", error);

    if (newLogoData) {
      await deleteCloudinaryFile(
        newLogoData.public_id,
        newLogoData.resource_type,
      );
    }

    if (newIdProofData) {
      await deleteCloudinaryFile(
        newIdProofData.public_id,
        newIdProofData.resource_type,
      );
    }

    return {
      success: false,
      error: "Something went wrong",
    };
  }
}

/* =========================================================
   SOFT DELETE / DEACTIVATE
========================================================= */

export async function deleteCoaching(id: string) {
  try {
    const session = await auth();

    if (session?.user?.role !== Role.ADMIN) {
      return {
        success: false,
        error: "Only admin can deactivate coaching",
      };
    }

    if (!id) {
      return {
        success: false,
        error: "Coaching ID is required",
      };
    }

    const coaching = await prisma.coaching.findUnique({
      where: {
        id,
      },
    });

    if (!coaching) {
      return {
        success: false,
        error: "Coaching not found",
      };
    }

    await prisma.$transaction(async (tx) => {
      await tx.coaching.update({
        where: {
          id,
        },

        data: {
          isActive: false,
        },
      });

      await tx.user.updateMany({
        where: {
          coachingId: id,
          role: Role.COACHING,
        },

        data: {
          isActive: false,
        },
      });
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("deleteCoaching:", error);

    return {
      success: false,
      error: "Failed to deactivate coaching",
    };
  }
}

