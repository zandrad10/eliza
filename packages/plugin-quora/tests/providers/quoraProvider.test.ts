import { describe, it, expect, vi } from 'vitest';
import { quoraProvider } from '../../src/providers/quoraProvider';
import { mockRuntime, mockMemory } from '../setup';
import { QuoraQuestion } from '../../src/types';

describe('Quora Provider', () => {
    it('should initialize with correct configuration', async () => {
        const data = await quoraProvider.get(mockRuntime, mockMemory);
        expect(data).toBeDefined();
    });

    it('should fetch question details', async () => {
        const questionMemory = {
            ...mockMemory,
            content: {
                text: 'https://www.quora.com/What-is-the-best-programming-language',
            },
        };

        const data = await quoraProvider.get(mockRuntime, questionMemory);
        expect(data).toHaveProperty('question');
        expect((data.question as QuoraQuestion).url).toContain('quora.com');
    });

    it('should handle invalid URLs', async () => {
        const invalidMemory = {
            ...mockMemory,
            content: {
                text: 'invalid-url',
            },
        };

        await expect(
            quoraProvider.get(mockRuntime, invalidMemory)
        ).rejects.toThrow();
    });

    it('should handle authentication errors', async () => {
        const mockRuntimeWithInvalidCreds = {
            ...mockRuntime,
            getSetting: vi.fn(() => undefined),
        };

        await expect(
            quoraProvider.get(mockRuntimeWithInvalidCreds, mockMemory)
        ).rejects.toThrow('Authentication failed');
    });
});
