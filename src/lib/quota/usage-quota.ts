export const DAILY_FREE_LIMIT = 15;
export const REWARD_AD_BONUS = 5;
export const MAX_DAILY_REWARDS = 3;

const QUOTA_STORAGE_KEY = "iknowapdf_daily_quota_v1";
const QUOTA_SECRET_SALT = "iknowapdf-client-integrity-2026-v1";

export interface DailyQuotaState {
  date: string; // YYYY-MM-DD
  used: number;
  bonusUnlocked: number;
  rewardsClaimed: number;
  sig: string;
}

function getLocalTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function computeIntegritySig(date: string, used: number, bonus: number, rewards: number): string {
  const raw = `${date}:${used}:${bonus}:${rewards}:${QUOTA_SECRET_SALT}`;
  let hash = 2166136261;
  for (let i = 0; i < raw.length; i++) {
    hash ^= raw.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

export function isUserPro(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem("iknowapdf_ad_free") === "true";
  } catch {
    return false;
  }
}

export function getQuotaState(): DailyQuotaState {
  const today = getLocalTodayString();
  const defaultState: DailyQuotaState = {
    date: today,
    used: 0,
    bonusUnlocked: 0,
    rewardsClaimed: 0,
    sig: computeIntegritySig(today, 0, 0, 0),
  };

  if (typeof window === "undefined") return defaultState;

  try {
    const raw = localStorage.getItem(QUOTA_STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as DailyQuotaState;

    if (parsed.date !== today) {
      saveQuotaState(defaultState);
      return defaultState;
    }

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
        sig: computeIntegritySig(today, DAILY_FREE_LIMIT, 0, MAX_DAILY_REWARDS),
      };
      saveQuotaState(penalized);
      return penalized;
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
      sig: computeIntegritySig(
        state.date,
        state.used,
        state.bonusUnlocked,
        state.rewardsClaimed
      ),
    };
    localStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify(signed));
    window.dispatchEvent(new CustomEvent("iknowapdf_quota_updated", { detail: signed }));
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
