import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { VI } from './vi';

/**
 * Bảo đảm mọi chuỗi giao diện gọi qua t('…') đều có bản tiếng Việt.
 * Khi thêm chuỗi mới: viết tiếng Anh trong code, thêm bản dịch vào i18n/vi/manual.ts.
 */
const SRC = join(__dirname, '..', '..');
// t('...') hoặc t("...") với chuỗi literal; bỏ qua chuỗi không có chữ cái (mã, ký hiệu)
const CALL = /\bt\(\s*(['"])((?:\\.|(?!\1).)*)\1/g;

const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return name === 'i18n' ? [] : files(p);
    return /\.tsx?$/.test(name) && !/\.test\./.test(name) ? [p] : [];
  });

const unescape = (s: string) => s.replace(/\\n/g, '\n').replace(/\\(['"\\])/g, '$1');

describe('i18n — Vietnamese dictionary', () => {
  it('has a translation for every t() string in the app', () => {
    const missing = new Set<string>();
    for (const file of files(SRC)) {
      for (const m of readFileSync(file, 'utf8').matchAll(CALL)) {
        const key = unescape(m[2] ?? '');
        if (/[A-Za-z]/.test(key) && VI[key] === undefined) missing.add(key);
      }
    }
    expect([...missing].sort()).toEqual([]);
  });

  it('keeps {placeholders} identical in both languages', () => {
    const tokens = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(',');
    const broken = Object.entries(VI).filter(([en, vi]) => tokens(en) !== tokens(vi) && !/\{(building|date|time|start time|end time|deadline)\}/.test(en));
    expect(broken).toEqual([]);
  });
});
