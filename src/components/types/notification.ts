export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  referenceId: number | null;
  referenceType: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationResponse {
  success: boolean;
  data: NotificationItem[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}