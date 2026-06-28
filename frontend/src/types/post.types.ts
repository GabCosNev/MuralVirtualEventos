export type EventType = "ANNOUNCEMENT" | "EVENT" | "CELEBRATION";
export type PostStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Post {
  id: number;
  title: string;
  content: string;
  eventType: EventType;
  status: PostStatus;
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
  eventType: EventType;
}

export interface ReviewPost {
  status: PostStatus;
  rejectedReason?: string;
}

export interface UpdatePost {
  title?: string;
  content?: string;
  eventType?: EventType;
}
