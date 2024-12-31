import { Title } from "@solidjs/meta";
import { createSignal } from "solid-js";

export default function Home() {
  const [count, setCount] = createSignal(0);

  return (
    <section>
      <Title>sarubo {"|>"} homepage</Title>
      <h1>Home</h1>
      <p>This is the home page.</p>

      <div>
        <button type="button" onClick={() => setCount(count() - 1)}>
          -
        </button>

        <output>Count: {count()}</output>

        <button type="button" onClick={() => setCount(count() + 1)}>
          +
        </button>
      </div>
    </section>
  );
}
