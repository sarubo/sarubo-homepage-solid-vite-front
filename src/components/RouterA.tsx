import "./RouterA.css";
import { A, type AnchorProps } from "@solidjs/router";

export function RouterA(props: AnchorProps) {
  return <A class="router-a" {...props} />;
}
