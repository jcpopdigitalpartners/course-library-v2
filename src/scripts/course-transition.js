import { gsap } from 'gsap';

// One timeline owns both sweeps, the pause, and the navigation handoff.
export function createCourseTransition({ tiles, columns, rows, reveal, navigate, loading }) {
  const tileDuration = 0.18;
  const sweepDuration = 0.72;
  const pauseDuration = 1.8;
  const diagonalDelay = index => {
    const x = index % columns;
    const y = Math.floor(index / columns);
    return ((x + y) / Math.max(1, columns + rows - 2)) * (sweepDuration - tileDuration);
  };
  const wipe = tiles[0]?.parentElement;
  if (wipe) gsap.set(wipe, { backgroundColor: 'transparent' });
  gsap.set(tiles, { opacity: 1, scale: 0, transformOrigin: 'center center' });
  let dotMotion;
  const stopLoading = () => {
    dotMotion?.kill();
    dotMotion = undefined;
    if (loading) loading.hidden = true;
  };
  const timeline = gsap.timeline({
    paused: true,
    onComplete: () => { stopLoading(); navigate(); },
    onInterrupt: stopLoading
  });
  timeline.to(tiles, {
    scale: 1, duration: tileDuration, ease: 'power2.out', stagger: diagonalDelay
  }, 0);
  // Overlapping tiles prevent raster seams; a solid backing seals the hold.
  if (wipe) timeline.set(wipe, { backgroundColor: 'var(--wipe-color, #17191e)' }, sweepDuration);
  if (reveal) {
    timeline.call(() => {
      reveal();
      if (!loading) return;
      loading.hidden = false;
      const dots = loading.querySelectorAll('.loading-dots > span');
      gsap.set(dots, { y: 0 });
      dotMotion = gsap.to(dots, {
        y: -5, duration: 0.16, ease: 'sine.inOut',
        stagger: { each: 0.08, repeat: -1, yoyo: true }
      });
    }, [], sweepDuration);
    timeline.call(stopLoading, [], sweepDuration + pauseDuration);
    if (wipe) timeline.set(wipe, { backgroundColor: 'transparent' }, sweepDuration + pauseDuration);
    timeline.to(tiles, {
      scale: 0, duration: tileDuration, ease: 'power2.in', stagger: diagonalDelay
    }, sweepDuration + pauseDuration);
  }
  return timeline;
}
