export function scrollToPageBottomAfterRender(): void {
  window.setTimeout(() => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  }, 120);
}
