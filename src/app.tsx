import { Suspense, type Component } from 'solid-js';
import { A, useLocation } from '@solidjs/router';

const App: Component = (props: { children: Element }) => {
  const location = useLocation();

  return (
    <>
      <nav>
        <ul>
          <li>
            <A href="/">
              Home
            </A>
          </li>
          <li>
            <A href="/about">
              About
            </A>
          </li>
          <li>
            <A href="/error">
              Error
            </A>
          </li>

          <li>
            <span>URL:</span>
            <input
              type="text"
              readOnly
              value={location.pathname}
            />
          </li>
        </ul>
      </nav>

      <main>
        <Suspense>{props.children}</Suspense>
      </main>
    </>
  );
};

export default App;
