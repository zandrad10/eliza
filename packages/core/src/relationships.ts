import { IAgentRuntime, type Relationship, type UUID } from "./types.ts";

/**
 * * Creates a relationship between two users in the database.
 * 
 * @param {Object} params - The parameters for creating the relationship.
 * @param {IAgentRuntime} params.runtime - The runtime environment for the agent.
 * @param {UUID} params.userA - The UUID of the first user.
 * @param {UUID} params.userB - The UUID of the second user.
 * @returns {Promise<boolean>} - A promise that resolves to true if the relationship was successfully created.
 * /
 */
export async function createRelationship({
    runtime,
    userA,
    userB,
}: {
    runtime: IAgentRuntime;
    userA: UUID;
    userB: UUID;
}): Promise<boolean> {
    return runtime.databaseAdapter.createRelationship({
        userA,
        userB,
    });
}

/**
 * * Asynchronously retrieves the relationship between two users.
 * 
 * @param {Object} params - The parameters for retrieving the relationship.
 * @param {IAgentRuntime} params.runtime - The runtime object for the agent.
 * @param {UUID} params.userA - The UUID of user A.
 * @param {UUID} params.userB - The UUID of user B.
 * @returns {Promise} A promise that resolves with the relationship between the two users.
 * /
 */
export async function getRelationship({
    runtime,
    userA,
    userB,
}: {
    runtime: IAgentRuntime;
    userA: UUID;
    userB: UUID;
}) {
    return runtime.databaseAdapter.getRelationship({
        userA,
        userB,
    });
}

/**
 * * Asynchronously gets relationships for a specific user.
 * 
 * @param {Object} params - The parameters for getting relationships.
 * @param {IAgentRuntime} params.runtime - The agent runtime object.
 * @param {UUID} params.userId - The user ID to get relationships for.
 * @returns {Promise<Array>} The relationships for the specified user.
 * /
 */
export async function getRelationships({
    runtime,
    userId,
}: {
    runtime: IAgentRuntime;
    userId: UUID;
}) {
    return runtime.databaseAdapter.getRelationships({ userId });
}

/**
 * * Formats the relationships of a user by fetching the relationships using the runtime and userId provided.
 * Each relationship is mapped to return the other user ID involved in the relationship.
 * @param {Object} params - The parameters for formatting relationships.
 * @param {IAgentRuntime} params.runtime - The runtime object to use for fetching relationships.
 * @param {UUID} params.userId - The user ID for which relationships need to be formatted.
 * @returns {Array<UUID>} - The formatted relationships containing the user IDs of the other users involved.
 * /
 */
export async function formatRelationships({
    runtime,
    userId,
}: {
    runtime: IAgentRuntime;
    userId: UUID;
}) {
    const relationships = await getRelationships({ runtime, userId });

    const formattedRelationships = relationships.map(
        (relationship: Relationship) => {
            const { userA, userB } = relationship;

            if (userA === userId) {
                return userB;
            }

            return userA;
        }
    );

    return formattedRelationships;
}
