export const DAILY_FREE_LIMIT = 15;
export const REWARD_AD_BONUS = 5;
export const MAX_DAILY_REWARDS = 3;

const QUOTA_STORAGE_KEY = "iknowapdf_daily_quota_v1";
const QUOTA_SECRET_SALT = "iknowapdf-client-integrity-2026-v1";

export interface DailyQuotaState {
  date: string; // YYYY-MM-DD in local time
  used: number;
  bonusUnlocked: number;
  rewardsClaimed: number;
  lastUpdatedMs: number;
  sig: string;
}

export interface PendingDownloadItem {
  data: Uint8Array | Blob;
  fileName: string;
  mimeType: string;
}

let _pendingDownload: PendingDownloadItem | null = null;

export function setPendingDownload(item: PendingDownloadItem | null): void {
  _pendingDownload = item;
}

export function consumePendingDownload(): PendingDownloadItem | null {
  const item = _pendingDownload;
  _pendingDownload = null;
  return item;
}

function getLocalTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function computeIntegritySig(
  date: string,
  used: number,
  bonus: number,
  rewards: number
): string {
  const raw = date + ":" + used + ":" + bonus + ":" + rewards + ":" + QUOTA_SECRET_SALT;
  let hash = 2166136261;
  for (let i = 0; i < raw.length; i++) {
    hash ^= raw.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

/**
 * Checks whether the user has an active 7-Day Pass or Monthly Pro Pass.
 * Automatically cleans up expired time-bound passes.
 */
export function isUserPro(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const untilRaw = localStorage.getItem("iknowapdf_pro_until");
    if (untilRaw) {
      const untilMs = Number(untilRaw);
      if (!Number.isNaN(untilMs) && untilMs > Date.now()) {
        return true;
      }
      // Time-limited pass has expired -> clean up flags
      localStorage.removeItem("iknowapdf_pro_until");
      localStorage.removeItem("iknowapdf_ad_free");
      localStorage.removeItem("iknowapdf_ad_free_order");
      return false;
    }
    return localStorage.getItem("iknowapdf_ad_free") === "true";
  } catch {
    return false;
  }
}

export function getQuotaState(): DailyQuotaState {
  const today = getLocalTodayString();
  const nowMs = Date.now();
  const defaultState: DailyQuotaState = {
    date: today,
    used: 0,
    bonusUnlocked: 0,
    rewardsClaimed: 0,
    lastUpdatedMs: nowMs,
    sig: computeIntegritySig(today, 0, 0, 0),
  };

  if (typeof window === "undefined") return defaultState;

  try {
    const raw = localStorage.getItem(QUOTA_STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as DailyQuotaState;

    // Verify integrity hash first
    const expectedSig = computeIntegritySig(
      parsed.date,
      parsed.used,
      parsed.bonusUnlocked,
      parsed.rewardsClaimed
    );
    if (parsed.sig !== expectedSig) {
      const penalized: DailyQuotaState = {
        date: today,
        used: DAILY_FREE_LIMIT,
        bonusUnlocked: 0,
        rewardsClaimed: MAX_DAILY_REWARDS,
        lastUpdatedMs: nowMs,
        sig: computeIntegritySig(today, DAILY_FREE_LIMIT, 0, MAX_DAILY_REWARDS),
      };
      saveQuotaState(penalized);
      return penalized;
    }

    // Guard against backward system clock rollback (> 2 hours backward)
    if (parsed.lastUpdatedMs && nowMs < parsed.lastUpdatedMs - 2 * 3600 * 1000) {
      return parsed;
    }

    // Reset on new calendar day
    if (parsed.date !== today) {
      saveQuotaState(defaultState);
      return defaultState;
    }

    return parsed;
  } catch {
    return defaultState;
  }
}

function saveQuotaState(state: DailyQuotaState): void {
  if (typeof window === "undefined") return;
  try {
    const signed: DailyQuotaState = {
      ...state,
      lastUpdatedMs: Date.now(),
      sig: computeIntegritySig(
        state.date,
        state.used,
        state.bonusUnlocked,
        state.rewardsClaimed
      ),
    };
    localStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify(signed));
    window.dispatchEvent(
      new CustomEvent("iknowapdf_quota_updated", { detail: signed })
    );
  } catch {}
}

export function getRemainingOperations(): {
  remaining: number;
  totalAllowed: number;
  used: number;
  canClaimReward: boolean;
  isPro: boolean;
} {
  const pro = isUserPro();
  const state = getQuotaState();
  const totalAllowed = DAILY_FREE_LIMIT + state.bonusUnlocked;
  const remaining = pro ? Infinity : Math.max(0, totalAllowed - state.used);
  return {
    remaining,
    totalAllowed,
    used: state.used,
    canClaimReward: state.rewardsClaimed < MAX_DAILY_REWARDS,
    isPro: pro,
  };
}

export function consumeOperationQuota(): boolean {
  if (isUserPro()) return true;

  const state = getQuotaState();
  const totalAllowed = DAILY_FREE_LIMIT + state.bonusUnlocked;

  if (state.used >= totalAllowed) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("iknowapdf_open_paywall"));
    }
    return false;
  }

  saveQuotaState({
    ...state,
    used: state.used + 1,
  });
  return true;
}

export function claimRewardedAdBonus(adStartTimestampMs: number): boolean {
  const elapsedMs = Date.now() - adStartTimestampMs;
  if (elapsedMs < 12000) {
    return false;
  }
  const state = getQuotaState();
  if (state.rewardsClaimed >= MAX_DAILY_REWARDS) {
    return false;
  }
  saveQuotaState({
    ...state,
    bonusUnlocked: state.bonusUnlocked + REWARD_AD_BONUS,
    rewardsClaimed: state.rewardsClaimed + 1,
  });
  return true;
}
