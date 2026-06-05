import type { User } from "../../../../contexts/AuthContext";
import api from "../../../../services/api";
import type { MockProfileData, RunningDataItem } from "../../model";

type ApiUserInfoResponse = {
  profile: {
    firstName: string;
    lastName: string;
    gender?: string;
    createdAt: string;
    age: number;
    weight: number;
    height: number;
    profilePicture?: string;
  };
  statistics: {
    totalDistance: string;
    totalSessions: number;
    totalDuration: number;
  };
};

const toIsoDate = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

const getActivityRange = (createdAt: string): { startWeek: string; endWeek: string } => {
  const today = new Date();
  const createdDate = new Date(createdAt);

  if (Number.isNaN(createdDate.getTime())) {
    const fallback = new Date(today);
    fallback.setFullYear(today.getFullYear() - 3);
    return {
      startWeek: toIsoDate(fallback),
      endWeek: toIsoDate(today),
    };
  }

  return {
    startWeek: toIsoDate(createdDate),
    endWeek: toIsoDate(today),
  };
};

const normalizeApiData = (
  userInfo: ApiUserInfoResponse,
  runningData: RunningDataItem[],
  user: User | null
): MockProfileData => {
  const userInfos = {
    firstName: userInfo.profile.firstName,
    lastName: userInfo.profile.lastName,
    age: userInfo.profile.age,
    gender: userInfo.profile.gender ?? "non-renseigne",
    profilePicture: userInfo.profile.profilePicture,
    height: userInfo.profile.height,
    weight: userInfo.profile.weight,
    createdAt: userInfo.profile.createdAt,
  };

  

  return {
    id: user ? `api-${user.userId}` : "api-user",
    weeklyGoal: 2,
    apiStats: {
      totalDistanceKm: Number(userInfo.statistics.totalDistance) || 0,
      totalSessions: userInfo.statistics.totalSessions,
      totalDurationMinutes: userInfo.statistics.totalDuration,
    },
    userInfos,
    username: user?.username ?? "api-user",
    password: "",
    runningData,
  };
};

export const fetchApiProfileData = async (
  user: User | null,
  options?: { includeActivity?: boolean }
): Promise<MockProfileData> => {
  const includeActivity = options?.includeActivity ?? true;
  const userInfo = (await api.getUserInfo()) as ApiUserInfoResponse;

  let userActivity: RunningDataItem[] = [];

  if (includeActivity) {
    const { startWeek, endWeek } = getActivityRange(userInfo.profile.createdAt);
    userActivity = (await api.getUserActivity(
      startWeek,
      endWeek
    )) as RunningDataItem[];
  }

  return normalizeApiData(userInfo, userActivity, user);
};
