import { describe, it, expect, vi } from 'vitest';

vi.mock('../../js/firebase-config.js', () => ({
  db: {},
  doc: vi.fn(),
  getDoc: vi.fn(),
  COLLECTIONS: { BOXES: 'boxes', ADVENTURES: 'adventures' },
}));

import { getAdventureParams } from '../../js/adventure.js';

describe('getAdventureParams', () => {
  it('parses valid box and adventure params', () => {
    const result = getAdventureParams('?box=original&adventure=2');
    expect(result).toEqual({ box: 'original', adventure: '2' });
  });

  it('returns null when box is missing', () => {
    const result = getAdventureParams('?adventure=2');
    expect(result).toBeNull();
  });

  it('returns null when adventure is missing', () => {
    const result = getAdventureParams('?box=original');
    expect(result).toBeNull();
  });

  it('returns null for empty search string', () => {
    const result = getAdventureParams('');
    expect(result).toBeNull();
  });

  it('returns null for bare question mark', () => {
    const result = getAdventureParams('?');
    expect(result).toBeNull();
  });

  it('handles URL-encoded values', () => {
    const result = getAdventureParams('?box=my%20box&adventure=1');
    expect(result).toEqual({ box: 'my box', adventure: '1' });
  });

  it('ignores extra params', () => {
    const result = getAdventureParams('?box=original&adventure=3&extra=foo');
    expect(result).toEqual({ box: 'original', adventure: '3' });
  });

  it('returns null when both params are missing', () => {
    const result = getAdventureParams('?unrelated=value');
    expect(result).toBeNull();
  });
});
