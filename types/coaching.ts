export type CoachingListItem = {
  id: string;
  code: string;
  coachingName: string;
  mobile: string;
  address: string;
  ownerName: string;
  logo: string | null;
  logoPublicId: string | null;
  logoResourceType: string | null;
  idProof: string | null;
  idProofPublicId: string | null;
  idProofResourceType: string | null;
  idNumber: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  totalUsers: number;
  email: string | null;
  userId: string | null;
  userIsActive: boolean;
};

export type GetCoachingsResult =
  | {
      success: true;
      data: CoachingListItem[];
    }
  | {
      success: false;
      error: string;
    };
