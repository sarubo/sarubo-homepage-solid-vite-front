import { For, Match, Switch, createSignal } from "solid-js";
import type { JSX, Setter, Signal } from "solid-js";
import type { FullInputEvent } from "~/type/wrap/event";
import "./loop_move.css";
import "./css/common.css";
import { MainWithTitle } from "~/components/MainWithTitle";
import { loopMove } from "~/constants/headTitle";

type FileType = "Move" | "Image";

type MediaFile = {
  fileType: FileType;
  file: File;
  url: string;
};

type WithSignal<T> = {
  labelName: string;
  signal: Signal<T>;
};

function InputNumber(props: WithSignal<number>): JSX.Element {
  const [getFromSignal, setToSignal] = props.signal;
  return (
    <div>
      <span class="input-label">{props.labelName}</span>
      <input
        class="file-input"
        type="number"
        value={getFromSignal()}
        onInput={(event: FullInputEvent): void => {
          const value: number = Number.parseInt(event.currentTarget.value);
          setToSignal((prev: number): number =>
            Number.isNaN(value) || value < 0 ? prev : value,
          );
        }}
      />
    </div>
  );
}

type InputFilesArgs = {
  accept: string;
  multiple: boolean;
  buttonTitleName: string;
  fileType: FileType;
};

function InputFiles(
  props: WithSignal<MediaFile[]> & InputFilesArgs,
): JSX.Element {
  const [getFromInputSingal, setToInputSingal] = createSignal<MediaFile[]>([]);
  const [, setToShowSignal] = props.signal;
  return (
    <div>
      <div>
        <span class="input-label">{props.labelName}</span>
        <input
          class="file-input"
          type="file"
          accept={props.accept}
          multiple={props.multiple}
          onInput={(event: FullInputEvent): void => {
            const filesOpt: FileList | null = event.currentTarget.files;
            setToInputSingal(
              filesOpt === null
                ? []
                : Array.from(filesOpt).map(
                    (f: File): MediaFile => ({
                      fileType: props.fileType,
                      file: f,
                      url: URL.createObjectURL(f),
                    }),
                  ),
            );
          }}
        />
      </div>
      <button
        class="wide-button"
        type="button"
        onClick={(): void => {
          setToShowSignal((prev: MediaFile[]): MediaFile[] =>
            prev.concat(
              getFromInputSingal().filter((f: MediaFile) =>
                prev.every((p: MediaFile) => p.url !== f.url),
              ),
            ),
          );
        }}
      >
        {props.buttonTitleName}
      </button>
    </div>
  );
}

function remover(
  mediaFile: MediaFile,
  setMediaFiles: Setter<MediaFile[]>,
): () => void {
  return (): void => {
    setMediaFiles((prev: MediaFile[]): MediaFile[] =>
      prev.filter((f) => f.url !== mediaFile.url),
    );
  };
}

function LoopMove(): JSX.Element {
  const heightSignal: Signal<number> = createSignal(500);
  const columnSignal: Signal<number> = createSignal(1);
  const [height] = heightSignal;
  const [column] = columnSignal;

  const mediaFilesSignal: Signal<MediaFile[]> = createSignal<MediaFile[]>([]);
  const [mediaFiles, setMediaFiles] = mediaFilesSignal;

  return (
    <>
      <div>
        <InputNumber signal={heightSignal} labelName="height" />
        <InputNumber signal={columnSignal} labelName="column" />
      </div>
      <div>
        <InputFiles
          signal={mediaFilesSignal}
          fileType="Move"
          labelName="move"
          accept="video/*"
          multiple={true}
          buttonTitleName="動画の追加"
        />
        <InputFiles
          signal={mediaFilesSignal}
          fileType="Image"
          labelName="image"
          accept="image/*"
          multiple={true}
          buttonTitleName="画像の追加"
        />
      </div>
      <div
        class="grid"
        style={{
          "grid-template-columns": `repeat(${column()}, 1fr)`,
        }}
      >
        <For each={mediaFiles()}>
          {(mediaFile: MediaFile): JSX.Element => (
            <div class="grid-item">
              <div class="button-container">
                <button
                  class="remove-button"
                  type="button"
                  onClick={remover(mediaFile, setMediaFiles)}
                >
                  ×
                </button>
              </div>
              <Switch>
                <Match when={mediaFile.fileType === "Image"}>
                  <img
                    class="media"
                    style={{ "max-height": `${height()}px` }}
                    src={mediaFile.url}
                    alt={mediaFile.file.name}
                  />
                </Match>
                <Match when={mediaFile.fileType === "Move"}>
                  <video
                    class="media"
                    style={{ "max-height": `${height()}px` }}
                    src={mediaFile.url}
                    loop={true}
                    playsinline={true}
                    controls={true}
                    muted={true}
                  />
                </Match>
              </Switch>
            </div>
          )}
        </For>
      </div>
    </>
  );
}

export default function (): JSX.Element {
  return (
    <MainWithTitle title={loopMove}>
      <LoopMove />
    </MainWithTitle>
  );
}
