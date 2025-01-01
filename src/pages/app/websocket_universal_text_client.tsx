import { type JSX, type Setter, createSignal } from "solid-js";
import { MainWithTitle } from "~/components/MainWithTitle";
import "./css/common.css";
import "./websocket_universal_text_client.css";
import { webSocketUniversalTextClient } from "~/constants/headTitle";
import type { FullInputEvent } from "~/type/wrap/event";

function getTextAreaLn(setTextArea: Setter<string>): (adder: string) => void {
  function inner(adder: string): void {
    setTextArea((prev: string): `${string}${string}\n` => `${prev}${adder}\n`);
  }
  return inner;
}

function getNow(): string {
  return new Date().toISOString();
}

function WebsocketUniversalTextClient(): JSX.Element {
  const [rows, setRows] = createSignal(30);
  const [websocket, setWebsocket] = createSignal<WebSocket | null>(null);
  const [textArea, setTextArea] = createSignal("");
  const textAreaLn: (adder: string) => void = getTextAreaLn(setTextArea);
  let urlInputElm: HTMLInputElement | undefined;
  let messageInputElm: HTMLInputElement | undefined;

  function onClickForConnect(): void {
    {
      const prevWs: WebSocket | null = websocket();
      if (prevWs !== null && prevWs.readyState !== prevWs.CLOSED) {
        prevWs.close();
      }
    }
    try {
      const inputUrl: string = urlInputElm?.value ?? "";
      const ws: WebSocket = new WebSocket(inputUrl);
      ws.onopen = (): void => textAreaLn(`on open: ${ws.url}\nat ${getNow()}`);
      ws.onclose = (event: CloseEvent): void => {
        textAreaLn(
          `on close: ${ws.url}
code: ${event.code}
reason: "${event.reason}"
at ${getNow()}`,
        );
        setWebsocket(null);
      };
      ws.onmessage = (event: MessageEvent<string>): void =>
        textAreaLn(`on message: ${event.data}\nat ${getNow()}`);
      ws.onerror = (): void => {
        textAreaLn(`on error: ${ws.url}\nat ${getNow()}`);
        setWebsocket(null);
      };
      setWebsocket(ws);
    } catch (error) {
      textAreaLn(`on catch error: ${error}`);
    }
  }

  function onClickForClose(): void {
    websocket()?.close(1000, "normal");
  }

  function onClickForClear(): void {
    setTextArea("");
  }

  function onClickForSend(): void {
    const message: string | undefined = messageInputElm?.value;
    if (message) {
      const ws = websocket();
      if (ws && ws.readyState === ws.OPEN) {
        ws.send(message);
      }
    }
  }

  return (
    <>
      <div>
        <div class="ws-input-container">
          <span class="input-label">表示行数:</span>
          <input
            class="ws-input"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            value={rows()}
            onInput={(event: FullInputEvent): void => {
              const value: number = Number.parseInt(event.currentTarget.value);
              setRows((prev: number): number =>
                Number.isNaN(value) || value < 1 ? prev : value,
              );
            }}
          />
        </div>
        <div class="ws-input-container">
          <span class="input-label">url:</span>
          <input class="ws-input" type="url" ref={urlInputElm} />
        </div>
        <div class="ws-input-container">
          <span class="input-label">メッセージ:</span>
          <input class="ws-input" type="text" ref={messageInputElm} />
        </div>
        <div class="ws-input-container">
          <button class="ws-button" type="button" onClick={onClickForConnect}>
            接続
          </button>
          <button class="ws-button" type="button" onClick={onClickForSend}>
            メッセージ送信
          </button>
          <button class="ws-button" type="button" onclick={onClickForClose}>
            切断
          </button>
          <button class="ws-button" type="button" onClick={onClickForClear}>
            表示 クリア
          </button>
        </div>
      </div>
      <div class="ws-textarea-container">
        <textarea class="ws-textarea monospace" readOnly={true} rows={rows()}>
          {textArea()}
        </textarea>
      </div>
    </>
  );
}

export default function (): JSX.Element {
  return (
    <MainWithTitle title={webSocketUniversalTextClient}>
      <WebsocketUniversalTextClient />
    </MainWithTitle>
  );
}
