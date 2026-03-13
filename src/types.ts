// ─── Shared interfaces and enums used across components ───────────────────────

export interface NavItem {
  label: string;
  page: string;
  href: string;
  target?: string;
}

export interface SocialItem {
  label: string;
  icon: string;
  href: string;
}

export interface LogoData {
  src: string;
  alt: string;
  cls: string;
}

export interface AnimalThumb {
  src: string;
  alt: string;
  label: string;
  active?: boolean;
}

export interface ProductImageSet {
  id: number;
  main: string;
  profile: string;
  thumbs: [string, string, string];
}

export interface AnimalInfo {
  dt: string;
  dd: string;
}

export interface AnimalData {
  pageTitle: string;
  camLabel: string;
  mainImage: string;
  mainAlt: string;
  thumbs: AnimalThumb[];
  feedTitle: string;
  feedBody: string;
  didFact: string;
  info: AnimalInfo[];
  photo: string;
  photoAlt: string;
  description: string;
}

export interface AnimalNavItem {
  slug: string;
  icon: string;
  label: string;
  href: string;
}

export interface SliderLayout {
  cols: number;
  rows: number;
  perPage: number;
}

export enum AnimalSlug {
  Panda = 'panda',
  Eagle = 'eagle',
  Gorilla = 'gorilla',
  Lemur = 'lemur',
}

export enum BtnVariant {
  Turquoise = 'turquoise',
  Orange = 'orange',
  Navy = 'navy',
  Outline = 'outline',
  Text = 'text',
  Arrow = 'arrow',
  Nav = 'nav',
}
