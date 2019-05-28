export default class Utils {
  static formatTimestamp(t: number): string {
    const h = Math.floor(t / 1000 / 3600);
    const m = Math.floor((t - h * 1000 * 3600) / 1000 / 60);
    const s = Math.floor((t / 1000) % 60);

    const time = [];

    if (h > 0) {
      time.push(h);
      time.push(m > 10 ? m : "0" + m);
    } else {
      time.push(m);
    }

    time.push(s > 10 ? s : "0" + s);

    return time.join(":");
  }
}
