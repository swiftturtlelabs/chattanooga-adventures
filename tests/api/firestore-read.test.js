import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGetDoc, mockGetDocs, mockDoc, mockCollection } = vi.hoisted(() => ({
  mockGetDoc: vi.fn(),
  mockGetDocs: vi.fn(),
  mockDoc: vi.fn(),
  mockCollection: vi.fn(),
}));

vi.mock('../../js/firebase-config.js', () => ({
  db: {},
  doc: mockDoc,
  getDoc: mockGetDoc,
  getDocs: mockGetDocs,
  collection: mockCollection,
  COLLECTIONS: { BOXES: 'boxes', ADVENTURES: 'adventures' },
}));

import { fetchAdventure } from '../../js/adventure.js';
import { fetchAllAdventures } from '../../js/adventures.js';

describe('Firestore read integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchAdventure', () => {
    it('returns data for a valid box and adventure', async () => {
      const data = { title: 'Ruby Falls', description: 'Underground waterfall' };
      mockGetDoc.mockResolvedValue({ exists: () => true, data: () => data });

      const result = await fetchAdventure({}, 'original', '1');
      expect(result).toEqual(data);
    });

    it('returns null for a nonexistent box', async () => {
      mockGetDoc.mockResolvedValue({ exists: () => false });
      const result = await fetchAdventure({}, 'nonexistent', '1');
      expect(result).toBeNull();
    });

    it('returns null for a nonexistent adventure in a valid box', async () => {
      mockGetDoc.mockResolvedValue({ exists: () => false });
      const result = await fetchAdventure({}, 'original', '999');
      expect(result).toBeNull();
    });

    it('propagates Firestore errors to the caller', async () => {
      mockGetDoc.mockRejectedValue(new Error('Permission denied'));
      await expect(fetchAdventure({}, 'original', '1')).rejects.toThrow();
    });
  });

  describe('fetchAllAdventures', () => {
    it('returns grouped adventures for all boxes', async () => {
      const boxDocs = {
        docs: [
          {
            id: 'original',
            data: () => ({ name: 'Original Box', description: 'The original box' }),
          },
        ],
      };
      const adventureDocs = {
        docs: [
          { id: '1', data: () => ({ title: 'Ruby Falls', description: '...' }) },
          { id: '2', data: () => ({ title: 'Incline Railway', description: '...' }) },
        ],
      };

      mockGetDocs.mockResolvedValueOnce(boxDocs).mockResolvedValueOnce(adventureDocs);

      const result = await fetchAllAdventures({});
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('original');
      expect(result[0].name).toBe('Original Box');
      expect(result[0].adventures).toHaveLength(2);
    });

    it('returns empty array when no boxes exist', async () => {
      mockGetDocs.mockResolvedValue({ docs: [] });
      const result = await fetchAllAdventures({});
      expect(result).toEqual([]);
    });

    it('uses box document ID as name when name field is missing', async () => {
      const boxDocs = {
        docs: [{ id: 'mystery', data: () => ({}) }],
      };
      const adventureDocs = { docs: [] };

      mockGetDocs.mockResolvedValueOnce(boxDocs).mockResolvedValueOnce(adventureDocs);

      const result = await fetchAllAdventures({});
      expect(result[0].name).toBe('mystery');
    });

    it('propagates Firestore errors to the caller', async () => {
      mockGetDocs.mockRejectedValue(new Error('Network error'));
      await expect(fetchAllAdventures({})).rejects.toThrow();
    });
  });
});
