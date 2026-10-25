export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const sec = Math.floor(seconds % 60);

  let msg = "";

  if (hours > 0) {
    msg += `${hours} hour${hours > 1 ? "s" : ""}`;
    if (mins > 0 || sec > 0) {
      msg += ", ";
    }
  }

  if (mins > 0) {
    msg += `${mins} minute${mins > 1 ? "s" : ""}`;
    if (sec > 0) {
      msg += ", ";
    }
  }

  if (sec > 0) {
    msg += `${sec} second${sec > 1 ? "s" : ""}`;
  }

  return msg.length === 0 ? "0 seconds" : msg;
}