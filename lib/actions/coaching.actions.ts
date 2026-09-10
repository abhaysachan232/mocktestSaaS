"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/enums";
import bcrypt from "bcrypt";
import {
  createCoachingSchema,
  updateCoachingSchema,
} from "@/schemas/coaching.schema";
import { deleteCloudinaryFile, uploadFile } from "@/lib/actions/upload.actions";

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

type UploadData = {
  secure_url: string;
  public_id: string;
  resource_type: string;
};

async function uploadLogo(
  file: File,
): Promise<
  { success: true; data: UploadData } | { success: false; error: string }
> {
  const formData = new FormData();
  formData.append("file", file);

  const result = await uploadFile(formData, {
    folder: "coaching/logos",
    maxSizeMB: 2,
    resourceType: "image",
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error ?? "Failed to upload logo",
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

async function uploadIdProof(
  file: File,
): Promise<
  { success: true; data: UploadData } | { success: false; error: string }
> {
  const formData = new FormData();
  formData.append("file", file);

  const result = await uploadFile(formData, {
    folder: "coaching/id-proofs",
    maxSizeMB: 5,
    resourceType: "auto",
    allowedTypes: ["application/pdf", "image/jpeg", "image/png", "image/webp"],
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error ?? "Failed to upload ID proof",
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

export async function createCoaching(formData: FormData) {
  let logoData: UploadData | null = null;
  let idProofData: UploadData | null = null;

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

    const [existingCode, existingMobile, existingIdNumber, existingUser] =
      await Promise.all([
        prisma.coaching.findUnique({
          where: {
            code: data.code,
          },
          select: {
            id: true,
          },
        }),

        prisma.coaching.findUnique({
          where: {
            mobile: data.mobile,
          },
          select: {
            id: true,
          },
        }),

        prisma.coaching.findUnique({
          where: {
            idNumber: data.idNumber,
          },
          select: {
            id: true,
          },
        }),

        prisma.user.findUnique({
          where: {
            email: data.email,
          },
          select: {
            id: true,
          },
        }),
      ]);

    if (existingCode) {
      return {
        success: false,
        error: "Coaching code already exists",
      };
    }

    if (existingMobile) {
      return {
        success: false,
        error: "Mobile number already exists",
      };
    }

    if (existingIdNumber) {
      return {
        success: false,
        error: "ID number already exists",
      };
    }

    if (existingUser) {
      return {
        success: false,
        error: "Email already exists",
      };
    }

    const logoFile = getFile(formData, "logo");
    const idProofFile = getFile(formData, "idProof");

    if (logoFile) {
      const result = await uploadLogo(logoFile);

      if (!result.success) {
        return result;
      }

      logoData = result.data;
    }

    if (idProofFile) {
      const result = await uploadIdProof(idProofFile);

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

    const hashedPassword = await bcrypt.hash(data.password, 12);

    try {
      const coaching = await prisma.$transaction(async (tx) => {
        const createdCoaching = await tx.coaching.create({
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

        const user = await tx.user.create({
          data: {
            email: data.email,
            password: hashedPassword,
            role: Role.COACHING,
            isActive: true,
          },
        });

        await tx.userCoaching.create({
          data: {
            userId: user.id,
            coachingId: createdCoaching.id,
          },
        });

        return createdCoaching;
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
      error: "Something went wrong",
    };
  }
}

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
            user: {
              role: Role.COACHING,
            },
          },
          select: {
            user: {
              select: {
                id: true,
                email: true,
                isActive: true,
              },
            },
          },
          take: 1,
        },
      },
    });

    const data = coachings.map((coaching) => {
      const coachingUser = coaching.users[0]?.user ?? null;

      return {
        id: coaching.id,
        code: coaching.code,
        coachingName: coaching.coachingName,
        mobile: coaching.mobile,
        address: coaching.address,
        ownerName: coaching.ownerName,
        logo: coaching.logo,
        logoPublicId: coaching.logoPublicId,
        logoResourceType: coaching.logoResourceType,
        idProof: coaching.idProof,
        idProofPublicId: coaching.idProofPublicId,
        idProofResourceType: coaching.idProofResourceType,
        idNumber: coaching.idNumber,
        isActive: coaching.isActive,
        createdAt: coaching.createdAt,
        updatedAt: coaching.updatedAt,
        totalUsers: coaching._count.users,
        email: coachingUser?.email ?? null,
        userId: coachingUser?.id ?? null,
        userIsActive: coachingUser?.isActive ?? false,
      };
    });

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

export async function getCoachingById(id: string) {
  try {
    const session = await auth();

    if (session?.user?.role !== Role.ADMIN) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    if (!id?.trim()) {
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
            user: {
              role: Role.COACHING,
            },
          },
          select: {
            user: {
              select: {
                id: true,
                email: true,
                isActive: true,
              },
            },
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

    const coachingUser = coaching.users[0]?.user ?? null;

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
        email: coachingUser?.email ?? "",
        userId: coachingUser?.id ?? null,
        userIsActive: coachingUser?.isActive ?? false,
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

export async function updateCoaching(formData: FormData) {
  let newLogoData: UploadData | null = null;
  let newIdProofData: UploadData | null = null;

  try {
    const session = await auth();

    if (session?.user?.role !== Role.ADMIN) {
      return {
        success: false,
        error: "Only admin can update coaching",
      };
    }

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
      isActive: formData.get("isActive") === "true",
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
            user: {
              role: Role.COACHING,
            },
          },
          select: {
            user: {
              select: {
                id: true,
                email: true,
                isActive: true,
              },
            },
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

    const coachingUser = existing.users[0]?.user ?? null;

    if (!coachingUser) {
      return {
        success: false,
        error: "Coaching login user not found",
      };
    }

    const [duplicateCode, duplicateMobile, duplicateIdNumber, duplicateEmail] =
      await Promise.all([
        prisma.coaching.findFirst({
          where: {
            code: data.code,
            NOT: {
              id: data.id,
            },
          },
          select: {
            id: true,
          },
        }),

        prisma.coaching.findFirst({
          where: {
            mobile: data.mobile,
            NOT: {
              id: data.id,
            },
          },
          select: {
            id: true,
          },
        }),

        prisma.coaching.findFirst({
          where: {
            idNumber: data.idNumber,
            NOT: {
              id: data.id,
            },
          },
          select: {
            id: true,
          },
        }),

        prisma.user.findFirst({
          where: {
            email: data.email,
            NOT: {
              id: coachingUser.id,
            },
          },
          select: {
            id: true,
          },
        }),
      ]);

    if (duplicateCode) {
      return {
        success: false,
        error: "Coaching code already exists",
      };
    }

    if (duplicateMobile) {
      return {
        success: false,
        error: "Mobile number already exists",
      };
    }

    if (duplicateIdNumber) {
      return {
        success: false,
        error: "ID number already exists",
      };
    }

    if (duplicateEmail) {
      return {
        success: false,
        error: "Email already exists",
      };
    }

    const logoFile = getFile(formData, "logo");
    const idProofFile = getFile(formData, "idProof");

    if (logoFile) {
      const result = await uploadLogo(logoFile);

      if (!result.success) {
        return result;
      }

      newLogoData = result.data;
    }

    if (idProofFile) {
      const result = await uploadIdProof(idProofFile);

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

    let hashedPassword: string | undefined;

    if (data.password?.trim()) {
      hashedPassword = await bcrypt.hash(data.password, 12);
    }

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

    if (newLogoData && existing.logoPublicId) {
      await deleteCloudinaryFile(
        existing.logoPublicId,
        existing.logoResourceType ?? "image",
      );
    }

    if (newIdProofData && existing.idProofPublicId) {
      await deleteCloudinaryFile(
        existing.idProofPublicId,
        existing.idProofResourceType ?? "raw",
      );
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

export async function deleteCoaching(id: string) {
  try {
    const session = await auth();

    if (session?.user?.role !== Role.ADMIN) {
      return {
        success: false,
        error: "Only admin can deactivate coaching",
      };
    }

    if (!id?.trim()) {
      return {
        success: false,
        error: "Coaching ID is required",
      };
    }

    const coaching = await prisma.coaching.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        isActive: true,
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

      const memberships = await tx.userCoaching.findMany({
        where: {
          coachingId: id,
          user: {
            role: Role.COACHING,
          },
        },
        select: {
          userId: true,
        },
      });

      const userIds = memberships.map((membership) => membership.userId);

      if (userIds.length > 0) {
        await tx.user.updateMany({
          where: {
            id: {
              in: userIds,
            },
            role: Role.COACHING,
          },
          data: {
            isActive: false,
          },
        });
      }
    });

    return {
      success: true,
      data: {
        id,
      },
    };
  } catch (error) {
    console.error("deleteCoaching:", error);

    return {
      success: false,
      error: "Failed to deactivate coaching",
    };
  }
}

export async function activateCoaching(id: string) {
  try {
    const session = await auth();

    if (session?.user?.role !== Role.ADMIN) {
      return {
        success: false,
        error: "Only admin can activate coaching",
      };
    }

    if (!id?.trim()) {
      return {
        success: false,
        error: "Coaching ID is required",
      };
    }

    const coaching = await prisma.coaching.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
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
          isActive: true,
        },
      });

      const memberships = await tx.userCoaching.findMany({
        where: {
          coachingId: id,
          user: {
            role: Role.COACHING,
          },
        },
        select: {
          userId: true,
        },
      });

      const userIds = memberships.map((membership) => membership.userId);

      if (userIds.length > 0) {
        await tx.user.updateMany({
          where: {
            id: {
              in: userIds,
            },
            role: Role.COACHING,
          },
          data: {
            isActive: true,
          },
        });
      }
    });

    return {
      success: true,
      data: {
        id,
      },
    };
  } catch (error) {
    console.error("activateCoaching:", error);

    return {
      success: false,
      error: "Failed to activate coaching",
    };
  }
}

export async function joinCoachingByCode(code: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    if (session.user.role !== Role.STUDENT) {
      return {
        success: false,
        error: "Only students can join a coaching",
      };
    }

    const normalizedCode = code?.trim();

    if (!normalizedCode) {
      return {
        success: false,
        error: "Coaching code is required",
      };
    }

    const coaching = await prisma.coaching.findUnique({
      where: {
        code: normalizedCode,
      },
      select: {
        id: true,
        code: true,
        coachingName: true,
        logo: true,
        address: true,
        ownerName: true,
        isActive: true,
      },
    });

    if (!coaching) {
      return {
        success: false,
        error: "Invalid coaching code",
      };
    }

    if (!coaching.isActive) {
      return {
        success: false,
        error: "This coaching is currently inactive",
      };
    }

    const student = await prisma.student.findUnique({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!student) {
      return {
        success: false,
        error: "Student profile not found",
      };
    }

    const existingMembership = await prisma.userCoaching.findUnique({
      where: {
        userId_coachingId: {
          userId: session.user.id,
          coachingId: coaching.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingMembership) {
      return {
        success: false,
        error: "You have already joined this coaching",
      };
    }

    const membership = await prisma.userCoaching.create({
      data: {
        userId: session.user.id,
        coachingId: coaching.id,
      },
      select: {
        id: true,
        createdAt: true,
        coaching: {
          select: {
            id: true,
            code: true,
            coachingName: true,
            logo: true,
            address: true,
            ownerName: true,
            isActive: true,
          },
        },
      },
    });

    return {
      success: true,
      message: "Successfully joined coaching",
      data: {
        membershipId: membership.id,
        joinedAt: membership.createdAt,
        coaching: membership.coaching,
      },
    };
  } catch (error) {
    console.error("joinCoachingByCode:", error);

    return {
      success: false,
      error: "Failed to join coaching",
    };
  }
}
