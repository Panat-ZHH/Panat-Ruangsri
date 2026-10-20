export const PORTFOLIO_DETAIL_EVENT = 'panat:open-detail';
export const PORTFOLIO_NAVIGATE_EVENT = 'panat:navigate-detail';
const cardSlugs = ['software-developer', 'founder', 'side-jobs', 'hobbys'];

export function openPortfolioDetail(slug: string) {
  const request = new CustomEvent<{ slug: string }>(PORTFOLIO_NAVIGATE_EVENT, {
    detail: { slug },
    cancelable: true,
  });
  const handled = !window.dispatchEvent(request);
  if (handled) return;

  const cardIndex = cardSlugs.indexOf(slug);
  const home = document.querySelector<HTMLElement>('.home');
  if (cardIndex < 0 || !home) {
    showPortfolioDetail(slug);
    return;
  }

  const start = window.scrollY;
  const homeTop = start + home.getBoundingClientRect().top;
  const target = homeTop + (2.2 + cardIndex) * window.innerHeight;
  const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 850;
  const startedAt = performance.now();
  const animate = (time: number) => {
    const progress = duration === 0 ? 1 : Math.min((time - startedAt) / duration, 1);
    const eased = progress * progress * (3 - 2 * progress);
    window.scrollTo({ top: start + (target - start) * eased, behavior: 'instant' });
    if (progress < 1) window.requestAnimationFrame(animate);
    else showPortfolioDetail(slug);
  };
  window.requestAnimationFrame(animate);
}

export function showPortfolioDetail(slug: string) {
  window.dispatchEvent(new CustomEvent(PORTFOLIO_DETAIL_EVENT, { detail: slug }));
}