import { test as base } from "./fixture";
import { PostPage } from "../pages/post.page";
import { PostData } from "../types/post";

export type SortPostPageWithData = PostPage & { postList: PostData[] };

export const sortPostsTest = base.extend<{
  sortPostPage: SortPostPageWithData;
}>({
  sortPostPage: async ({ page, postApi }, use) => {
    const postPage = new PostPage(page);
    const prefix = `sort-test-${Date.now()}`; // unique prefix
    const postList: PostData[] = [];

    for (let i = 1; i <= 4; i++) {
      const title = `${prefix} ${i}`;
      const description = `Desc ${i}`;
      const res = await postApi.create({ title, description, active: true });
      postList.push(res.data);
    }

    await postPage.goto();

    await postPage.waitForPostsWithPrefix(prefix);

    await use(Object.assign(postPage, { postList }));

    for (const p of postList) {
      await postApi.safeDelete(p.id);
    }
  },
});
