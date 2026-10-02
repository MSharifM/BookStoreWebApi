import { apiClient } from './apiClient';
import type { UserSummaryInfoResponse } from '@/types/user';

export const userService = {
  getSummaryInfo: async () => {
    const { data } = await apiClient.get<UserSummaryInfoResponse>(
      '/userPanel/summary-info',
    );
    return data;
  },
};