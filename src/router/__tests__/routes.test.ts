import { describe, expect, it } from "vitest";

import router, { routeChildren } from "@/router/index";

describe("public routes", () => {
  it("登録なしで使う画面だけを公開する", () => {
    const paths = routeChildren.map((route) => route.path);

    expect(paths).toContain("");
    expect(paths).toContain("about");
    expect(paths).not.toContain("account");
    expect(paths).not.toContain("mypage");
  });

  it.each(["/account", "/mypage"])("旧アカウントURL %s を404として扱う", (path) => {
    expect(router.resolve(path).name).toBe("NotFoundPage");
  });
});
