const PLATFORM_LABELS: Record<string, string> = {
  K_MOOC: "K-MOOC",
  "K-MOOC": "K-MOOC",
  KOCW: "KOCW",
  LLL_PORTAL: "온국민평생배움터",
  ALLGO: "온국민평생배움터",
  EVERLEARNING: "서울시평생학습포털",
  SEOUL_LLL: "서울시평생학습포털",
  온국민평생배움터: "온국민평생배움터",
  에버러닝: "서울시평생학습포털",
  서울시평생학습포털: "서울시평생학습포털",
  전국평생학습: "서울시평생학습포털",
};

const PLATFORM_FILTER_VALUES: Record<string, string> = {
  "K-MOOC": "K_MOOC",
  KOCW: "KOCW",
  온국민평생배움터: "LLL_PORTAL",
  전국평생학습: "EVERLEARNING",
  서울시평생학습포털: "SEOUL_LLL",
};

export function getPlatformLabel(platform: string) {
  return PLATFORM_LABELS[platform] || platform;
}

export function getPlatformFilterValue(platform: string) {
  return PLATFORM_FILTER_VALUES[platform] || platform;
}
