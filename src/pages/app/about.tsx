import type { JSX } from "solid-js";
import { MainWithTitle } from "~/components/MainWithTitle";
import { about } from "~/constants/headTitle";

export default function (): JSX.Element {
  return <MainWithTitle title={about} />;
}
