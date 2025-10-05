import { createHash, randomBytes } from "crypto";

export class SeededRandom {
  private seed: number;

  constructor(seed: string | number) {
    if (typeof seed === 'string') {
      const hash = createHash('sha256').update(seed).digest();
      this.seed = hash.readUInt32BE(0);
    } else {
      this.seed = seed >>> 0;
    }
  }

  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) >>> 0;
    return this.seed / 0x100000000;
  }

  nextInt(max: number): number {
    return Math.floor(this.next() * max);
  }

  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = this.nextInt(i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

export function generateCaseCode(): string {
  const bytes = randomBytes(4);
  return bytes.toString('hex').toUpperCase();
}

export function getDailyCaseCode(): string {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const hash = createHash('sha256').update(`starhaven-daily-${dateStr}`).digest();
  return hash.subarray(0, 4).toString('hex').toUpperCase();
}
