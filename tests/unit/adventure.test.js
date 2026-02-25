import { describe, it, expect, vi, afterEach } from 'vitest';

const { mockGetDoc, mockDoc } = vi.hoisted(() => ({
  mockGetDoc: vi.fn(),
  mockDoc: vi.fn(),
}));

vi.mock('../../js/firebase-config.js', () => ({
  db: {},
  doc: mockDoc,
  getDoc: mockGetDoc,
  COLLECTIONS: { BOXES: 'boxes', ADVENTURES: 'adventures' },
}));

import { fetchAdventure } from '../../js/adventure.js';

describe('fetchAdventure', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns adventure data when the document exists', async () => {
    const mockData = {
      title: 'Go to Ruby Falls',
      description: 'An underground waterfall adventure.',
    };
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => mockData,
    });

    const result = await fetchAdventure({}, 'original', '1');

    expect(result).toEqual(mockData);
    expect(mockDoc).toHaveBeenCalledWith({}, 'boxes', 'original', 'adventures', '1');
  });

  it('returns null when the document does not exist', async () => {
    mockGetDoc.mockResolvedValue({ exists: () => false });

    const result = await fetchAdventure({}, 'original', '999');

    expect(result).toBeNull();
  });

  it('propagates Firestore errors', async () => {
    mockGetDoc.mockRejectedValue(new Error('Network error'));

    await expect(fetchAdventure({}, 'original', '1')).rejects.toThrow('Network error');
  });

  it('passes correct collection path for nested adventure', async () => {
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ title: 'Test', description: 'Test' }),
    });

    await fetchAdventure({}, 'deluxe', '5');

    expect(mockDoc).toHaveBeenCalledWith({}, 'boxes', 'deluxe', 'adventures', '5');
  });
});
