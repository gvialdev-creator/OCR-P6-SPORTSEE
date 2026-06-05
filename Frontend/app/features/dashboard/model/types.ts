export type Stage = "dashboard" | "profile";
export type DataSource = "mock" | "api";

export type RunningDataItem = {
  date: string;
  distance: number;
  duration: number;
  heartRate: {
    min: number;
    max: number;
    average: number;
  };
  caloriesBurned: number;
};

export type MockProfileData = {
  id: string;
  weeklyGoal: number;
  apiStats?: {
    totalDistanceKm: number;
    totalSessions: number;
    totalDurationMinutes: number;
  };
  userInfos: {
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    profilePicture?: string;
    height: number;
    weight: number;
    createdAt: string;
  };
  username: string;
  password: string;
  runningData: RunningDataItem[];
};

export type StatTileData = {
  label: string;
  value: string;
  unit: string;
};

export type DistancePoint = {
  label: string;
  value: number;
  weekStart: string;
  weekEnd: string;
};

export type HeartRatePoint = {
  label: string;
  min: number;
  max: number;
  avg: number;
};

export type ProfileViewModel = {
  fullName: string;
  memberSinceLabel: string;
  age: number;
  gender: string;
  heightLabel: string;
  weightLabel: string;
  profilePicture: string;
  statTiles: StatTileData[];
};
