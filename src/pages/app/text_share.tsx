import { useLocation } from "@solidjs/router";
import {
  Index,
  type JSX,
  Match,
  type Signal,
  Switch,
  createSignal,
} from "solid-js";
import { MainWithTitle } from "~/components/MainWithTitle";
import { textShare } from "~/constants/headTitle";

type ConnectState = "connect" | "disconnect";

type Lift<T> = { value: T };

function getNow(): string {
  return new Date().toISOString();
}

function initWebsocket(
  websocketStateSignal: Signal<ConnectState>,
  messagesSignal: Signal<string[]>,
  secondSignal: Signal<number>,
  canUseTextareaSignal: Signal<boolean>,
  textAreaElm: Lift<HTMLTextAreaElement | undefined>,
  websocketLift: Lift<WebSocket | null>,
): Lift<WebSocket | null> {
  const [, setWebsocketState] = websocketStateSignal;
  const [, setMessages] = messagesSignal;
  const [, setSecond] = secondSignal;
  const [, setCanUseTextarea] = canUseTextareaSignal;
  const location = new URL(useLocation().pathname);
  const websocket =
    location.protocol === "https:"
      ? new WebSocket(`https://${location.hostname}/websocket/textShare`)
      : new WebSocket(`http://${location.hostname}/websocket/textShare`);
  let timerId: number | null = null;

  websocket.onopen = () => {
    setWebsocketState("connect");
    setCanUseTextarea(true);
    if (!timerId) {
      timerId = setInterval(() => {
        setSecond((prev) => prev + 1);
      }, 1000);
    }
    console.info(`on open: ${websocket.url}\nat ${getNow()}`);
  };

  websocket.onclose = (event: CloseEvent) => {
    setWebsocketState("disconnect");
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    console.info(`on close: ${websocket.url}
code: ${event.code}
reason: "${event.reason}"
at ${getNow()}`);
    if (websocketLift.value) {
      setTimeout(() => {
        initWebsocket(
          websocketStateSignal,
          messagesSignal,
          secondSignal,
          canUseTextareaSignal,
          textAreaElm,
          websocketLift,
        );
      }, 30_000);
    }
  };

  websocket.onmessage = (event: MessageEvent<string>) => {
    setMessages((prev) => [...prev, event.data]);
    console.info(`on message: ${event.data}\nat ${getNow()}`);
  };

  websocket.onerror = () => {
    console.info(`on error: ${websocket.url}\nat ${getNow()}`);
  };

  websocketLift.value = websocket;
  return websocketLift;
}

function onSubmit(
  textAreaElm: Lift<HTMLTextAreaElement | undefined>,
  canUseTextareaSignal: Signal<boolean>,
  hasContentSignal: Signal<boolean>,
) {
  const [, setCanUseTextarea] = canUseTextareaSignal;
  const [, setHasContent] = hasContentSignal;
  return () => {
    setCanUseTextarea(false);
    setHasContent(false);
    const textAreaElmValue = textAreaElm.value;
    if (textAreaElmValue) {
      const requestInit: RequestInit = {
        method: "POST",
        mode: "same-origin",
        cache: "no-cache",
        redirect: "follow",
        body: textAreaElmValue.value,
      };
      fetch("/api/textShare/post", requestInit).then(() => {
        textAreaElmValue.value = "";
        setCanUseTextarea(true);
      });
    }
  };
}

function onInput(
  textAreaElm: Lift<HTMLTextAreaElement | undefined>,
  hasContentSignal: Signal<boolean>,
) {
  const [hasContent, setHasContent] = hasContentSignal;
  return () => {
    const isEmpty = (textAreaElm.value?.value.length ?? 0) === 0;
    const shouldBeDisable = isEmpty && hasContent();
    // biome-ignore lint/complexity/useSimplifiedLogicExpression: <explanation>
    const shouldBeEnable = !isEmpty && !hasContent();
    if (shouldBeDisable) {
      setHasContent(false);
    } else if (shouldBeEnable) {
      setHasContent(true);
    }
  };
}

function TextShare(): JSX.Element {
  const messagesSignal = createSignal<string[]>([]);
  const [messages] = messagesSignal;
  const websocketStateSignal = createSignal<ConnectState>("disconnect");
  const [websocketState] = websocketStateSignal;
  const secondSignal = createSignal(0);
  const [second] = secondSignal;
  const canUseTextareaSignal = createSignal(true);
  const [canUseTextarea] = canUseTextareaSignal;
  const hasContentSignal = createSignal(false);
  const [hasContent] = hasContentSignal;
  const textAreaElm: Lift<HTMLTextAreaElement | undefined> = {
    value: undefined,
  };
  initWebsocket(
    websocketStateSignal,
    messagesSignal,
    secondSignal,
    canUseTextareaSignal,
    textAreaElm,
    { value: null },
  );
  // FIXME: Twitterみたいに投稿欄が上で最新のツイートほど上に来る方が
  // 投稿欄が動かないので良い
  // gridのreverseをしよう
  return (
    <>
      <article>
        <h3>投稿欄</h3>
        <p>
          <Switch>
            <Match when={websocketState() === "connect"}>
              接続、あるいは再接続から
              {second()}
              秒経過しました。
            </Match>
            <Match when={websocketState() === "disconnect"}>
              現在接続出来ていません。接続までしばらくお待ちください。
            </Match>
          </Switch>
        </p>
        <Index each={messages()}>
          {(item, index) => (
            <article>
              <h4>{index + 1}</h4>
              <p>{item()}</p>
            </article>
          )}
        </Index>
      </article>
      <article>
        <h3>書き込み欄</h3>
        <textarea
          ref={textAreaElm.value}
          disabled={!canUseTextarea()}
          onInput={onInput(textAreaElm, hasContentSignal)}
        />
        <button
          type="button"
          disabled={!hasContent() || websocketState() === "disconnect"}
          onClick={onSubmit(
            textAreaElm,
            canUseTextareaSignal,
            hasContentSignal,
          )}
        >
          送信
        </button>
      </article>
      <button type="button" onClick={() => console.log(textAreaElm)} />
    </>
  );
}

export default function (): JSX.Element {
  return (
    <MainWithTitle title={textShare}>
      <TextShare />
    </MainWithTitle>
  );
}
