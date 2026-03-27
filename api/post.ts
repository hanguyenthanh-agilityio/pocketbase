import { APIRequestContext, APIResponse } from "@playwright/test";
import { ApiResponse, CreatePostInput, PostData } from "../types/post";

export class PostAPI {
  constructor(
    private request: APIRequestContext,
    private token: string
  ) {}

  private headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  private async parse<T>(res: APIResponse): Promise<ApiResponse<T>> {
    let data: T;

    try {
      data = (await res.json()) as T;
    } catch {
      data = {} as T;
    }

    return {
      status: res.status(),
      data,
    };
  }

  async create(input: CreatePostInput): Promise<ApiResponse<PostData>> {
    const res = await this.request.post("/api/collections/posts/records", {
      headers: this.headers(),
      data: input,
    });

    return this.parse<PostData>(res);
  }

  async update(id: string, input: Partial<CreatePostInput>): Promise<ApiResponse<PostData>> {
    const res = await this.request.patch(`/api/collections/posts/records/${id}`, {
      headers: this.headers(),
      data: input,
    });

    return this.parse<PostData>(res);
  }

  async delete(id: string): Promise<ApiResponse<null>> {
    const res = await this.request.delete(`/api/collections/posts/records/${id}`, {
      headers: this.headers(),
    });

    return {
      status: res.status(),
      data: null,
    };
  }

  async safeDelete(id: string, retries = 3): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        await this.delete(id);
        return;
      } catch {
        if (i === retries - 1) throw new Error("Delete failed");
        await new Promise((r) => setTimeout(r, 500));
      }
    }
  }

  async list(filter?: string): Promise<ApiResponse<PostData[]>> {
    const url = filter
      ? `/api/collections/posts/records?filter=${encodeURIComponent(filter)}`
      : "/api/collections/posts/records";

    const res = await this.request.get(url, {
      headers: this.headers(),
    });

    const json = (await res.json()) as { items: PostData[] };

    return {
      status: res.status(),
      data: json.items,
    };
  }

  async getById(id: string): Promise<ApiResponse<PostData>> {
    const res = await this.request.get(`/api/collections/posts/records/${id}`, {
      headers: this.headers(),
    });

    return this.parse<PostData>(res);
  }
}
