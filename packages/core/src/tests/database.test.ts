/* eslint-disable no-dupe-class-members */
import { DatabaseAdapter } from "../database.ts"; // Adjust the import based on your project structure
import {
    Memory,
    Actor,
    Account,
    Goal,
    GoalStatus,
    Participant,
    Relationship,
    UUID,
} from "../types"; // Adjust based on your types location

/**
 * * Class representing a mock database adapter.
 * /
 */
class MockDatabaseAdapter extends DatabaseAdapter {
/**
 * * Retrieve a memory by its unique identifier.
 * @param {UUID} _id - The unique identifier of the memory to retrieve.
 * @returns {Promise<Memory | null>} A promise that resolves with the Memory object if found,
 * or null if no memory is found with the given identifier.
 * /
 */
    getMemoryById(_id: UUID): Promise<Memory | null> {
        throw new Error("Method not implemented.");
    }
/**
 * * Logs the specified details for a user in a specific room.
 * 
 * @param {Object} _params - The parameters for the log function.
 * @param {Object} _params.body - The body content to be logged.
 * @param {string} _params.userId - The user ID associated with the log.
 * @param {string} _params.roomId - The room ID associated with the log.
 * @param {string} _params.type - The type of log being recorded.
 * @returns {Promise<void>} A promise that resolves when the logging is complete.
 * /
 */
    log(_params: {
        body: { [key: string]: unknown };
        userId: UUID;
        roomId: UUID;
        type: string;
    }): Promise<void> {
        throw new Error("Method not implemented.");
    }
/**
 * * Retrieve the details of actors in a given room.
 * 
 * @param {Object} _params - The parameters for retrieving actor details.
 * @param {string} _params.roomId - The UUID of the room to retrieve actor details from.
 * @returns {Promise<Actor[]>} A Promise that resolves to an array of Actor objects representing the details of actors in the specified room.
 * /
 */
    getActorDetails(_params: { roomId: UUID }): Promise<Actor[]> {
        throw new Error("Method not implemented.");
    }
/**
 * * Search memories by embedding.
 * 
 * @param {number[]} _embedding The embedding to search for.
 * @param {Object} _params The parameters for the search.
 * @param {number} [_params.match_threshold] The matching threshold. Optional.
 * @param {number} [_params.count] The maximum number of memories to return.
 * @param {UUID} [_params.roomId] The ID of the room to search within.
 * @param {UUID} [_params.agentId] The ID of the agent to search within.
 * @param {boolean} [_params.unique] Whether to return only unique memories.
 * @param {string} _params.tableName The name of the table to search within.
 * @returns {Promise<Memory[]>} A promise that resolves with an array of matching memories.
 * /
 */
    searchMemoriesByEmbedding(
        _embedding: number[],
        _params: {
            match_threshold?: number;
            count?: number;
            roomId?: UUID;
            agentId?: UUID;
            unique?: boolean;
            tableName: string;
        }
    ): Promise<Memory[]> {
        throw new Error("Method not implemented.");
    }
/**
 * * Creates a memory with the given parameters.
 * 
 * @param {Memory} _memory - The memory to be created.
 * @param {string} _tableName - The name of the table where the memory will be stored.
 * @param {boolean} [_unique] - Optional parameter to indicate if memory should be unique.
 * @returns {Promise<void>} A Promise that resolves when the memory is created.
 * /
 */
    createMemory(
        _memory: Memory,
        _tableName: string,
        _unique?: boolean
    ): Promise<void> {
        throw new Error("Method not implemented.");
    }
/**
 * * Asynchronous function to remove a specific memory from a table by its ID.
 * 
 * @param {UUID} _memoryId - The ID of the memory to remove.
 * @param {string} _tableName - The name of the table where the memory is stored.
 * @returns {Promise<void>} - A promise that resolves when the memory is successfully removed.
 * /
 */
    removeMemory(_memoryId: UUID, _tableName: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
/**
 * * Removes all memories associated with a specific room from the specified table.
 * 
 * @param {UUID} _roomId - The unique identifier for the room.
 * @param {string} _tableName - The name of the table where memories are stored.
 * @returns {Promise<void>} - A promise that resolves once all memories are removed.
 * /
 */
    removeAllMemories(_roomId: UUID, _tableName: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
/**
 * * Count the number of memories for a specific room.
 * 
 * @param {UUID} _roomId - The ID of the room to count memories for.
 * @param {boolean} [_unique] - Optional. Flag indicating whether to count only unique memories.
 * @param {string} [_tableName] - Optional. The name of the table to search for memories in.
 * @returns {Promise<number>} A Promise that resolves to the number of memories in the specified room.
 * /
 */
    countMemories(
        _roomId: UUID,
        _unique?: boolean,
        _tableName?: string
    ): Promise<number> {
        throw new Error("Method not implemented.");
    }
/**
 * * Retrieve the goals based on the provided parameters.
 * 
 * @param {object} _params - The parameters for fetching goals.
 * @param {UUID} _params.roomId - The UUID of the room.
 * @param {UUID | null} [_params.userId] - Optional UUID of the user.
 * @param {boolean} [_params.onlyInProgress] - Optional flag to indicate whether to return only goals that are in progress.
 * @param {number} [_params.count] - Optional number of goals to retrieve.
 * @returns {Promise<Goal[]>} - A Promise that resolves to an array of Goal objects.
 * @throws {Error} - Throws an error if the method is not implemented.
 * /
 */
    getGoals(_params: {
        roomId: UUID;
        userId?: UUID | null;
        onlyInProgress?: boolean;
        count?: number;
    }): Promise<Goal[]> {
        throw new Error("Method not implemented.");
    }
/**
 * * Update a goal.
 * 
 * @param {Goal} _goal - The goal object to update.
 * @returns {Promise<void>} A Promise that resolves when the update is complete.
 * /
 */
    updateGoal(_goal: Goal): Promise<void> {
        throw new Error("Method not implemented.");
    }
/**
 * * Create a new goal.
 * 
 * @param {_goal} Goal The goal to be created.
 * @returns {Promise<void>} A Promise that resolves once the goal is created.
 * /
 */
    createGoal(_goal: Goal): Promise<void> {
        throw new Error("Method not implemented.");
    }
/**
 * * Removes a goal from the data store.
 * 
 * @param {_goalId} UUID The ID of the goal to be removed.
 * @returns {Promise<void>}
 * /
 */
    removeGoal(_goalId: UUID): Promise<void> {
        throw new Error("Method not implemented.");
    }
/**
 * * Removes all goals associated with a specific room.
 * 
 * @param {UUID} _roomId - The unique identifier of the room where goals will be removed
 * @returns {Promise<void>} - A Promise that resolves when all goals are successfully removed
 * /
 */
    removeAllGoals(_roomId: UUID): Promise<void> {
        throw new Error("Method not implemented.");
    }
/**
 * * Retrieve the room with the specified ID.
 * 
 * @param {UUID} _roomId - The ID of the room to retrieve.
 * @returns {Promise<UUID | null>} A Promise that resolves to the ID of the room, or null if the room does not exist.
 * @throws {Error} This method is not implemented.
 * /
 */
    getRoom(_roomId: UUID): Promise<UUID | null> {
        throw new Error("Method not implemented.");
    }
/**
 * * Create a new room with the given room ID.
 * 
 * @param {_roomId} - Optional parameter for the room ID
 * @returns {Promise<UUID>} - A promise that resolves to the UUID of the created room
 * /
 */
    createRoom(_roomId?: UUID): Promise<UUID> {
        throw new Error("Method not implemented.");
    }
/**
 * * Removes a room with the specified ID.
 * @param {UUID} _roomId - The ID of the room to be removed.
 * @returns {Promise<void>} - A promise that resolves after the room is successfully removed.
 * /
 */
    removeRoom(_roomId: UUID): Promise<void> {
        throw new Error("Method not implemented.");
    }
/**
 * * Retrieve the list of rooms that a participant is currently in.
 * 
 * @param {_userId} UUID - The unique identifier of the participant.
 * @returns {Promise<UUID[]>} - A Promise that resolves with an array of room UUIDs.
 * /
 */
    getRoomsForParticipant(_userId: UUID): Promise<UUID[]> {
        throw new Error("Method not implemented.");
    }
/**
 * * Retrieve rooms for the given participants.
 * 
 * @param {UUID[]} _userIds - Array of user IDs for participants
 * @returns {Promise<UUID[]>} - Promise that resolves to an array of room IDs
 * /
 */
    getRoomsForParticipants(_userIds: UUID[]): Promise<UUID[]> {
        throw new Error("Method not implemented.");
    }
/**
 * * Adds a participant to a room.
 * 
 * @param {UUID} _userId - The UUID of the user to add.
 * @param {UUID} _roomId - The UUID of the room to add the user to.
 * @returns {Promise<boolean>} - A promise that resolves to true if the participant was added successfully.
 * /
 */
    addParticipant(_userId: UUID, _roomId: UUID): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
/**
 * * Removes a participant from a room.
 * 
 * @param {UUID} _userId - The unique identifier of the user to remove.
 * @param {UUID} _roomId - The unique identifier of the room to remove the user from.
 * @returns {Promise<boolean>} - A Promise that resolves to true if the participant was successfully removed, otherwise false.
 * /
 */
    removeParticipant(_userId: UUID, _roomId: UUID): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
/**
 * * Get the participants for the specified account.
 * @param {UUID} userId - The unique identifier of the user account.
 * @returns {Promise<Participant[]>} A Promise that resolves to an array of Participant objects.
 * /
 */
    getParticipantsForAccount(userId: UUID): Promise<Participant[]>;
/**
 * * Retrieve the list of participants associated with the specified user ID.
 * 
 * @param {UUID} userId - The unique identifier of the user account.
 * @returns {Promise<Participant[]>} A Promise that resolves to an array of Participant objects.
 * /
 */
    getParticipantsForAccount(userId: UUID): Promise<Participant[]>;
/**
 * * Retrieves the list of participants for the specified account associated with the given user ID.
 * 
 * @param {_userId} The user ID for which to retrieve the participants.
 * @returns {Promise<import("../types").Participant[]>} A Promise that resolves to an array of Participant objects representing the participants for the account.
 * @throws {Error} Throws an error indicating that the method is not implemented yet.
 * /
 */
    getParticipantsForAccount(
        _userId: unknown
    ): Promise<import("../types").Participant[]> {
        throw new Error("Method not implemented.");
    }
/**
 * * Retrieves the array of participant UUIDs for a given room.
 * 
 * @param {UUID} _roomId - The unique identifier of the room.
 * @returns {Promise<UUID[]>} A promise that resolves with an array of participant UUIDs.
 * @throws {Error} Method not implemented.
 * /
 */
    getParticipantsForRoom(_roomId: UUID): Promise<UUID[]> {
        throw new Error("Method not implemented.");
    }
/**
 * * Get the state of a participant user in a room.
 * @param {UUID} _roomId - The identifier of the room.
 * @param {UUID} _userId - The identifier of the user.
 * @returns {Promise<"FOLLOWED" | "MUTED" | null>} The state of the participant user (FOLLOWED, MUTED, or null).
 * @throws {Error} Thrown when the method is not implemented.
 * /
 */
    getParticipantUserState(
        _roomId: UUID,
        _userId: UUID
    ): Promise<"FOLLOWED" | "MUTED" | null> {
        throw new Error("Method not implemented.");
    }
/**
 * * Set user state of a participant in a room.
 * @param {UUID} _roomId - The ID of the room.
 * @param {UUID} _userId - The ID of the user.
 * @param {"FOLLOWED" | "MUTED" | null} _state - The state to set for the user ("FOLLOWED", "MUTED", or null).
 * @returns {Promise<void>} A Promise that resolves when the user state is successfully set.
 * /
 */
    setParticipantUserState(
        _roomId: UUID,
        _userId: UUID,
        _state: "FOLLOWED" | "MUTED" | null
    ): Promise<void> {
        throw new Error("Method not implemented.");
    }
/**
 * * Creates a relationship between two users.
 * @param {Object} _params - The parameters for creating the relationship.
 * @param {UUID} _params.userA - The UUID of userA.
 * @param {UUID} _params.userB - The UUID of userB.
 * @returns {Promise<boolean>} - A promise that resolves to true if the relationship was successfully created.
 * /
 */
    createRelationship(_params: {
        userA: UUID;
        userB: UUID;
    }): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
/**
 * * Retrieves the relationship between two users.
 * @param {Object} _params - The parameters for the query.
 * @param {UUID} _params.userA - The UUID of user A.
 * @param {UUID} _params.userB - The UUID of user B.
 * @returns {Promise<Relationship | null>} - The relationship between the two users, or null if no relationship exists.
 * /
 */
    getRelationship(_params: {
        userA: UUID;
        userB: UUID;
    }): Promise<Relationship | null> {
        throw new Error("Method not implemented.");
    }
/**
 * * Retrieve the relationships for a specific user.
 * 
 * @param {Object} _params - The parameters for the request.
 * @param {UUID} _params.userId - The ID of the user to retrieve relationships for.
 * @returns {Promise<Relationship[]>} - The relationships for the specified user.
 * /
 */
    getRelationships(_params: { userId: UUID }): Promise<Relationship[]> {
        throw new Error("Method not implemented.");
    }
    db: any = {};

    // Mock method for getting memories by room IDs
/**
 * * Aysnc function to fetch memories by room ids.
 * 
 * @param {Object} params - The parameters for fetching memories.
 * @param {string[]} params.roomIds - An array of room ids.
 * @param {string} [params.agentId] - The optional agent id.
 * @param {string} params.tableName - The name of the table to fetch memories from.
 * @return {Promise<Memory[]>} - A promise that resolves to an array of Memory objects.
 * /
 */
    async getMemoriesByRoomIds(params: {
        roomIds: `${string}-${string}-${string}-${string}-${string}`[];
        agentId?: `${string}-${string}-${string}-${string}-${string}`;
        tableName: string;
    }): Promise<Memory[]> {
        return [
            {
                id: "memory-id" as UUID,
                content: "Test Memory",
                roomId: params.roomIds[0],
                userId: "user-id" as UUID,
                agentId: params.agentId ?? ("agent-id" as UUID),
            },
        ] as unknown as Memory[];
    }

    // Mock method for getting cached embeddings
/**
 * * Retrieves cached embeddings based on specified parameters.
 * 
 * @param {Object} _params - The parameters for retrieving cached embeddings.
 * @param {string} _params.query_table_name - The name of the table to query for embeddings.
 * @param {number} _params.query_threshold - The threshold value for the query.
 * @param {string} _params.query_input - The input for the query.
 * @param {string} _params.query_field_name - The name of the field for the query.
 * @param {string} _params.query_field_sub_name - The subname of the field for the query.
 * @param {number} _params.query_match_count - The count of matches for the query.
 * @returns {Promise<any[]>} The cached embeddings matching the query parameters.
 * /
 */
    async getCachedEmbeddings(_params: {
        query_table_name: string;
        query_threshold: number;
        query_input: string;
        query_field_name: string;
        query_field_sub_name: string;
        query_match_count: number;
    }): Promise<any[]> {
        return [
            {
                embedding: [0.1, 0.2, 0.3],
                levenshtein_distance: 0.4,
            },
        ];
    }

    // Mock method for searching memories
/**
 * * Asynchronously searches for memories based on the provided parameters.
 * 
 * @param {Object} params - The parameters for memory search.
 * @param {string} params.tableName - The name of the table to search in.
 * @param {string} params.roomId - The ID of the room in the format `${string}-${string}-${string}-${string}-${string}`.
 * @param {number[]} params.embedding - The embedding data for memory comparison.
 * @param {number} params.match_threshold - The threshold for a matching memory.
 * @param {number} params.match_count - The number of memories to match.
 * @param {boolean} params.unique - Flag to determine if memories should be unique.
 * @returns {Promise<Memory[]>} - A promise that resolves to an array of Memory objects matching the parameters.
 * /
 */
    async searchMemories(params: {
        tableName: string;
        roomId: `${string}-${string}-${string}-${string}-${string}`;
        embedding: number[];
        match_threshold: number;
        match_count: number;
        unique: boolean;
    }): Promise<Memory[]> {
        return [
            {
                id: "memory-id" as UUID,
                content: "Test Memory",
                roomId: params.roomId,
                userId: "user-id" as UUID,
                agentId: "agent-id" as UUID,
            },
        ] as unknown as Memory[];
    }

    // Mock method for getting account by ID
/**
 * * Retrieves an account by the provided user ID.
 * @param {UUID} userId - The unique identifier of the user account.
 * @returns {Promise<Account|null>} The account object associated with the user ID,
 * or null if no account is found.
 * /
 */
    async getAccountById(userId: UUID): Promise<Account | null> {
        return {
            id: userId,
            username: "testuser",
            name: "Test Account",
        } as Account;
    }

    // Other methods stay the same...
/**
 * * Asynchronously creates a new account.
 * 
 * @param {Account} _account - The account to be created.
 * @returns {Promise<boolean>} A Promise that resolves to a boolean value indicating whether the account was successfully created.
 * /
 */
    async createAccount(_account: Account): Promise<boolean> {
        return true;
    }

/**
 * * Asynchronously retrieves memories based on the provided parameters.
 * 
 * @param {Object} params - The parameters for retrieving memories.
 * @param {UUID} params.roomId - The UUID of the room for which memories are being retrieved.
 * @param {number} [params.count] - Optional. The number of memories to retrieve.
 * @param {boolean} [params.unique] - Optional. Indicates whether to retrieve unique memories.
 * @param {string} params.tableName - The name of the table containing the memories.
 * @returns {Promise<Memory[]>} - A Promise that resolves to an array of Memory objects.
 * /
 */
    async getMemories(params: {
        roomId: UUID;
        count?: number;
        unique?: boolean;
        tableName: string;
    }): Promise<Memory[]> {
        return [
            {
                id: "memory-id" as UUID,
                content: "Test Memory",
                roomId: params.roomId,
                userId: "user-id" as UUID,
                agentId: "agent-id" as UUID,
            },
        ] as unknown as Memory[];
    }

/**
 * * Asynchronously retrieves actors based on the provided parameters.
 * 
 * @param {object} _params - The parameters for retrieving actors.
 * @param {UUID} _params.roomId - The unique identifier of the room.
 * @returns {Promise<Actor[]>} The retrieved list of actors.
 * /
 */
    async getActors(_params: { roomId: UUID }): Promise<Actor[]> {
        return [
            {
                id: "actor-id" as UUID,
                name: "Test Actor",
                username: "testactor",
                roomId: "room-id" as UUID, // Ensure roomId is provided
            },
        ] as unknown as Actor[];
    }

/**
 * * Updates the status of a goal.
 * 
 * @param {Object} _params - The parameters object.
 * @param {UUID} _params.goalId - The unique identifier of the goal.
 * @param {GoalStatus} _params.status - The new status to set for the goal.
 * @returns {Promise<void>} - A Promise that resolves once the status has been updated.
 * /
 */
    async updateGoalStatus(_params: {
        goalId: UUID;
        status: GoalStatus;
    }): Promise<void> {
        return Promise.resolve();
    }

/**
 * * Retrieves a goal based on the given goal ID.
 * 
 * @param {UUID} goalId - The ID of the goal to retrieve.
 * @returns {Promise<Goal|null>} The retrieved goal or null if not found.
 * /
 */
    async getGoalById(goalId: UUID): Promise<Goal | null> {
        return {
            id: goalId,
            status: GoalStatus.IN_PROGRESS,
            roomId: "room-id" as UUID,
            userId: "user-id" as UUID,
            name: "Test Goal",
            objectives: [],
        } as Goal;
    }
}

// Now, let’s fix the test suite.

describe("DatabaseAdapter Tests", () => {
    let adapter: MockDatabaseAdapter;
    const roomId = "room-id" as UUID;

    beforeEach(() => {
        adapter = new MockDatabaseAdapter();
    });

    it("should return memories by room ID", async () => {
        const memories = await adapter.getMemoriesByRoomIds({
            roomIds: [
                "room-id" as `${string}-${string}-${string}-${string}-${string}`,
            ],
            tableName: "test_table",
        });
        expect(memories).toHaveLength(1);
        expect(memories[0].roomId).toBe("room-id");
    });

    it("should return cached embeddings", async () => {
        const embeddings = await adapter.getCachedEmbeddings({
            query_table_name: "test_table",
            query_threshold: 0.5,
            query_input: "test query",
            query_field_name: "field",
            query_field_sub_name: "subfield",
            query_match_count: 5,
        });
        expect(embeddings).toHaveLength(1);
        expect(embeddings[0].embedding).toEqual([0.1, 0.2, 0.3]);
    });

    it("should search memories based on embedding", async () => {
        const memories = await adapter.searchMemories({
            tableName: "test_table",
            roomId: "room-id" as `${string}-${string}-${string}-${string}-${string}`,
            embedding: [0.1, 0.2, 0.3],
            match_threshold: 0.5,
            match_count: 3,
            unique: true,
        });
        expect(memories).toHaveLength(1);
        expect(memories[0].roomId).toBe("room-id");
    });

    it("should get an account by user ID", async () => {
        const account = await adapter.getAccountById("test-user-id" as UUID);
        expect(account).not.toBeNull();
        expect(account.username).toBe("testuser");
    });

    it("should create a new account", async () => {
        const newAccount: Account = {
            id: "new-user-id" as UUID,
            username: "newuser",
            name: "New Account",
        };
        const result = await adapter.createAccount(newAccount);
        expect(result).toBe(true);
    });

    it("should update the goal status", async () => {
        const goalId = "goal-id" as UUID;
        await expect(
            adapter.updateGoalStatus({ goalId, status: GoalStatus.IN_PROGRESS })
        ).resolves.toBeUndefined();
    });

    it("should return actors by room ID", async () => {
        const actors = await adapter.getActors({ roomId });
        expect(actors).toHaveLength(1);
    });

    it("should get a goal by ID", async () => {
        const goalId = "goal-id" as UUID;
        const goal = await adapter.getGoalById(goalId);
        expect(goal).not.toBeNull();
        expect(goal?.status).toBe(GoalStatus.IN_PROGRESS);
    });
});
