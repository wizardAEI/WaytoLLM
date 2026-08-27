const EXTERNAL_REL = "noopener noreferrer";

export function isExternalHref(href: string): boolean {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }

  try {
    return new URL(href, window.location.href).origin !== window.location.origin;
  } catch {
    return false;
  }
}

export function externalLinkAttrs(href: string) {
  if (!isExternalHref(href)) return {};
  return { target: "_blank" as const, rel: EXTERNAL_REL };
}

function patchAnchor(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href") ?? "";
  if (!isExternalHref(href)) return;
  anchor.target = "_blank";
  anchor.rel = EXTERNAL_REL;
}

function patchExternalLinks(root: ParentNode = document) {
  root.querySelectorAll<HTMLAnchorElement>("article a[href]").forEach(patchAnchor);
}

/** 确保文章区域里的外链都在新标签页打开。 */
export function initExternalLinks() {
  patchExternalLinks();

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLAnchorElement) patchAnchor(node);
        if (node instanceof HTMLElement) patchExternalLinks(node);
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  document.addEventListener("click", (event) => {
    const anchor = (event.target as Element | null)?.closest("article a[href]");
    if (!(anchor instanceof HTMLAnchorElement)) return;

    const href = anchor.getAttribute("href") ?? "";
    if (!isExternalHref(href) || anchor.target === "_blank") return;

    event.preventDefault();
    window.open(href, "_blank", "noopener,noreferrer");
  });
}
