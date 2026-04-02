import type { AuthResponse, Comment, FeedResponse, Post, Reply } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function setToken(token: string): void {
  document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function clearToken(): void {
  document.cookie = 'auth_token=; path=/; max-age=0';
}

async function request<T>(
  method: string,
  endpoint: string,
  body?: Record<string, unknown> | FormData,
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const isFormData = body instanceof FormData;
  if (!isFormData && body) {
    headers['Content-Type'] = 'application/json';
  }
  headers['Accept'] = 'application/json';

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as T;
}

// Auth
export const register = (payload: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}) => request<AuthResponse>('POST', '/register', payload as unknown as Record<string, unknown>);

export const login = (payload: { email: string; password: string }) =>
  request<AuthResponse>('POST', '/login', payload as Record<string, unknown>);

export const logout = () => request<{ message: string }>('POST', '/logout');

export const getMe = () => request<{ user: AuthResponse['user'] }>('GET', '/me');

// Posts
export const getFeed = (cursor?: string) =>
  request<FeedResponse>('GET', `/posts${cursor ? `?cursor=${cursor}` : ''}`);

export const createPost = (formData: FormData) =>
  request<{ message: string; post: Post }>('POST', '/posts', formData);

export const deletePost = (postId: number) =>
  request<{ message: string }>('DELETE', `/posts/${postId}`);

// Comments
export const getComments = (postId: number) =>
  request<{ comments: Comment[] }>('GET', `/posts/${postId}/comments`);

export const addComment = (postId: number, content: string) =>
  request<{ message: string; comment: Comment }>('POST', `/posts/${postId}/comments`, { content });

export const deleteComment = (commentId: number) =>
  request<{ message: string }>('DELETE', `/comments/${commentId}`);

// Replies
export const addReply = (commentId: number, content: string) =>
  request<{ message: string; reply: Reply }>('POST', `/comments/${commentId}/replies`, { content });

// Likes
export const togglePostLike = (postId: number) =>
  request<{ liked: boolean; likes_count: number }>('POST', `/posts/${postId}/like`);

export const toggleCommentLike = (commentId: number) =>
  request<{ liked: boolean; likes_count: number }>('POST', `/comments/${commentId}/like`);

export const toggleReplyLike = (replyId: number) =>
  request<{ liked: boolean; likes_count: number }>('POST', `/replies/${replyId}/like`);
