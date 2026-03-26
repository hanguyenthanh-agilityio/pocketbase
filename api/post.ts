/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIRequestContext } from "@playwright/test";

export interface PostData {
  id: string;
  title: string;
  description?: string;
  active?: boolean;
}

export class PostAPI {
  constructor(
    private request: APIRequestContext,
    private token: string
  ) {}

  private headers() {
    return { Authorization: `Bearer ${this.token}` };
  }

  async create(data: any): Promise<PostData> {
    const res = await this.request.post("/api/collections/posts/records", {
      headers: this.headers(),
      data,
    });
    return await res.json();
  }

  async update(id: string, data: any): Promise<PostData> {
    const res = await this.request.patch(`/api/collections/posts/records/${id}`, {
      headers: this.headers(),
      data,
    });
    return await res.json();
  }

  async delete(id: string) {
    const res = await this.request.delete(`/api/collections/posts/records/${id}`, {
      headers: this.headers(),
    });
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  async safeDelete(id: string, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        await this.delete(id);
        return;
      } catch (e) {
        if (i === retries - 1) throw e;
        await new Promise((r) => setTimeout(r, 500));
      }
    }
  }

  async list(filter?: string): Promise<PostData[]> {
    const url = filter
      ? `/api/collections/posts/records?filter=${encodeURIComponent(filter)}`
      : "/api/collections/posts/records";
    const res = await this.request.get(url, { headers: this.headers() });
    const body = await res.json();
    return body.items as PostData[];
  }

  async getById(id: string): Promise<PostData> {
    const res = await this.request.get(`/api/collections/posts/records/${id}`, {
      headers: this.headers(),
    });
    return await res.json();
  }
}
