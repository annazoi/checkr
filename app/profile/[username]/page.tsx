import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProfileByUsername } from "@/lib/profiles/queries";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { BadgeGrid } from "@/components/profile/BadgeGrid";
import { ContributionHistory } from "@/components/profile/ContributionHistory";
import { Disclaimer } from "@/components/ui/Disclaimer";

type PageProps = { params: { username: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return { title: `${params.username} — Checkr` };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const session = await auth();
  const profile = await getProfileByUsername(params.username, session?.user?.id);
  if (!profile) notFound();

  const badgeCount = profile.badges.filter((b) => b.earned).length;

  return (
    <div className="mx-auto max-w-lg px-6 py-8">
      <ProfileHeader
        username={profile.user.username}
        levelName={profile.user.levelName}
        reportCount={profile.user.reportCount}
        helpfulCount={profile.user.helpfulCount}
        badgeCount={badgeCount}
        isOwnProfile={profile.isOwnProfile}
      />

      <div className="mt-8">
        <BadgeGrid badges={profile.badges} />
      </div>

      <div className="mt-8">
        <ContributionHistory history={profile.history} />
      </div>

      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  );
}
