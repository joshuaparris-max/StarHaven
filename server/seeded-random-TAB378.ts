import { hashStringToUint32, randomHex } from "@shared/random";

export class SeededRandom {
  private seed: number;

  constructor(seed: string | number) {
    if (typeof seed === 'string') {
      this.seed = hashStringToUint32(seed);
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
  return randomHex(4);
}

export function getDailyCaseCode(): string {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return hashStringToUint32(`starhaven-daily-${dateStr}`).toString(16).padStart(8, "0").toUpperCase();
}
