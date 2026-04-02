export interface User {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
}

export interface Like {
  id: number;
  user_id: number;
  user: User;
}

export interface Reply {
  id: number;
  comment_id: number;
  user_id: number;
  content: string;
  created_at: string;
  user: User;
  likes: Like[];
  likes_count: number;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  user: User;
  likes: Like[];
  likes_count: number;
  replies: Reply[];
  replies_count: number;
}

export interface Post {
  id: number;
  user_id: number;
  content: string;
  image: string | null;
  visibility: 'public' | 'private';
  created_at: string;
  user: User;
  likes: Like[];
  likes_count: number;
  comments: Comment[];
  comments_count: number;
}

export interface FeedResponse {
  data: Post[];
  next_cursor: string | null;
  prev_cursor: string | null;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
