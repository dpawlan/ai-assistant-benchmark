const clamp = (value: number) => Math.min(1, Math.max(0, value));

/** Keep the scroll choreography, but only touch DOM properties whose values changed. */
export function createRecapSceneRenderer(section: HTMLElement, index: number, count: number) {
  const heading = section.querySelector<HTMLElement>('[data-scene-heading]');
  const canvas = section.querySelector<HTMLElement>('[data-visual-canvas]');
  let previous: ReturnType<typeof sceneFrame> | undefined;

  function sceneFrame(position: number, activeIndex: number, rawPosition: number) {
    const local = position - index;
    const enter = index === 0 ? 1 : clamp((local + 0.12) / 0.24);
    const exit = index === count - 1 ? 1 : clamp((1.12 - local) / 0.24);
    const presence = Math.min(enter, exit);
    const titleEnter = index === 0 ? 1 : clamp(local / 0.1);
    const titleExit = index === count - 1 ? 1 : clamp((0.98 - local) / 0.1);
    return {
      progress: clamp(local),
      presence,
      shift: local < 0.5 ? (1 - presence) * 48 : -(1 - presence) * 48,
      titlePresence: Math.min(titleEnter, titleExit),
      titleShift: local < 0.5 ? (1 - titleEnter) * 12 : -(1 - titleExit) * 12,
      active: index === activeIndex,
      visible: presence > 0.001,
      nearby: local > -0.35 && local < 1.35,
      entered: rawPosition >= index - 0.12,
    };
  }

  return {
    render(position: number, activeIndex: number, rawPosition: number) {
      const next = sceneFrame(position, activeIndex, rawPosition);
      // Only the illustration needs inherited progress. Scene/title motion stays
      // on its own element rather than invalidating every descendant's variables.
      if (next.progress !== previous?.progress) canvas?.style.setProperty('--scene-progress', `${next.progress}`);
      if (next.presence !== previous?.presence) section.style.opacity = `${next.presence}`;
      if (next.presence !== previous?.presence || next.shift !== previous?.shift) {
        section.style.transform = `translate3d(0, ${next.shift}px, 0) scale(${0.975 + next.presence * 0.025})`;
      }
      if (heading && next.titlePresence !== previous?.titlePresence) heading.style.opacity = `${next.titlePresence}`;
      if (heading && next.titleShift !== previous?.titleShift) heading.style.transform = `translate3d(0, ${next.titleShift}px, 0)`;
      if (next.active !== previous?.active) {
        section.dataset.sceneActive = `${next.active}`;
        section.inert = !next.active;
        section.setAttribute('aria-hidden', `${!next.active}`);
      }
      if (next.visible !== previous?.visible) section.dataset.sceneVisible = `${next.visible}`;
      if (next.nearby !== previous?.nearby) section.dataset.sceneNearby = `${next.nearby}`;
      if (next.entered !== previous?.entered) section.dataset.entered = `${next.entered}`;
      previous = next;
    },
    reset() {
      previous = undefined;
      section.style.removeProperty('opacity');
      section.style.removeProperty('transform');
      heading?.style.removeProperty('opacity');
      heading?.style.removeProperty('transform');
      canvas?.style.removeProperty('--scene-progress');
      section.inert = false;
      section.removeAttribute('aria-hidden');
      section.removeAttribute('data-scene-visible');
      section.removeAttribute('data-scene-active');
      section.removeAttribute('data-scene-nearby');
    },
  };
}
