const clamp = (value: number) => Math.min(1, Math.max(0, value));

/** Write only changing values. Hidden and settled chapters need no per-frame DOM updates. */
export function applyRecapSceneMotion(section: HTMLElement, heading: HTMLElement | null, index: number, count: number, position: number, rawPosition: number, active: number) {
  const local = position - index;
  const enter = index === 0 ? 1 : clamp((local + .12) / .24);
  const exit = index === count - 1 ? 1 : clamp((1.12 - local) / .24);
  const presence = Math.min(enter, exit);
  const titleEnter = index === 0 ? 1 : clamp(local / .1);
  const titleExit = index === count - 1 ? 1 : clamp((.98 - local) / .1);
  const shift = local < .5 ? (1 - presence) * 48 : -(1 - presence) * 48;
  const titleShift = local < .5 ? (1 - titleEnter) * 12 : -(1 - titleExit) * 12;
  const writeStyle = (node: HTMLElement, property: string, value: string) => {
    if (node.style.getPropertyValue(property) !== value) node.style.setProperty(property, value);
  };
  writeStyle(section, '--scene-progress', `${clamp(local)}`);
  // Opacity and transforms belong to these layers, rather than inherited variables on every child.
  writeStyle(section, 'opacity', `${presence}`);
  writeStyle(section, 'transform', `translateY(${shift}px) scale(${.975 + presence * .025})`);
  if (heading) {
    writeStyle(heading, 'opacity', `${Math.min(titleEnter, titleExit)}`);
    writeStyle(heading, 'transform', `translateY(${titleShift}px)`);
  }
  const current = index === active;
  const states = { sceneActive: `${current}`, sceneVisible: `${presence > .001}`, entered: `${rawPosition >= index - .12}` };
  for (const [key, value] of Object.entries(states)) {
    if (section.dataset[key] !== value) section.dataset[key] = value;
  }
  if (section.inert !== !current) section.inert = !current;
  const hidden = `${!current}`;
  if (section.getAttribute('aria-hidden') !== hidden) section.setAttribute('aria-hidden', hidden);
}
