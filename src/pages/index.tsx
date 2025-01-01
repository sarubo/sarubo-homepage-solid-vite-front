import { A } from "@solidjs/router";
import type { JSX } from "solid-js";
import { Counter } from "~/components/Counter";
import { MainWithTitle } from "~/components/MainWithTitle";
import { index } from "~/constants/headTitle";

export default function (): JSX.Element {
  return (
    <MainWithTitle title={index}>
      <>
        <Counter />
        <p>
          {"Visit "}
          <A href="https://start.solidjs.com" target="_blank" rel="noreferrer">
            start.solidjs.com
          </A>
          {" to learn how to build SolidStart apps."}
        </p>
      </>
    </MainWithTitle>
  );
}
