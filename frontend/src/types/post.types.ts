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

export interface CreatePost {
  title: string;
  content: string;
  eventType: 'ANNOUNCEMENT' | 'EVENT' | 'CELEBRATION';
}

export interface ReviewPost {
  status: 'APPROVED' | 'REJECTED';
  rejectedReason?: string;
}

export interface UpdatePost {
  title?: string;
  content?: string;
  eventType?: 'ANNOUNCEMENT' | 'EVENT' | 'CELEBRATION';
}

