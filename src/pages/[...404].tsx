import { HttpStatusCode } from "@solidjs/start";
import type { JSX } from "solid-js";
import { MainWithTitle } from "~/components/MainWithTitle";

export default function NotFound(): JSX.Element {
  return (
    <MainWithTitle title="Page Not Found">
      <HttpStatusCode code={404} />
    </MainWithTitle>
  );
}
