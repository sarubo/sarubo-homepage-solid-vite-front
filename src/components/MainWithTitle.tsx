import { Link, Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import type { ComponentProps, JSX } from "solid-js";

export type WithTitle = { title: string };

// もしバグったら参照すること
// https://www.solidjs.com/tutorial/props_children
export function MainWithTitle(
  props: WithTitle & ComponentProps<"main">,
): JSX.Element {
  return (
    <main>
      <Title>{props.title}</Title>
      <Link rel="icon" href="/icon/favicon.svg" />
      <Link rel="icon" href="/icon/favicon.png" />
      <h1>
        <A href="/">sarubo homepage</A>
      </h1>
      <h2>
        <A href={`#${props.title}`}>{props.title}</A>
      </h2>
      {props.children}
    </main>
  );
}
