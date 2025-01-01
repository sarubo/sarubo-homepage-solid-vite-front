import { MetaProvider } from "@solidjs/meta";
import { type JSX, Suspense } from "solid-js";
import "./app.css";
import { Router } from "@solidjs/router";
import { RouterA } from "~/components/RouterA";
// biome-ignore lint/style/noNamespaceImport: <explanation>
import * as headTitle from "~/constants/headTitle";
import routes from "~solid-pages";

export function App(): JSX.Element {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <RouterA href="/">{headTitle.index}</RouterA>
          <RouterA href="/app/about">{headTitle.about}</RouterA>
          <RouterA href="/app/count_by_step">{headTitle.countByStep}</RouterA>
          <RouterA href="/app/loop_move">{headTitle.loopMove}</RouterA>
          <RouterA href="/app/websocket_universal_text_client">
            {headTitle.webSocketUniversalTextClient}
          </RouterA>
          <RouterA href="/app/file_share">{headTitle.fileShare}</RouterA>
          <RouterA href="/app/text_share">{headTitle.textShare}</RouterA>
          <RouterA href="/app/index_vs_for">{headTitle.forVsIndex}</RouterA>
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      {routes}
    </Router>
  );
}
