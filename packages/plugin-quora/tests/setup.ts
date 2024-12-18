import { beforeAll, afterAll, vi } from 'vitest';
import { IAgentRuntime, Memory } from '@ai16z/eliza';

export const mockRuntime: IAgentRuntime = {
    getSetting: vi.fn((key: string) => {
        switch (key) {
            case 'QUORA_USERNAME':
                return 'test_user';
            case 'QUORA_PASSWORD':
                return 'test_pass';
            default:
                return undefined;
        }
    }),
    // Add other required runtime methods as needed
};

export const mockMemory: Memory = {
    id: 'test-memory',
    roomId: 'test-room',
    timestamp: new Date(),
    user: 'test-user',
    content: {
        text: 'https://www.quora.com/What-is-the-meaning-of-life',
    },
};

beforeAll(() => {
    // Setup any global test configuration
});

afterAll(() => {
    // Cleanup after tests
});
