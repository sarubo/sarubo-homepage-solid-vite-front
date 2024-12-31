import { MetaProvider } from "@solidjs/meta";
import { A, useLocation } from "@solidjs/router";
import { type JSX, Suspense } from "solid-js";

export const App = (props: { children: JSX.Element }) => {
  const location = useLocation();

  return (
    <MetaProvider>
      <nav>
        <ul>
          <li>
            <A href="/">Home</A>
          </li>
          <li>
            <A href="/about">About</A>
          </li>
          <li>
            <A href="/error">Error</A>
          </li>

          <li>
            <span>URL:</span>
            <input type="text" readOnly={true} value={location.pathname} />
          </li>
        </ul>
      </nav>

      <main>
        <Suspense>{props.children}</Suspense>
      </main>
    </MetaProvider>
  );
};
