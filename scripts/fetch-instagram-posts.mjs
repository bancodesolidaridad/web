import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
const userId = process.env.INSTAGRAM_USER_ID;
const limit = Number.parseInt(process.env.INSTAGRAM_POSTS_LIMIT || "3", 10);
const outputPath = process.env.INSTAGRAM_NEWS_OUTPUT || "assets/data/instagram-posts.json";

if (!accessToken) {
  throw new Error("Missing INSTAGRAM_ACCESS_TOKEN environment variable.");
}

if (!userId) {
  throw new Error("Missing INSTAGRAM_USER_ID environment variable.");
}

if (!Number.isFinite(limit) || limit <= 0) {
  throw new Error("INSTAGRAM_POSTS_LIMIT must be a positive number.");
}

const endpoint = new URL(`https://graph.facebook.com/v23.0/${userId}/media`);
endpoint.searchParams.set(
  "fields",
  "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp"
);
endpoint.searchParams.set("limit", String(limit));
endpoint.searchParams.set("access_token", accessToken);

const response = await fetch(endpoint);

if (!response.ok) {
  const errorBody = await response.text();
  throw new Error(`Instagram request failed (${response.status}): ${errorBody}`);
}

const body = await response.json();
const posts = Array.isArray(body.data) ? body.data : [];

const normalizedPosts = posts
  .map((post) => {
    const caption = typeof post.caption === "string" ? post.caption.trim() : "";
    const firstLine = caption ? caption.split(/\r?\n/)[0].trim() : "";

    return {
      id: typeof post.id === "string" ? post.id : "",
      title: firstLine ? firstLine.slice(0, 90) : "Publicacion en Instagram",
      description: caption ? caption.slice(0, 220) : "Ver publicacion en Instagram.",
      caption,
      mediaType: typeof post.media_type === "string" ? post.media_type : "",
      imageUrl: typeof post.thumbnail_url === "string" && post.thumbnail_url
        ? post.thumbnail_url
        : (typeof post.media_url === "string" ? post.media_url : ""),
      permalink: typeof post.permalink === "string" ? post.permalink : "",
      timestamp: typeof post.timestamp === "string" ? post.timestamp : ""
    };
  })
  .filter((post) => post.id && post.permalink && post.timestamp)
  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  .slice(0, limit);

const payload = {
  source: "instagram-graph-api",
  updatedAt: new Date().toISOString(),
  posts: normalizedPosts
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, JSON.stringify(payload, null, 2) + "\n", "utf8");

console.log(`Saved ${normalizedPosts.length} post(s) to ${outputPath}`);
