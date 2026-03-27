import { test as base } from "./fixture";
import { PostSearchPage } from "../pages/post-search.page";
import { PostData } from "../types/post";

type PostSearchPageWithData = PostSearchPage & { postList: PostData[] };

export const postsSearchTest = base.extend<{
  searchPostPage: PostSearchPageWithData;
  postCount: number;
}>({
  postCount: 5,
  searchPostPage: async ({ page, postApi, postCount }, use) => {
    const pageObj = new PostSearchPage(page);

    // Create posts for search
    const postList: PostData[] = [];
    for (let i = 0; i < postCount; i++) {
      const post = await postApi.create({
        title: `search_${Date.now()}_${i}`,
        description: `search description ${i}`,
        active: true,
      });
      postList.push(post.data);
    }

    await pageObj.goto();

    await use(Object.assign(pageObj, { postList }));

    // Cleanup posts
    for (const post of postList) {
      await postApi.safeDelete(post.id);
    }
  },
});
