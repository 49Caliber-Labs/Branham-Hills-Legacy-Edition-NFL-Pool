export type DispatchSlotType = 'friday' | 'sunday' | 'tuesday';

export const DISPATCH_SLOT_NAMES: Readonly<Record<DispatchSlotType, string>> = Object.freeze({
  friday: 'The Friday Wire and Injury Report',
  sunday: 'Sunday Night Live',
  tuesday: 'The Weekly Final',
});

export const DISPATCH_EDITION_BADGES: Readonly<Record<DispatchSlotType, string>> = Object.freeze({
  friday: 'DISPATCH 1 OF 3: THE FRIDAY WIRE AND INJURY REPORT',
  sunday: 'DISPATCH 2 OF 3: SUNDAY NIGHT LIVE',
  tuesday: 'DISPATCH 3 OF 3: THE WEEKLY FINAL',
});

export function resolveDispatchSlotType(type?: string, id?: string): DispatchSlotType | null {
  const normType = typeof type === 'string' ? type.trim().toLowerCase() : '';
  if (normType === 'friday' || normType === 'sunday' || normType === 'tuesday') {
    return normType;
  }

  const normId = typeof id === 'string' ? id.trim().toLowerCase() : '';
  if (normId === 'dispatch-friday' || normId.startsWith('dispatch-friday-')) return 'friday';
  if (normId === 'dispatch-sunday' || normId.startsWith('dispatch-sunday-')) return 'sunday';
  if (normId === 'dispatch-tuesday' || normId.startsWith('dispatch-tuesday-')) return 'tuesday';

  return null;
}

export function getCanonicalDispatchTitle(type: DispatchSlotType, week?: number): string {
  const baseName = DISPATCH_SLOT_NAMES[type];
  if (typeof week === 'number' && week > 0) {
    return `${baseName} • Week ${week}`;
  }
  return baseName;
}

export function getCanonicalDispatchSubject(
  type: DispatchSlotType,
  week?: number,
  prefix = '[Branham Hills Pool: Legacy Edition]'
): string {
  return `${prefix} 🏈 ${getCanonicalDispatchTitle(type, week)}`;
}

export function normalizeDispatchCanonicalTitles<
  T extends {
    id?: string;
    type?: string;
    week?: number;
    weekNumber?: number;
    title?: string;
    subject?: string;
  }
>(dispatch: T): T {
  const slot = resolveDispatchSlotType(dispatch.type, dispatch.id);
  if (!slot) {
    return dispatch;
  }

  const week =
    typeof dispatch.week === 'number' && dispatch.week > 0
      ? dispatch.week
      : typeof dispatch.weekNumber === 'number' && dispatch.weekNumber > 0
        ? dispatch.weekNumber
        : undefined;

  const title = getCanonicalDispatchTitle(slot, week);
  if (!dispatch.subject) {
    return {
      ...dispatch,
      title,
    };
  }

  const prefixMatch = typeof dispatch.subject === 'string'
    ? dispatch.subject.match(/^(\[[^\]]+\])/)
    : null;
  const subject = getCanonicalDispatchSubject(
    slot,
    week,
    prefixMatch ? prefixMatch[1] : '[Branham Hills Pool: Legacy Edition]'
  );

  return {
    ...dispatch,
    title,
    subject,
  };
}
