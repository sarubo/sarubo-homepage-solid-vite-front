import { For, type JSX, type Setter, createSignal } from "solid-js";
import { MainWithTitle } from "~/components/MainWithTitle";
import "./css/common.css";
import { fileShare } from "~/constants/headTitle";
import type { FullInputEvent } from "~/type/wrap/event";

function isBoolean(a: unknown): a is boolean {
  return typeof a === "boolean";
}

function isString(a: unknown): a is string {
  return typeof a === "string";
}

/**
 * NOTE: Arrayもobjectにみなされる
 */
function isObject(a: unknown): a is object {
  return a !== null && typeof a === "object";
}

function sync(setFiles: Setter<string[]>) {
  const requestInit: RequestInit = {
    method: "GET",
    mode: "same-origin",
    cache: "no-cache",
    redirect: "follow",
  };
  fetch("/api/fileShare/cmd/show", requestInit)
    .then((response) => response.json())
    .then((json) => {
      if (Array.isArray(json) && json.every(isString)) {
        return json;
      }
      return Promise.reject(
        new Error(`this is not string[] on fetch: ${json}.`),
      );
    })
    .then((files) => setFiles(() => files));
}

const onClickForAddFile =
  (setFiles: Setter<string[]>, addFileElm: HTMLInputElement | undefined) =>
  (): void => {
    const files: FileList | null | undefined = addFileElm?.files;
    if (!files) {
      return;
    }
    Promise.allSettled(
      Array.from(files).map((file: File): Promise<Response> => {
        const fd = new FormData();
        fd.append("file", file, file.name);
        const requestInit: RequestInit = {
          method: "POST",
          mode: "same-origin",
          cache: "no-cache",
          redirect: "follow",
          body: fd,
        };
        return fetch("/api/fileShare/file", requestInit);
      }),
    ).then(() => sync(setFiles));
  };

const onClickForDeleteFile =
  (setFiles: Setter<string[]>, deleteFiles: Set<string>) => (): void => {
    const requestInit: RequestInit = {
      method: "DELETE",
      mode: "same-origin",
      cache: "no-cache",
      redirect: "follow",
      body: JSON.stringify(deleteFiles.values().toArray()),
    };
    fetch("/api/fileShare/file", requestInit)
      .then((response) => response.json())
      .then((json) => {
        if (isObject(json)) {
          return json;
        }
        return Promise.reject(
          new Error(`this is not object on fetch: ${json}.`),
        );
      })
      .then(Object.entries)
      .then((arr) => {
        if (
          arr.every((entry): entry is [string, boolean] => isBoolean(entry[1]))
        ) {
          return arr;
        }
        return Promise.reject(
          new Error(`this is not [string, boolean][] on fetch: ${arr}.`),
        );
      })
      .then((arr) =>
        arr
          .filter(([_, isDeleted]) => !isDeleted)
          .map(([fileName, _]) => fileName),
      )
      .then((failFiles: string[]) => {
        deleteFiles.clear();
        if (failFiles.length > 0) {
          window.alert(
            `削除に失敗しました: ${failFiles.join(", ")}
おそらく既に削除されています`,
          );
        }
      })
      .then(() => sync(setFiles));
  };

const onClickForSync = (setFiles: Setter<string[]>) => (): void => {
  sync(setFiles);
};

const onInputForCheckbox =
  (deleteFiles: Set<string>, syncFile: string) => (event: FullInputEvent) => {
    if (event.currentTarget.checked) {
      deleteFiles.add(syncFile);
    } else {
      deleteFiles.delete(syncFile);
    }
  };

function FileShare(): JSX.Element {
  let addFileElm: HTMLInputElement | undefined;
  const [files, setFiles] = createSignal<string[]>([]);
  const deleteFilesWrap: Set<string> = new Set();

  return (
    <>
      <div>
        <span class="input-label">送りたいファイル</span>
        <input
          class="file-input"
          type="file"
          multiple={true}
          ref={addFileElm}
        />
      </div>
      <button
        type="button"
        class="wide-button"
        onClick={onClickForAddFile(setFiles, addFileElm)}
      >
        追加
      </button>
      <button
        type="button"
        class="wide-button"
        onClick={onClickForSync(setFiles)}
      >
        同期
      </button>
      <button
        type="button"
        class="wide-button"
        onClick={onClickForDeleteFile(setFiles, deleteFilesWrap)}
      >
        選択箇所を削除
      </button>
      <div>
        <For each={files()}>
          {(syncFile: string): JSX.Element => {
            const inputId = `input_${syncFile}`;
            return (
              <div>
                <input
                  type="checkbox"
                  checked={false}
                  id={inputId}
                  oninput={onInputForCheckbox(deleteFilesWrap, syncFile)}
                />
                <label for={inputId}>{"ファイル名: "}</label>
                <a download={true} href={`/api/fileShare/file/${syncFile}`}>
                  {syncFile}
                </a>
              </div>
            );
          }}
        </For>
      </div>
    </>
  );
}

export default function (): JSX.Element {
  return (
    <MainWithTitle title={fileShare}>
      <FileShare />
    </MainWithTitle>
  );
}
