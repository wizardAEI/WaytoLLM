export type ResourceKind = "项目" | "文章";

export interface EssayResource {
  kind: ResourceKind;
  title: string;
  href: string;
  intro: string;
}

export interface Essay {
  title: string;
  items: EssayResource[];
}

export function item(
  kind: ResourceKind,
  title: string,
  href: string,
  intro: string
): EssayResource {
  return { kind, title, href, intro };
}
