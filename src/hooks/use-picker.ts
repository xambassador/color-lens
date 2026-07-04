import { useRef, useEffect } from "preact/hooks";

import { activePicker, setColorVar } from "../store";

export function usePicker({ name }: { name: string }) {
  const pickerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = pickerRef.current;
    if (!el) return;
    const onColorChanged = (e: Event) => setColorVar(name, (e as CustomEvent<{ value: string }>).detail.value);
    el.addEventListener("color-changed", onColorChanged);
    return () => el.removeEventListener("color-changed", onColorChanged);
  }, [name]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") activePicker.value = null;
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return { ref: pickerRef };
}
