import { getModerationQueue } from "@/lib/admin/queries";
import { AdminQueueList } from "@/components/admin/AdminQueueList";

export default async function AdminQueuePage() {
  const { reports } = await getModerationQueue(1);

  const serialized = reports.map((report) => ({
    ...report,
    createdAt: report.createdAt ? report.createdAt.toISOString() : new Date().toISOString(),
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Moderation queue</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Reports awaiting review, ordered by anomaly flag, then severity, then oldest first.
      </p>

      <div className="mt-6">
        <AdminQueueList initialReports={serialized} />
      </div>
    </div>
  );
}
