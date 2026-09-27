'use client';

import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { SignalBar } from '@/components/ui/SignalBar';
import { SignalLabel } from '@/components/ui/SignalLabel';
import { useLocale, useT } from '@/components/i18n/LocaleProvider';
import type { SignalProfile, SourceType } from '@/types';

type SourceCardProps = {
	gameSourceId: string;
	domain: string;
	sourceType: SourceType;
	signal: SignalProfile;
};

function descriptionKeyFor(signal: SignalProfile) {
	switch (signal.signalLabel) {
		case 'mostly_clear':
			return 'signal.mostlyClearDescription';
		case 'mixed_reports':
			return 'signal.mixedReportsDescription';
		case 'concerns_reported':
		case 'security_reports':
			return 'signal.unexpectedBehaviorDescription';
		default:
			return 'signal.notEnoughReportsDescription';
	}
}

export function SourceCard({ gameSourceId, domain, sourceType, signal }: SourceCardProps) {
	const t = useT();
	const { dictionary } = useLocale();

	return (
		<Link
			href={`/sources/${gameSourceId}`}
			className="group block rounded-card border border-border bg-surface p-5 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_0_20px_-6px_rgba(139,127,247,0.6)] active:translate-y-0 active:scale-[0.99]"
		>
			<div className="flex items-start justify-between gap-4">
				<div>
					<p className="font-semibold text-accent-light transition-colors duration-200">{domain}</p>
					<p className="text-xs text-text-secondary">{dictionary.sources.types[sourceType]}</p>
				</div>
				<ChevronRightIcon
					className="h-5 w-5 shrink-0 text-text-secondary transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent-light"
					aria-hidden="true"
				/>
			</div>
			<p className="mt-3 text-sm text-text-secondary">{t(descriptionKeyFor(signal))}</p>
			<div className="mt-3">
				<SignalBar
					noIssue={signal.noIssuePercent}
					mixed={Math.max(0, 100 - signal.noIssuePercent - signal.concernPercent)}
					concerns={signal.concernPercent}
				/>
			</div>
			<div className="mt-3 flex items-center justify-between">
				<SignalLabel label={signal.signalLabel} />
				<span className="text-xs text-text-secondary">{t('home.reportsCount', { count: signal.volumeCount })}</span>
			</div>
		</Link>
	);
}
