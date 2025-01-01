import { For, createSignal } from "solid-js";
import type { JSX } from "solid-js";
import { MainWithTitle } from "~/components/MainWithTitle";
import { countByStep } from "~/constants/headTitle";
import type { WithSelectTarget } from "~/type/wrap/event";

function Counter(): JSX.Element {
  const [count, setCount] = createSignal(0);
  const [step, setStep] = createSignal(1);
  return (
    <>
      <p>
        step:{" "}
        <select
          onChange={(event: Event & WithSelectTarget): number =>
            setStep(Number.parseInt(event.currentTarget.value))
          }
        >
          <For each={[1, 2, 3, 5, 10]}>
            {(stepInit: number): JSX.Element => (
              <option value={stepInit}>{stepInit} step</option>
            )}
          </For>
        </select>
      </p>
      <p>
        count: {count()}{" "}
        <button
          type="button"
          onclick={(): number =>
            setCount((prev: number): number => prev - step())
          }
        >
          –
        </button>
        <button
          type="button"
          onclick={(): number =>
            setCount((prev: number): number => prev + step())
          }
        >
          +
        </button>
      </p>
    </>
  );
}

export default function (): JSX.Element {
  return (
    <MainWithTitle title={countByStep}>
      <Counter />
    </MainWithTitle>
  );
}
