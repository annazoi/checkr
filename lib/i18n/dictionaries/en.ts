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
  common: Record<
    | "loading"
    | "cancel"
    | "close"
    | "back"
    | "next"
    | "or"
    | "viewAll"
    | "loadMore"
    | "searching"
    | "uploading"
    | "submitting"
    | "pleaseWait"
    | "remove"
    | "searchPlaceholder"
    | "closeDialog",
    string
  >;
  home: Record<
    | "eyebrow"
    | "titleLine1"
    | "titleLine2"
    | "subtitle"
    | "disclaimerNote"
    | "discoverEyebrow"
    | "recentActivity"
    | "viewAll"
    | "noRecentGames"
    | "sourcesDiscussedSingular"
    | "sourcesDiscussedPlural"
    | "worthCloserLook"
    | "sourcesWithConcerns"
    | "noConcernSources"
    | "reseller"
    | "thirdParty"
    | "mixedReportsDescription"
    | "unexpectedBehaviorDescription"
    | "reportsCount"
    | "everyReportAdds"
    | "yourExperienceHelps"
    | "shareYourExperienceAria",
    string
  >;
  search: Record<"backToHome" | "noGamesFound" | "searchUnavailable" | "gamesFoundCount" | "all", string>;
  games: Record<
    | "sourcesDiscussed"
    | "addSource"
    | "noSourcesYet"
    | "reportYourExperience"
    | "logInToReport"
    | "atAGlance"
    | "communityOverview"
    | "communityOverviewDescription"
    | "withConcernsCount"
    | "backToSearchAria"
    | "gameNotFoundTitle"
    | "gameNotFoundDescription",
    string
  >;
  sources: Record<
    | "backToGame"
    | "sourceProfile"
    | "sourceProfileDescription"
    | "fromCommunity"
    | "playerExperiences"
    | "sourceNotFoundTitle"
    | "noReportsMatchFilter",
    string
  > & {
    types: Record<"official_store" | "reseller" | "third_party" | "unknown", string>;
  };
  signal: Record<
    | "communitySignal"
    | "reportsSharedByPlayers"
    | "overallTone"
    | "recentActivityLabel"
    | "reportDetail"
    | "withEvidence"
    | "noEvidence"
    | "whyAmISeeingThis"
    | "anomalyWarning"
    | "noIssuesLabel"
    | "concernsLabel"
    | "mixedPercent"
    | "mostlyClearDescription"
    | "mixedReportsDescription"
    | "unexpectedBehaviorDescription"
    | "notEnoughReportsDescription",
    string
  > & {
    distribution: Record<"predominantly_positive" | "mostly_positive" | "divided" | "majority_concerns" | "strong_concern_pattern", string>;
    recency: Record<"active" | "recent" | "older" | "historical", string>;
    label: Record<"mostly_clear" | "mixed_reports" | "concerns_reported" | "security_reports" | "limited_data" | "no_reports", string>;
  };
  report: Record<
    | "shareAnExperience"
    | "whichGame"
    | "findGameFirst"
    | "noGamesFound"
    | "whatHappened"
    | "chooseClosest"
    | "whichSource"
    | "enterSiteOrStore"
    | "websiteOrStore"
    | "domainPlaceholder"
    | "dontIncludePasswords"
    | "tellUsMore"
    | "onlyShareWhatYouExperienced"
    | "yourExperience"
    | "whatDidYouNotice"
    | "dontIncludeNames"
    | "attachScreenshot"
    | "dontIncludePersonalInfo"
    | "chooseScreenshot"
    | "removeScreenshot"
    | "onlyImagesSupported"
    | "imageTooLarge"
    | "uploadFailed"
    | "stepOf"
    | "submitReport"
    | "couldntSaveSource"
    | "genericError"
    | "backAria",
    string
  > & {
    categories: Record<
      "no_issue" | "suspicious" | "antivirus_warning" | "unexpected_software" | "malware" | "suspicious_installer" | "dangerous_redirect" | "fake_content" | "other",
      string
    >;
  };
  reportSuccess: Record<"reportSubmitted" | "thanksForSharing" | "pendingReviewMessage" | "backToSource" | "searchAnotherGame", string>;
  auth: Record<
    | "welcomeBack"
    | "logInToCheckr"
    | "newHere"
    | "createAccount"
    | "email"
    | "password"
    | "emailPlaceholder"
    | "passwordPlaceholder"
    | "loggingIn"
    | "logIn"
    | "invalidCredentials"
    | "joinCommunity"
    | "createYourAccount"
    | "createAccountSubtitle"
    | "alreadyHaveAccount"
    | "username"
    | "usernamePlaceholder"
    | "passwordHintPlaceholder"
    | "ageConfirm"
    | "creatingAccount"
    | "continueWithDiscord"
    | "genericError",
    string
  >;
  admin: Record<
    | "checkrAdmin"
    | "signOut"
    | "moderationQueue"
    | "moderationQueueDescription"
    | "queueEmpty"
    | "submittedBy"
    | "noDescriptionProvided"
    | "reason"
    | "internalNotesOptional"
    | "whyIsThisAction"
    | "confirm"
    | "submitting"
    | "actionFailed"
    | "reportActionTitle"
    | "reportActionToast"
    | "anomalyFlagged"
    | "trustLevel",
    string
  > & {
    actions: Record<"approve" | "reject" | "hide" | "escalate", string>;
    actionsPast: Record<"approve" | "reject" | "hide" | "escalate", string>;
    trust: Record<"contributor" | "trustedReporter" | "expertContributor" | "communityGuardian", string>;
  };
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
  common: {
    loading: "Loading…",
    cancel: "Cancel",
    close: "Close",
    back: "Back",
    next: "Next",
    or: "or",
    viewAll: "View all →",
    loadMore: "Load more →",
    searching: "Searching…",
    uploading: "Uploading…",
    submitting: "Submitting…",
    pleaseWait: "Please wait…",
    remove: "Remove",
    searchPlaceholder: "Search for a game…",
    closeDialog: "Close dialog",
  },
  home: {
    eyebrow: "Community-powered game intelligence",
    titleLine1: "Know the source.",
    titleLine2: "Play with perspective.",
    subtitle:
      "See what other players have experienced with third-party stores, resellers, and download sites around your games.",
    disclaimerNote:
      "Community reports reflect personal experiences, not security audits or guarantees. Always use your own judgment.",
    discoverEyebrow: "Discover",
    recentActivity: "Recent community activity",
    viewAll: "View all →",
    noRecentGames:
      "No games have community reports yet. Search for a game and be the first to share your experience.",
    sourcesDiscussedSingular: "{count} source discussed",
    sourcesDiscussedPlural: "{count} sources discussed",
    worthCloserLook: "Worth a closer look",
    sourcesWithConcerns: "Sources with recent concerns",
    noConcernSources: "No sources have raised recent concerns.",
    reseller: "Reseller",
    thirdParty: "Third-party",
    mixedReportsDescription: "Experiences vary across recent community reports.",
    unexpectedBehaviorDescription: "Several contributors described unexpected behavior.",
    reportsCount: "{count} reports",
    everyReportAdds: "Every report adds context.",
    yourExperienceHelps: "Your experience could help another player decide what to look into.",
    shareYourExperienceAria: "Share your experience",
  },
  search: {
    backToHome: "Back to home",
    noGamesFound: "No games found. Try a different search.",
    searchUnavailable: "Search is temporarily unavailable. Try again shortly.",
    gamesFoundCount: "{count} games found",
    all: "All",
  },
  games: {
    sourcesDiscussed: "Sources discussed",
    addSource: "+ Add a source",
    noSourcesYet: "No sources have been discussed for this game yet. Be the first to share your experience.",
    reportYourExperience: "Report your experience",
    logInToReport: "Log in to report",
    atAGlance: "At a glance",
    communityOverview: "Community overview",
    communityOverviewDescription: "A range of experiences shared by players.",
    withConcernsCount: "{count} with concerns",
    backToSearchAria: "Back to search",
    gameNotFoundTitle: "Game not found — Checkr",
    gameNotFoundDescription: "Community-reported safety signals for third-party stores and resellers.",
  },
  sources: {
    backToGame: "Back to game",
    sourceProfile: "Source profile",
    sourceProfileDescription: "A snapshot of what players have shared about this source.",
    fromCommunity: "From the community",
    playerExperiences: "Player experiences",
    sourceNotFoundTitle: "Source not found — Checkr",
    noReportsMatchFilter: "No reports match this filter yet.",
    types: {
      official_store: "Official store",
      reseller: "Reseller",
      third_party: "Third-party",
      unknown: "Unknown source",
    },
  },
  signal: {
    communitySignal: "Community signal",
    reportsSharedByPlayers: "Shared by players",
    overallTone: "Overall tone",
    recentActivityLabel: "Recent activity",
    reportDetail: "Report detail",
    withEvidence: "{count} with evidence",
    noEvidence: "No evidence",
    whyAmISeeingThis: "Why am I seeing this?",
    anomalyWarning: "Unusual report activity detected — this signal may be less reliable.",
    noIssuesLabel: "No issues",
    concernsLabel: "Concerns",
    mixedPercent: "{percent}% mixed",
    mostlyClearDescription: "Most contributors described an ordinary experience.",
    mixedReportsDescription: "Experiences vary across recent community reports.",
    unexpectedBehaviorDescription: "Several contributors described unexpected behavior.",
    notEnoughReportsDescription: "Not enough reports yet to see a pattern.",
    distribution: {
      predominantly_positive: "Predominantly positive",
      mostly_positive: "Mostly positive",
      divided: "Divided opinions",
      majority_concerns: "Majority concerns",
      strong_concern_pattern: "Strong concern pattern",
    },
    recency: {
      active: "Active data",
      recent: "Recent activity",
      older: "Older reports",
      historical: "Historical only",
    },
    label: {
      mostly_clear: "Mostly clear",
      mixed_reports: "Mixed reports",
      concerns_reported: "Concerns reported",
      security_reports: "Security reports",
      limited_data: "Limited data",
      no_reports: "No reports yet",
    },
  },
  report: {
    shareAnExperience: "Share an experience",
    whichGame: "Which game is this about?",
    findGameFirst: "Find the game first, then tell us what happened.",
    noGamesFound: "No games found.",
    whatHappened: "What happened at a game source?",
    chooseClosest: "Choose the option closest to your experience.",
    whichSource: "Which source was it?",
    enterSiteOrStore: "Enter the site or store you visited.",
    websiteOrStore: "Website or store",
    domainPlaceholder: "example-site.com",
    dontIncludePasswords: "Don't include any passwords or personal details.",
    tellUsMore: "Tell us a little more",
    onlyShareWhatYouExperienced: "Only share what you personally experienced.",
    yourExperience: "Your experience",
    whatDidYouNotice: "What did you notice?",
    dontIncludeNames: "Please don't include names, accounts, or payment details.",
    attachScreenshot: "Attach a screenshot (optional)",
    dontIncludePersonalInfo: "Don't include personal information in your screenshot.",
    chooseScreenshot: "Choose a screenshot",
    removeScreenshot: "Remove",
    onlyImagesSupported: "Only image files are supported.",
    imageTooLarge: "Images must be 5MB or smaller.",
    uploadFailed: "Upload failed.",
    stepOf: "Step {current} of {total}",
    submitReport: "Submit report",
    couldntSaveSource: "Couldn't save that source.",
    genericError: "Something went wrong. Please try again.",
    backAria: "Back",
    categories: {
      no_issue: "No issues",
      suspicious: "Suspicious behavior",
      antivirus_warning: "Security warning",
      unexpected_software: "Unexpected download",
      malware: "Malware",
      suspicious_installer: "Unexpected installer",
      dangerous_redirect: "Dangerous redirect",
      fake_content: "Misleading details",
      other: "Something else",
    },
  },
  reportSuccess: {
    reportSubmitted: "Report submitted",
    thanksForSharing: "Thanks for sharing.",
    pendingReviewMessage:
      "Your report has been submitted and is pending review. Published reports help other players see the pattern.",
    backToSource: "Back to source",
    searchAnotherGame: "Search another game",
  },
  auth: {
    welcomeBack: "Welcome back",
    logInToCheckr: "Log in to Checkr",
    newHere: "New here?",
    createAccount: "Create an account",
    email: "Email",
    password: "Password",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "Your password",
    loggingIn: "Logging in…",
    logIn: "Log in",
    invalidCredentials: "That email or password doesn't match our records.",
    joinCommunity: "Join the community",
    createYourAccount: "Create your account",
    createAccountSubtitle: "Share what you've seen and help other players spot the pattern.",
    alreadyHaveAccount: "Already have an account?",
    username: "Username",
    usernamePlaceholder: "PixelScout",
    passwordHintPlaceholder: "At least 8 characters",
    ageConfirm: "I confirm that I am at least 13 years old.",
    creatingAccount: "Creating account…",
    continueWithDiscord: "Continue with Discord",
    genericError: "Something went wrong. Please try again.",
  },
  admin: {
    checkrAdmin: "Checkr Admin",
    signOut: "Sign out",
    moderationQueue: "Moderation queue",
    moderationQueueDescription: "Reports awaiting review, ordered by anomaly flag, then severity, then oldest first.",
    queueEmpty: "The queue is empty. Nothing is waiting for review.",
    submittedBy: "Submitted by {username}",
    noDescriptionProvided: "No description provided.",
    reason: "Reason",
    internalNotesOptional: "Internal notes (optional)",
    whyIsThisAction: "Why is this action being taken?",
    confirm: "Confirm",
    submitting: "Submitting…",
    actionFailed: "Action failed.",
    reportActionTitle: "{action} report",
    reportActionToast: "Report {action}.",
    anomalyFlagged: "Anomaly flagged",
    trustLevel: "Trust level",
    actions: {
      approve: "Approve",
      reject: "Reject",
      hide: "Hide",
      escalate: "Escalate",
    },
    actionsPast: {
      approve: "approved",
      reject: "rejected",
      hide: "hidden",
      escalate: "escalated",
    },
    trust: {
      contributor: "Contributor",
      trustedReporter: "Trusted Reporter",
      expertContributor: "Expert Contributor",
      communityGuardian: "Community Guardian",
    },
  },
};

export type Dictionary = typeof en;

export default en;
