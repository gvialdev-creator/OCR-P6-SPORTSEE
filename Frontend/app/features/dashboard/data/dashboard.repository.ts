import type { User } from "../../../contexts/AuthContext";
import type { DataSource, MockProfileData } from "../model";
import { fetchApiProfileData } from "./adapters/fromApi";
import { fetchMockProfileData } from "./adapters/fromMock";

export const loadDashboardData = async (
  source: DataSource,
  user: User | null,
  options?: { includeActivity?: boolean }
): Promise<MockProfileData> => {
  if (source === "mock") {
    return fetchMockProfileData();
  }

  return fetchApiProfileData(user, options);
};
