import { IAgentRuntime, State, type Memory } from "./types.ts";

/**
 * Formats provider outputs into a string which can be injected into the context.
 * @param runtime The AgentRuntime object.
 * @param message The incoming message object.
 * @param state The current state object.
 * @returns A string that concatenates the outputs of each provider.
 */
/**
 * * Retrieves providers' results and concatenates them into a single string with a newline separator.
 * @async
 * @param {IAgentRuntime} runtime - The agent runtime object.
 * @param {Memory} message - The message object.
 * @param {State} [state] - The optional state object.
 * @returns {Promise<string>} The concatenated results of the providers.
 * /
 */
export async function getProviders(
    runtime: IAgentRuntime,
    message: Memory,
    state?: State
) {
    const providerResults = (
        await Promise.all(
            runtime.providers.map(async (provider) => {
                return await provider.get(runtime, message, state);
            })
        )
    ).filter((result) => result != null && result !== "");

    return providerResults.join("\n");
}
