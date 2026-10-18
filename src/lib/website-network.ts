export const WEBSITE_NETWORK = [
  { id: "nibelc-vn", name: "Nibelcgroup Vietnam", url: "https://nibelc.com.vn", host: "nibelc.com.vn", logo: "/network-logos/nibelc-vn.png", plate: "light" },
  { id: "vietduc", name: "Vietducgroup", url: "https://www.vietducgroup.com.vn", host: "www.vietducgroup.com.vn", logo: "/network-logos/vietduc.svg", plate: "dark" },
  { id: "nibelc-de", name: "NibelcGermany", url: "https://www.nibelcgermany.de", host: "www.nibelcgermany.de", logo: "/network-logos/nibelc-de.png", plate: "dark" },
  { id: "goldenvisa", name: "Goldenvisa", url: "https://golden-visa-europa.com", host: "golden-visa-europa.com", logo: "/network-logos/goldenvisa.png", plate: "dark" },
] as const;

export const CURRENT_SITE_ID = "vietduc";

export const WEBSITE_NETWORK_LABELS = {
  vi: { title: "Hệ thống website", current: "Bạn đang ở đây", newTab: "Mở trong tab mới" },
  de: { title: "Unsere Websites", current: "Sie sind hier", newTab: "Öffnet in neuem Tab" },
  en: { title: "Our websites", current: "You are here", newTab: "Opens in a new tab" },
} as const;

export function getWebsiteNetworkLabels(locale: string) {
  return WEBSITE_NETWORK_LABELS[locale as keyof typeof WEBSITE_NETWORK_LABELS] ?? WEBSITE_NETWORK_LABELS.en;
}
