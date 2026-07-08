export function getUserDisplayName(user: {
  name?: string | null;
  email: string;
  profile?: {
    firstName?: string | null;
    lastName?: string | null;
  } | null;
}) {
  const profile = user.profile;
  if (profile?.firstName) {
    return `${profile.firstName}${profile.lastName ? ` ${profile.lastName}` : ""}`.trim();
  }
  return user.name || "Applicant";
}

export function getUserInitials(user: {
  name?: string | null;
  email: string;
  profile?: {
    firstName?: string | null;
    lastName?: string | null;
  } | null;
}) {
  const profile = user.profile;
  if (profile?.firstName) {
    const first = profile.firstName[0] ?? "";
    const last = profile.lastName?.[0] ?? "";
    return `${first}${last}`.toUpperCase() || "AP";
  }
  if (user.name) {
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return user.name.slice(0, 2).toUpperCase();
  }
  return user.email.slice(0, 2).toUpperCase();
}

export function getProfileCompletion(user: {
  profile?: {
    firstName?: string | null;
    lastName?: string | null;
    dateOfBirth?: Date | null;
    passportNumber?: string | null;
    phone?: string | null;
    country?: string | null;
  } | null;
}) {
  const profile = user.profile;
  const fields = [
    profile?.firstName,
    profile?.lastName,
    profile?.dateOfBirth,
    profile?.passportNumber,
    profile?.phone,
    profile?.country,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

export const APPLICATION_STATUS_STYLES: Record<
  string,
  { label: string; className: string }
> = {
  Draft: {
    label: "Draft",
    className: "bg-neutral-100 text-neutral-700 border-neutral-200",
  },
  Submitted: {
    label: "Submitted",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  "Under Review": {
    label: "Under Review",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  Approved: {
    label: "Approved",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  Rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  "Offer Sent": {
    label: "Offer Sent",
    className: "bg-violet-50 text-violet-700 border-violet-200",
  },
  Completed: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  Pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
};

export function getStatusStyle(status: string) {
  return (
    APPLICATION_STATUS_STYLES[status] ?? {
      label: status,
      className: "bg-neutral-100 text-neutral-700 border-neutral-200",
    }
  );
}

export const DASHBOARD_BREADCRUMBS: Record<string, { label: string; href?: string }[]> = {
  "/dashboard": [],
  "/dashboard/profile": [{ label: "My Profile" }],
  "/dashboard/applications/new": [
    { label: "My Applications", href: "/dashboard/applications" },
    { label: "New Application" },
  ],
  "/dashboard/applications": [{ label: "My Applications" }],
  "/dashboard/documents": [{ label: "Documents" }],
  "/dashboard/payments": [{ label: "Payments" }],
  "/dashboard/messages": [{ label: "Messages" }],
  "/dashboard/notifications": [{ label: "Notifications" }],
  "/dashboard/settings": [{ label: "Settings" }],
};

export function getDashboardBreadcrumbs(pathname: string) {
  if (DASHBOARD_BREADCRUMBS[pathname]) {
    return DASHBOARD_BREADCRUMBS[pathname];
  }

  const match = Object.entries(DASHBOARD_BREADCRUMBS).find(
    ([path]) => path !== "/dashboard" && pathname.startsWith(path)
  );

  return match?.[1] ?? [];
}

export function formatRelativeDate(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}
