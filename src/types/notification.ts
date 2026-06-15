export interface AdminNotification {
  id: string;
  type: string;
  title: string;
  body?: string;
  resourceType?: string | null;
  resourceId?: string | null;
  readAt?: string | null;
  createdAt: string;
}

export interface NotificationList {
  items: AdminNotification[];
  unreadCount: number;
}
