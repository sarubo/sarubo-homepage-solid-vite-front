type WithInputTarget = {
  currentTarget: HTMLInputElement;
  target: HTMLInputElement;
};

export type FullInputEvent = InputEvent & WithInputTarget;

export type WithSelectTarget = {
  currentTarget: HTMLSelectElement;
  target: HTMLSelectElement;
};
