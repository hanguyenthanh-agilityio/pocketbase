export interface PostData {
  id: string;
  title: string;
  description?: string;
  active?: boolean;
}

export interface CreatePostInput {
  title: string;
  description?: string;
  active?: boolean;
}

export interface ApiResponse<T> {
  status: number;
  data: T;
}
