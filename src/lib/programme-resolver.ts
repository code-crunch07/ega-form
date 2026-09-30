import { prisma } from "@/lib/prisma";

export interface PackageSlotDetail {
  slot: number;
  level: string;
  id: string;
  name: string;
  code?: string | null;
}

export interface ResolvedProgrammeInfo {
  programmeName: string;
  programmeCode: string | null;
  programmeLevel: string;
  campus: string;
  intake: string;
  studyMode: string;
  school: string;
  isPackage: boolean;
  packageDetails?: PackageSlotDetail[];
}

/**
 * Resolves full human-readable programme info for a single application.
 */
export async function resolveApplicationProgramme(app: {
  programmeId?: string | null;
  programmeLevel?: string | null;
  campus?: string | null;
  intake?: string | null;
  studyMode?: string | null;
  school?: string | null;
  draftData?: string | null;
}): Promise<ResolvedProgrammeInfo> {
  let parsedDraft: any = null;
  if (app.draftData) {
    try {
      parsedDraft = typeof app.draftData === "string" ? JSON.parse(app.draftData) : app.draftData;
    } catch {
      parsedDraft = null;
    }
  }

  const isPackage =
    parsedDraft?.courseType === "Package Courses" ||
    Boolean(
      parsedDraft?.packageProgrammes &&
        (parsedDraft.packageProgrammes.prog1Id || parsedDraft.packageProgrammes.prog2Id)
    );

  // Collect potential Programme IDs or codes to query
  const progIds = Array.from(
    new Set(
      [
        app.programmeId,
        parsedDraft?.programmeId,
        parsedDraft?.packageProgrammes?.prog1Id,
        parsedDraft?.packageProgrammes?.prog2Id,
        parsedDraft?.packageProgrammes?.prog3Id,
      ].filter(Boolean) as string[]
    )
  );

  const programmes = progIds.length > 0
    ? await prisma.programme.findMany({
        where: {
          OR: [
            { id: { in: progIds } },
            { code: { in: progIds } },
          ],
        },
        include: { school: true },
      })
    : [];

  const map = new Map<string, (typeof programmes)[0]>();
  programmes.forEach((p) => {
    map.set(p.id, p);
    if (p.code) map.set(p.code, p);
  });

  const campus = app.campus || parsedDraft?.campus || "Singapore Campus";
  const intake = app.intake || parsedDraft?.intake || "Not Selected";
  const studyMode = app.studyMode || parsedDraft?.studyMode || "Full-Time";
  const school = app.school || parsedDraft?.universityPartner || "Educare Global Academy";

  if (isPackage) {
    const p1Id = parsedDraft?.packageProgrammes?.prog1Id;
    const p2Id = parsedDraft?.packageProgrammes?.prog2Id;
    const p3Id = parsedDraft?.packageProgrammes?.prog3Id;

    const p1 = p1Id ? map.get(p1Id) : null;
    const p2 = p2Id ? map.get(p2Id) : null;
    const p3 = p3Id ? map.get(p3Id) : null;

    const packageDetails: PackageSlotDetail[] = [];
    if (p1Id || p1) {
      packageDetails.push({
        slot: 1,
        level: parsedDraft?.packageProgrammes?.prog1Level || "Foundation",
        id: p1Id || "",
        name: p1?.name || p1Id || "Programme 1",
        code: p1?.code || null,
      });
    }
    if (p2Id || p2) {
      packageDetails.push({
        slot: 2,
        level: parsedDraft?.packageProgrammes?.prog2Level || "Diploma Family",
        id: p2Id || "",
        name: p2?.name || p2Id || "Programme 2",
        code: p2?.code || null,
      });
    }
    if (p3Id || p3) {
      packageDetails.push({
        slot: 3,
        level: parsedDraft?.packageProgrammes?.prog3Level || "Undergraduate",
        id: p3Id || "",
        name: p3?.name || p3Id || "Programme 3",
        code: p3?.code || null,
      });
    }

    const names = packageDetails.map((d) => d.name);
    const programmeName = names.length > 0 ? names.join(" ➔ ") : "Package Pathway";

    return {
      programmeName,
      programmeCode: p1?.code || null,
      programmeLevel: app.programmeLevel || "Package Pathway",
      campus,
      intake,
      studyMode,
      school: p1?.school?.name || school,
      isPackage: true,
      packageDetails,
    };
  }

  // Standalone programme
  const matched =
    (app.programmeId ? map.get(app.programmeId) : null) ||
    (parsedDraft?.programmeId ? map.get(parsedDraft.programmeId) : null);

  const programmeName =
    matched?.name ||
    app.programmeLevel ||
    app.programmeId ||
    "Not Selected";

  return {
    programmeName,
    programmeCode: matched?.code || null,
    programmeLevel: matched?.level || app.programmeLevel || "Diploma",
    campus,
    intake,
    studyMode,
    school: matched?.school?.name || school,
    isPackage: false,
  };
}

/**
 * Returns a dictionary mapping Programme ID and Code to the Programme details for batch processing.
 */
export async function getProgrammesMap(): Promise<
  Map<string, { id: string; name: string; code: string; level: string }>
> {
  const programmes = await prisma.programme.findMany({
    select: { id: true, name: true, code: true, level: true },
  });
  const map = new Map<string, { id: string; name: string; code: string; level: string }>();
  programmes.forEach((p) => {
    map.set(p.id, p);
    if (p.code) map.set(p.code, p);
  });
  return map;
}

/**
 * Resolves human-readable programme name from a pre-fetched programme map.
 */
export function resolveProgrammeNameFromMap(
  app: {
    programmeId?: string | null;
    programmeLevel?: string | null;
    draftData?: string | null;
  },
  map: Map<string, { id: string; name: string; code: string; level: string }>
): string {
  if (app.programmeId && map.has(app.programmeId)) {
    return map.get(app.programmeId)!.name;
  }

  if (app.draftData) {
    try {
      const parsed = typeof app.draftData === "string" ? JSON.parse(app.draftData) : app.draftData;
      if (parsed?.courseType === "Package Courses" || parsed?.packageProgrammes) {
        const p1 = parsed.packageProgrammes?.prog1Id
          ? map.get(parsed.packageProgrammes.prog1Id)?.name
          : null;
        const p2 = parsed.packageProgrammes?.prog2Id
          ? map.get(parsed.packageProgrammes.prog2Id)?.name
          : null;
        const p3 = parsed.packageProgrammes?.prog3Id
          ? map.get(parsed.packageProgrammes.prog3Id)?.name
          : null;
        const names = [p1, p2, p3].filter(Boolean);
        if (names.length > 0) return names.join(" ➔ ");
      }
      if (parsed?.programmeId && map.has(parsed.programmeId)) {
        return map.get(parsed.programmeId)!.name;
      }
    } catch {
      // ignore JSON parse error
    }
  }

  return app.programmeLevel || app.programmeId || "Not Selected";
}
