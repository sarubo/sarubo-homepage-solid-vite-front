import { For, Index, type JSX, createSignal } from "solid-js";
import { MainWithTitle } from "~/components/MainWithTitle";
import "./index_vs_for.css";
import { createStore, produce } from "solid-js/store";
import { forVsIndex as indexVsFor } from "~/constants/headTitle";

function IndexVsFor(): JSX.Element {
  const [messages, setMessages] = createSignal<string[]>([]);
  const [messagesStore, setMessagesStore] = createStore<string[]>([]);
  let messageInputElm: HTMLInputElement | undefined;
  return (
    <>
      <input type="text" ref={messageInputElm} />
      <button
        type="button"
        onClick={() => {
          const value = messageInputElm?.value;
          if (value) {
            setMessages((prev) => [...prev, value]);
          }
        }}
      >
        signal
      </button>
      <button
        type="button"
        onClick={() => {
          const value = messageInputElm?.value;
          if (value) {
            setMessagesStore(produce((prev) => prev.push(value)));
          }
        }}
      >
        store produce
      </button>
      <div class="two_col_container">
        <div>
          <p>Index</p>
          <Index each={messages()}>
            {(message, index) => (
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setMessages((prev) => {
                      const index = prev.findIndex((m) => m === message());
                      if (index >= 0) {
                        return prev.toSpliced(index, 1);
                      }
                      return prev;
                    })
                  }
                >
                  x
                </button>
                <input type="checkbox" />
                <p>
                  {index}: {message()}
                </p>
              </div>
            )}
          </Index>
        </div>
        <div>
          <p>For</p>
          <For each={messages()}>
            {(message, index) => (
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setMessages((prev) => {
                      const index = prev.findIndex((m) => m === message);
                      if (index >= 0) {
                        return prev.toSpliced(index, 1);
                      }
                      return prev;
                    })
                  }
                >
                  x
                </button>
                <input type="checkbox" />
                <p>
                  {index()}: {message}
                </p>
              </div>
            )}
          </For>
        </div>
        <div>
          <p>For Store</p>
          <For each={messagesStore}>
            {(message, index) => (
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setMessagesStore(
                      produce((prev) => {
                        const index = prev.findIndex((m) => m === message);
                        if (index >= 0) {
                          prev.splice(index, 1);
                        }
                      }),
                    )
                  }
                >
                  x
                </button>
                <input type="checkbox" />
                <p>
                  {index()}: {message}
                </p>
              </div>
            )}
          </For>
        </div>
      </div>
    </>
  );
}

export default function (): JSX.Element {
  return (
    <MainWithTitle title={indexVsFor}>
      <IndexVsFor />
    </MainWithTitle>
  );
}
