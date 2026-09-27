export type AccountStatus = "active" | "suspended" | "banned";

export type SourceType = "official_store" | "reseller" | "third_party" | "unknown";

export type ReportType =
  | "no_issue"
  | "suspicious"
  | "malware"
  | "suspicious_installer"
  | "fake_content"
  | "dangerous_redirect"
  | "unexpected_software"
  | "antivirus_warning"
  | "other";

export type ConfidenceLevel = "low" | "medium" | "high";

export type ReportStatus =
  | "pending"
  | "trusted"
  | "published"
  | "under_review"
  | "removed"
  | "removed_silent"
  | "hidden"
  | "appealed";

export type SignalLabelType =
  | "mostly_clear"
  | "mixed_reports"
  | "concerns_reported"
  | "security_reports"
  | "limited_data"
  | "no_reports";

export type SignalProfile = {
  volume: "limited" | "some" | "substantial" | "high";
  volumeCount: number;
  distribution:
    | "predominantly_positive"
    | "mostly_positive"
    | "divided"
    | "majority_concerns"
    | "strong_concern_pattern";
  noIssuePercent: number;
  concernPercent: number;
  recency: "active" | "recent" | "older" | "historical";
  // ISO 8601 string, not Date: this value is cached in Redis and shipped to
  // the client as JSON, and Date instances don't survive either round-trip.
  lastReportAt: string | null;
  hasEvidence: boolean;
  evidenceCount: number;
  signalLabel: SignalLabelType;
  explanation: string;
  anomalyDetected: boolean;
};

export type Game = {
  id: string;
  slug: string;
  title: string;
  coverUrl: string | null;
  developer: string | null;
  publisher: string | null;
  releaseYear: number | null;
  platforms: string[];
};

export type Source = {
  id: string;
  domain: string;
  sourceType: SourceType;
};
