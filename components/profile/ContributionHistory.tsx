'use client';

import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { formatRelativeTime } from '@/lib/utils/format-relative-time';
import { useLocale, useT } from '@/components/i18n/LocaleProvider';

type HistoryRow = {
	id: string;
	reportType: string;
	status: string;
	createdAt: Date | string | null;
	gameSourceId: string;
	domain: string;
};

export function ContributionHistory({ history }: { history: HistoryRow[] }) {
	const { dictionary, locale } = useLocale();
	const t = useT();
	const reportTypeLabels: Record<string, string> = dictionary.reportTypes;

	if (history.length === 0) {
		return (
			<div>
				<h2 className="mb-3 text-lg font-semibold text-text-primary">{t('profile.contributionHistory')}</h2>
				<p className="rounded-card border border-border bg-surface p-5 text-center text-sm text-text-secondary">
					{t('profile.noReportsYet')}
				</p>
			</div>
		);
	}

	return (
		<div>
			<h2 className="mb-3 text-lg font-semibold text-text-primary">{t('profile.contributionHistory')}</h2>
			<div className="divide-y divide-border rounded-card border border-border bg-surface">
				{history.map((row) => (
					<Link
						key={row.id}
						href={`/sources/${row.gameSourceId}`}
						className="group flex items-center justify-between gap-3 p-4 transition-colors duration-200 first:rounded-t-card last:rounded-b-card hover:bg-elevated"
					>
						<div className="min-w-0">
							<p className="truncate font-medium text-text-primary transition-colors duration-200 group-hover:text-accent-light">
								{reportTypeLabels[row.reportType] ?? row.reportType}
							</p>
							<p className="truncate text-xs text-text-secondary">
								{row.domain} ·{' '}
								{row.createdAt ? formatRelativeTime(new Date(row.createdAt).toISOString(), locale) : ''}
							</p>
						</div>
						<ChevronRightIcon
							className="h-5 w-5 shrink-0 text-text-secondary transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent-light"
							aria-hidden="true"
						/>
					</Link>
				))}
			</div>
		</div>
	);
}
