import { Page } from "@playwright/test";
import { test as base, expect } from "./fixture";
import { PostPage } from "../pages/post.page";
import { PostAPI, PostData } from "../api/post";

type PostPageWithData = PostPage & { postList: PostData[] };

type PostFixtures = {
  postCount: number;
  createPostPage: PostPageWithData;
  deletePostPage: PostPageWithData;
};

const setupPostPage = async (
  page: Page,
  postApi: PostAPI,
  prefix: string,
  count: number,
  use: (fixture: PostPageWithData) => Promise<void>
) => {
  const postPage = new PostPage(page);

  // Create posts
  const postList: PostData[] = [];
  for (let i = 0; i < count; i++) {
    const post = await postApi.create({
      title: `${prefix}_${i}`,
      description: `${prefix} description ${i}`,
      active: true,
    });
    postList.push(post);
  }

  await postPage.goto();

  const pageWithData = Object.assign(postPage, { postList });
  await use(pageWithData);

  // Cleanup posts
  for (const post of postList) {
    await postApi.safeDelete(post.id);
  }
};

export const postsTest = base.extend<PostFixtures>({
  postCount: 1,

  createPostPage: async ({ page, postApi, postCount }, use) => {
    await setupPostPage(page, postApi, "create", postCount, use);
  },

  deletePostPage: async ({ page, postApi, postCount }, use) => {
    await setupPostPage(page, postApi, "delete", postCount, use);
  },
});

export { expect };
