export interface Post {
  id: number;
  title: string;
  content: string;
  eventType: 'ANNOUNCEMENT' | 'EVENT' | 'CELEBRATION';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectedReason: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  author?: {
    id: number;
    name: string;
    avatar: string | null;
  };
}
