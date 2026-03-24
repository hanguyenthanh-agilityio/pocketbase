/* eslint-disable @typescript-eslint/no-explicit-any */
export class PostAPI {
  constructor(
    private request: any,
    private token: string
  ) {}

  private headers() {
    return { Authorization: `Bearer ${this.token}` };
  }

  async create(data: any) {
    const res = await this.request.post("/api/collections/posts/records", {
      headers: this.headers(),
      data,
    });
    const body = await res.json();
    return { res, body };
  }

  async delete(id: string) {
    return this.request.delete(`/api/collections/posts/records/${id}`, {
      headers: this.headers(),
    });
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

  async list(filter?: string) {
    const url = filter
      ? `/api/collections/posts/records?filter=${encodeURIComponent(filter)}`
      : "/api/collections/posts/records";
    const res = await this.request.get(url, { headers: this.headers() });
    const body = await res.json();
    return body;
  }
}
