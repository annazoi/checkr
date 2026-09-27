import { HomeContent } from "@/components/home/HomeContent";
import { getRecentGames, getSourcesWithConcerns } from "@/lib/home/queries";

export const revalidate = 300;

export default async function HomePage() {
  const [recentGames, concernSources] = await Promise.all([
    getRecentGames(3).catch(() => []),
    getSourcesWithConcerns(2).catch(() => []),
  ]);

  return <HomeContent recentGames={recentGames} concernSources={concernSources} />;
}
