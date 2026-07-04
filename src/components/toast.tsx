import { toast } from "../store";

export function Toast() {
  if (toast.value) {
    return <div class="toast">{toast.value}</div>;
  }
  return null;
}
