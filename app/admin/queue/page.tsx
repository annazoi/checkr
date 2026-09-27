import { getModerationQueue } from "@/lib/admin/queries";
import { AdminQueueList } from "@/components/admin/AdminQueueList";
import { AdminQueueHeader } from "@/components/admin/AdminQueueHeader";

export default async function AdminQueuePage() {
  const { reports } = await getModerationQueue(1);

  const serialized = reports.map((report) => ({
    ...report,
    createdAt: report.createdAt ? report.createdAt.toISOString() : new Date().toISOString(),
  }));

  return (
    <div>
      <AdminQueueHeader />

      <div className="mt-6">
        <AdminQueueList initialReports={serialized} />
      </div>
    </div>
  );
}
