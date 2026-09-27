'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { SearchBar } from '@/components/search/SearchBar';
import { SignalLabel } from '@/components/ui/SignalLabel';
import { Card } from '@/components/ui/Card';
import { useT } from '@/components/i18n/LocaleProvider';
import type { SignalLabelType } from '@/types';

type RecentGame = {
	slug: string;
	title: string;
	coverUrl: string | null;
	sourceCount: number;
	signalLabel: SignalLabelType;
};

type ConcernSource = {
	gameSourceId: string;
	domain: string;
	sourceType: string;
	signal: { signalLabel: SignalLabelType; volumeCount: number };
};

export function HomeContent({
	recentGames,
	concernSources,
}: {
	recentGames: RecentGame[];
	concernSources: ConcernSource[];
}) {
	const t = useT();

	return (
		<div className="mx-auto max-w-page px-6 py-10">
			<section className="max-w-2xl">
				<p className="text-xs font-semibold uppercase tracking-wide text-accent-light">{t('home.eyebrow')}</p>
				<h1 className="mt-2 text-4xl font-bold leading-tight text-text-primary">
					{t('home.titleLine1')}
					<br />
					<span className="text-accent-light">{t('home.titleLine2')}</span>
				</h1>
				<p className="mt-4 text-text-secondary">{t('home.subtitle')}</p>

				<div className="mt-6">
					<Suspense fallback={<div className="h-14" />}>
						<SearchBar />
					</Suspense>
				</div>
				<p className="mt-2 text-xs text-text-secondary">{t('home.disclaimerNote')}</p>
			</section>

			<section className="mt-12">
				<div className="mb-3 flex items-center justify-between">
					<div>
						<p className="text-xs font-semibold uppercase tracking-wide text-accent-light">
							{t('home.discoverEyebrow')}
						</p>
						<h2 className="text-xl font-semibold text-text-primary">{t('home.recentActivity')}</h2>
					</div>
					<Link
						href="/search"
						className="text-sm font-medium text-accent-light transition-colors duration-200 hover:text-white"
					>
						{t('home.viewAll')}
					</Link>
				</div>

				{recentGames.length === 0 ? (
					<Card className="text-center text-sm text-text-secondary">{t('home.noRecentGames')}</Card>
				) : (
					<div className="grid gap-4 sm:grid-cols-3">
						{recentGames.map((game) => (
							<Link
								key={game.slug}
								href={`/games/${game.slug}`}
								className="group relative aspect-[4/5] overflow-hidden rounded-card bg-elevated transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_0_24px_-6px_rgba(139,127,247,0.75)]"
							>
								{game.coverUrl && (
									<Image
										src={game.coverUrl}
										alt=""
										fill
										sizes="(max-width: 640px) 100vw, 33vw"
										className="object-cover transition-transform duration-300 group-hover:scale-110"
									/>
								)}
								<div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent transition-opacity duration-300 group-hover:via-background/10" />
								<div className="absolute inset-x-0 bottom-0 p-4">
									<SignalLabel label={game.signalLabel} />
									<p className="mt-2 font-semibold text-text-primary transition-colors duration-200 group-hover:text-accent-light">
										{game.title}
									</p>
									<p className="text-xs text-text-secondary">
										{t(
											game.sourceCount === 1
												? 'home.sourcesDiscussedSingular'
												: 'home.sourcesDiscussedPlural',
											{ count: game.sourceCount },
										)}
									</p>
								</div>
							</Link>
						))}
					</div>
				)}
			</section>

			<section className="mt-12">
				<p className="text-xs font-semibold uppercase tracking-wide text-accent-light">
					{t('home.worthCloserLook')}
				</p>
				<h2 className="mb-3 text-xl font-semibold text-text-primary">{t('home.sourcesWithConcerns')}</h2>

				{concernSources.length === 0 ? (
					<Card className="text-center text-sm text-text-secondary">{t('home.noConcernSources')}</Card>
				) : (
					<div className="grid gap-4 sm:grid-cols-2">
						{concernSources.map((row) => (
							<Link
								key={row.gameSourceId}
								href={`/sources/${row.gameSourceId}`}
								className="group block rounded-card border border-border bg-surface p-5 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_0_20px_-6px_rgba(139,127,247,0.6)] active:translate-y-0 active:scale-[0.99]"
							>
								<div className="flex items-center justify-between">
									<p className="font-semibold text-accent-light">{row.domain}</p>
									<ArrowRightIcon
										className="h-4 w-4 text-text-secondary transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent-light"
										aria-hidden="true"
									/>
								</div>
								<p className="text-xs text-text-secondary">
									{row.sourceType === 'reseller' ? t('home.reseller') : t('home.thirdParty')}
								</p>
								<p className="mt-2 text-sm text-text-secondary">
									{row.signal.signalLabel === 'mixed_reports'
										? t('home.mixedReportsDescription')
										: t('home.unexpectedBehaviorDescription')}
								</p>
								<div className="mt-3 flex items-center justify-between">
									<SignalLabel label={row.signal.signalLabel} />
									<span className="text-xs text-text-secondary">
										{t('home.reportsCount', { count: row.signal.volumeCount })}
									</span>
								</div>
							</Link>
						))}
					</div>
				)}
			</section>

			<section className="mt-12 flex items-center justify-between border-t border-border pt-6">
				<div>
					<p className="text-sm font-medium text-text-primary">{t('home.everyReportAdds')}</p>
					<p className="text-sm text-text-secondary">{t('home.yourExperienceHelps')}</p>
				</div>
				<Link
					href="/report"
					aria-label={t('home.shareYourExperienceAria')}
					className="text-accent-light transition-all duration-200 hover:translate-x-1 hover:text-white"
				>
					<ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
				</Link>
			</section>
		</div>
	);
}
