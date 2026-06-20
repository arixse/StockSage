import { PageHeader } from "@/components/shared/PageHeader";
import { RedditBuzzClient } from "./RedditBuzzClient";

export default function RedditBuzzPage() {
  return (
    <div>
      <PageHeader
        title="Reddit Buzz"
        description="Track which stocks are being discussed on Reddit trading communities. See mention counts and trending posts."
      />
      <RedditBuzzClient />
    </div>
  );
}
