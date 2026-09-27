const en: {
  nav: Record<"discover" | "exploreGames" | "shareExperience" | "yourProfile" | "login" | "home" | "search" | "report" | "profile" | "language", string>;
  notifications: Record<"label" | "title" | "empty", string>;
  settings: Record<
    | "title"
    | "subtitle"
    | "changePassword"
    | "currentPassword"
    | "newPassword"
    | "confirmNewPassword"
    | "saving"
    | "updatePassword"
    | "sessions"
    | "sessionsDescription"
    | "loggingOut"
    | "logoutEverywhere"
    | "passwordUpdated"
    | "somethingWentWrong",
    string
  >;
  profile: Record<
    "communityProfile" | "settingsAria" | "reports" | "helpful" | "badges" | "contributionHistory" | "noReportsYet",
    string
  >;
  badges: Record<
    "first_report" | "evidence_provider" | "trusted_signal" | "detail_master" | "consistent_contributor" | "community_veteran",
    { label: string; description: string }
  >;
  reportTypes: Record<
    | "no_issue"
    | "suspicious"
    | "malware"
    | "suspicious_installer"
    | "fake_content"
    | "dangerous_redirect"
    | "unexpected_software"
    | "antivirus_warning"
    | "other",
    string
  >;
  disclaimer: { text: string };
  relativeTime: {
    justNow: string;
  } & Record<"seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years", { singular: string; plural: string }>;
} = {
  nav: {
    discover: "Discover",
    exploreGames: "Explore games",
    shareExperience: "Share experience",
    yourProfile: "Your profile",
    login: "Log in",
    home: "Home",
    search: "Search",
    report: "Report",
    profile: "Profile",
    language: "Language",
  },
  notifications: {
    label: "Notifications",
    title: "Notifications",
    empty: "No notifications yet.",
  },
  settings: {
    title: "Settings",
    subtitle: "Manage your account security.",
    changePassword: "Change password",
    currentPassword: "Current password",
    newPassword: "New password",
    confirmNewPassword: "Confirm new password",
    saving: "Saving…",
    updatePassword: "Update password",
    sessions: "Sessions",
    sessionsDescription: "Log out of Checkr on every device where you're currently signed in.",
    loggingOut: "Logging out…",
    logoutEverywhere: "Log out everywhere",
    passwordUpdated: "Password updated.",
    somethingWentWrong: "Something went wrong.",
  },
  profile: {
    communityProfile: "Community profile",
    settingsAria: "Settings",
    reports: "Reports",
    helpful: "Helpful",
    badges: "Badges",
    contributionHistory: "Contribution history",
    noReportsYet: "No reports shared yet.",
  },
  badges: {
    first_report: { label: "First report", description: "Submitted your first report." },
    evidence_provider: { label: "Evidence provider", description: "Included evidence in a report." },
    trusted_signal: { label: "Trusted signal", description: "10+ reports marked helpful." },
    detail_master: { label: "Detail master", description: "25+ reports with a description." },
    consistent_contributor: { label: "Consistent contributor", description: "Active contributor over time." },
    community_veteran: { label: "Community veteran", description: "A year+ on Checkr with 10+ reports." },
  },
  reportTypes: {
    no_issue: "No issues encountered",
    suspicious: "Suspicious behavior",
    malware: "Malware",
    suspicious_installer: "Unexpected installer",
    fake_content: "Misleading details",
    dangerous_redirect: "Dangerous redirect",
    unexpected_software: "Unexpected download",
    antivirus_warning: "Security warning",
    other: "Something else",
  },
  disclaimer: {
    text: "Community reports reflect user experiences, not security audits. They are signals, not guarantees. Always use antivirus software.",
  },
  relativeTime: {
    justNow: "just now",
    seconds: { singular: "{count} second ago", plural: "{count} seconds ago" },
    minutes: { singular: "{count} minute ago", plural: "{count} minutes ago" },
    hours: { singular: "{count} hour ago", plural: "{count} hours ago" },
    days: { singular: "{count} day ago", plural: "{count} days ago" },
    weeks: { singular: "{count} week ago", plural: "{count} weeks ago" },
    months: { singular: "{count} month ago", plural: "{count} months ago" },
    years: { singular: "{count} year ago", plural: "{count} years ago" },
  },
};

export type Dictionary = typeof en;

export default en;
