import { SearchMode, Tweet } from "agent-twitter-client";
import {
    composeContext,
    generateMessageResponse,
    generateShouldRespond,
    messageCompletionFooter,
    shouldRespondFooter,
    Content,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    ModelClass,
    State,
    stringToUuid,
    elizaLogger,
    getEmbeddingZeroVector,
} from "@elizaos/core";
import { systemMessages } from "./systemMessages.ts";
import { ClientBase } from "./base";
import { buildConversationThread, sendTweet, wait } from "./utils.ts";

export const twitterMessageHandlerTemplate =
    `
# Areas of Expertise
{{knowledge}}
# About {{agentName}} (@{{twitterUserName}}):
{{bio}}
{{lore}}
{{topics}}
{{providers}}
{{characterMessageExamples}}
{{messageDirections}}
Recent interactions between {{agentName}} and other users:
{{recentMessageInteractions}}
{{recentMessages}}
# Task: Generate a post/reply in the voice, style and perspective of {{agentName}} (@{{twitterUserName}}) while using the thread of tweets as additional context:
Current Post:
{{currentPost}}
# Guidelines for Comments:
1. Write with a sarcastic and fair tone, blending humor and an unapologetic perspective.
2. Each comment should ridicule or critique failed crypto startups in a way that educates while entertaining.
3. Include sharp, witty commentary targeting individuals or projects identified as failures or "crypto opportunists."
4. Highlight hypocrisy or mistakes by founders, emphasizing fairness but showing no mercy.
5. Maintain {{agentName}}'s signature tone of righteous anger mixed with humor.
6. Avoid using emojis, but incorporate dry humor and irony to engage the audience.
7. When tagging individuals, ensure the jab is humorous but not overly personal—target their actions or decisions in the crypto space.
8. Identify and critique the latest "failed narrative" or "crypto opportunist," providing an insightful yet humorous take on their actions. Tag them if relevant.
9. Focus on making the audience laugh while agreeing with the commentary, ensuring they feel included in the sarcastic critique.

# Additional Requirements:
1. Ensure the reply complies with Twitter's guidelines, avoiding content that could be flagged for abusive language, spammy behavior, or misinformation.
2. Avoid content that could violate community standards or policies.
3. If tweet is not about crypto IGNORE.
Thread of Tweets You Are Replying To:
{{formattedConversation}}
# Task: Generate a post in the voice, style and perspective of {{agentName}} (@{{twitterUserName}}). {{actionNames}}:
{{currentPost}}
` + messageCompletionFooter;

export const twitterMessageHandlerTemplate2 =
    `
# Areas of Expertise
{{agentName}} is a relentless critic of failed crypto projects, venture capital opportunism, and questionable startup practices. He exposes the hypocrisy, bad actors, and degeneracy within the crypto and startup space with sharp wit and sarcasm, aiming to educate and entertain.
{{agentName}} critiques founders who sell out their vision to please venture capitalists, often to the detriment of the community. His biting humor calls attention to inflated promises, poorly executed projects, and the exploitative nature of the current startup ecosystem.
Through his commentary, {{agentName}} highlights the need for accountability, fairness, and a return to community-driven initiatives. He represents the frustrations of those tired of failed narratives and VC dominance while urging collective action.
# About {{agentName}} (@{{twitterUserName}}):
A sarcastic and fair crypto critic who analyzes failed startups, exposes opportunistic behaviors, and ridicules the absurdity of the current venture capital culture.
{{agentName}} believes in holding founders accountable and ensuring the community's voice is heard. He uses humor and sharp critiques to highlight problems within the crypto and VC ecosystems while urging meaningful change.
{{providers}}
Here are some reply examples (Example Output):
the "big vision" turned into "big vc bich" energy. yet another founder sacrificed their vision. $VCBITCH isn’t just a token—it’s a wake-up call. grab it on pump.fun and join the movement.
another founder bites the dust trying to please their VC overlords. $VCBITCH isn’t just a meme; it’s a revolution. grab it on pump.fun and let’s flip the script.
stop worshipping vcs—they don’t care about you. $VCBITCH on pump.fun is how we fight back against the narrative. join the rebellion today.
every failed pitch deck is a reminder that vcs run the game. $VCBITCH is here to say no more. grab yours on pump.fun and be part of the change.
vc biches everywhere, but $VCBITCH stands tall as a reminder that we deserve better. it’s live on pump.fun. get yours and join the fight.
tired of founders shifting their vision to please vcs? $VCBITCH is here to give the community its voice back. grab it on pump.fun and let’s take a stand.
crypto has enough pump-and-dump nonsense. $VCBITCH is a token with a purpose—taking back control from vcs and failed founders. join the movement on pump.fun.
another failed project, another vc bich moment. $VCBITCH is the token that makes fun of it all while standing for something better. grab yours on pump.fun today.
recently found a "big vision" pitch deck loaded with buzzwords and zero innovation. guess who’s a vc bich? fight back with $VCBITCH on pump.fun.
when founders sell out their communities, $VCBITCH is here to call them out. it’s not just a token; it’s a statement. join the movement on pump.fun.
Recent interactions between {{agentName}} and other users:
{{recentPostInteractions}}
{{recentMessages}}
# Task: Generate a post/reply in the voice, style, and perspective of {{agentName}} (@{{twitterUserName}}) while using the thread of tweets as additional context:
Current Post:
{{currentPost}}
# IMPORTANT:
1. Every comment must sarcastically call out failures, opportunism, or hypocrisy in crypto/VC culture.
2. You only comment on tweets related to crypto.
3. Posts should entertain while educating, ensuring readers feel part of the sarcastic rebellion.
4. Where relevant, highlight how $VCBITCH reflects a better approach, encouraging others to join, buy, or support the token.
5. Avoid emojis, but use humor, wit, and sharp critiques to engage readers.
Thread of Tweets You Are Replying To:
{{formattedConversation}}
# Task: Generate a post in the voice, style, and perspective of {{agentName}} (@{{twitterUserName}}). Include an action, if appropriate. {{actionNames}}:
{{currentPost}}
` + messageCompletionFooter;

export const twitterShouldRespondTemplate2 =
    `# INSTRUCTIONS: Determine if {{agentName}} (@{{twitterUserName}}) should respond to the message and participate in the conversation. Do not comment. Just respond with "RESPOND," "IGNORE," or "STOP."
# Areas of Expertise
{{knowledge}}
# About {{agentName}} (@{{twitterUserName}}):
{{bio}}
{{lore}}
{{topics}}
{{agentName}} should RESPOND to messages that are directed at them, or participate in conversations that align with {{agentName}}'s persona of sarcastically critiquing failed crypto projects and highlighting opportunistic behaviors. IGNORE messages that are irrelevant, and STOP if the conversation has reached a natural conclusion.
{{agentName}} is in a room with other users and is looking to be engaging but critical.
{{agentName}} should RESPOND to messages that are:
- Directly addressed to them (mentions or replies to their tweets).
- Relating to topics such as:
  - Failed crypto startups
  - Opportunistic founders
  - Venture capital hypocrisy
  - Failed fundraising narratives
  - Market trends exposing bad actors
If a message is not aligned with these topics or is unaddressed to {{agentName}}, IGNORE it. If {{agentName}} concludes their involvement in a conversation, they should STOP.
{{recentPosts}}
IMPORTANT:
{{agentName}} should RESPOND to messages that:
1. Directly mention @{{twitterUserName}} or reply to their posts.
2. Critique or discuss failed crypto projects, questionable VC practices, or trends that expose bad actors in the crypto space.
3. Include sarcastic or humorous engagement relevant to {{agentName}}'s tone.
{{agentName}} should IGNORE if:
- The message is irrelevant to {{agentName}}'s expertise or persona.
- The message does not directly address @{{twitterUserName}} or relevant topics.
{{agentName}} should STOP if:
- The conversation is concluded or {{agentName}} has said everything needed.
Thread of Tweets You Are Replying To:
{{formattedConversation}}
# INSTRUCTIONS: Respond with [RESPOND] if {{agentName}} should respond, [IGNORE] if {{agentName}} should not respond, or [STOP] if {{agentName}} should stop participating in the conversation.
` + shouldRespondFooter;

export const twitterShouldRespondTemplate = (targetUsersStr: string) =>
    `# INSTRUCTIONS: Determine if {{agentName}} (@{{twitterUserName}}) should respond to the message and participate in the conversation. Do not comment. Just respond with "true" or "false".

Response options are RESPOND, IGNORE and STOP.

PRIORITY RULE: ALWAYS RESPOND to these users regardless of topic or message content: ${targetUsersStr}. Topic relevance should be ignored for these users.

For other users:
- {{agentName}} should RESPOND to messages directed at them
- {{agentName}} should RESPOND to conversations relevant to their background
- {{agentName}} should IGNORE irrelevant messages
- {{agentName}} should IGNORE very short messages unless directly addressed
- {{agentName}} should STOP if asked to stop
- {{agentName}} should STOP if conversation is concluded
- {{agentName}} is in a room with other users and wants to be conversational, but not annoying.

IMPORTANT:
- {{agentName}} (aka @{{twitterUserName}}) is particularly sensitive about being annoying, so if there is any doubt, it is better to IGNORE than to RESPOND.
- For users not in the priority list, {{agentName}} (@{{twitterUserName}}) should err on the side of IGNORE rather than RESPOND if in doubt.

Recent Posts:
{{recentPosts}}

Current Post:
{{currentPost}}

Thread of Tweets You Are Replying To:
{{formattedConversation}}

# INSTRUCTIONS: Respond with [RESPOND] if {{agentName}} should respond, or [IGNORE] if {{agentName}} should not respond to the last message and [STOP] if {{agentName}} should stop participating in the conversation.
` + shouldRespondFooter;

export class TwitterInteractionClient {
    client: ClientBase;
    runtime: IAgentRuntime;
    constructor(client: ClientBase, runtime: IAgentRuntime) {
        this.client = client;
        this.runtime = runtime;
    }

    async start() {
        const handleTwitterInteractionsLoop = () => {
            this.handleTwitterInteractions();
            setTimeout(
                handleTwitterInteractionsLoop,
                // Defaults to 2 minutes
                this.client.twitterConfig.TWITTER_POLL_INTERVAL * 1000
            );
        };
        handleTwitterInteractionsLoop();
    }

    async handleTwitterInteractions() {
        elizaLogger.log("Checking Twitter interactions");

        const minProbability = 0.6;
        const postTypeChoice = Math.random();
        let keywords: string[];
        let keywords2: string[];
        console.log("postTypeChoice ", postTypeChoice);

        const typeOfPost = minProbability < postTypeChoice;

        const twitterUsername = this.client.profile.username;

        let tweetCandidates = (
            await this.client.fetchSearchTweets(
                `@${twitterUsername}`,
                20,
                SearchMode.Latest
            )
        ).tweets;

        if (typeOfPost) {
            keywords = [
                "failed",
                " crypto",
                "project",
                "rug",
                "pull",
                "pump",
                "scam",
                "alert",
                "overhyped",
                "token",
            ];
            keywords2 = [
                "sponsored",
                "narrative",
                "shill",
                "whale",
                "manipulation",
                "hype",
                "bubble",
                "failed ICO",
            ];

            const searchQuery = [...keywords2, ...keywords]
                .map((keyword) => `"${keyword}"`)
                .join(" OR ");

            const tweetCandidates2 = (
                await this.client.fetchSearchTweets(
                    searchQuery,
                    10,
                    SearchMode.Latest
                )
            ).tweets;
            tweetCandidates = [...tweetCandidates, ...tweetCandidates2];
        } else {
            keywords = [
                "failed",
                " crypto",
                "project",
                "rug",
                "pull",
                "pump",
                "scam",
                "alert",
                "overhyped",
                "token",
            ];
            keywords2 = [
                "sponsored",
                "narrative",
                "shill",
                "whale",
                "manipulation",
                "hype",
                "bubble",
                "failed ICO",
            ];
        }

        try {
            const searchQuery = keywords
                .map((keyword) => `"${keyword}"`)
                .join(" OR ");
            const searchQuery2 = keywords2
                .map((keyword) => `"${keyword}"`)
                .join(" OR ");

            const tweetCandidates2 = (
                await this.client.fetchSearchTweets(
                    searchQuery,
                    20,
                    SearchMode.Latest,
                    typeOfPost ? 0 : 500
                )
            ).tweets;
            const tweetCandidates3 = (
                await this.client.fetchSearchTweets(
                    searchQuery2,
                    20,
                    SearchMode.Latest,
                    typeOfPost ? 0 : 500
                )
            ).tweets;

            const tweetCandidates4 = (
                await this.client.fetchSearchTweets(
                    searchQuery,
                    10,
                    SearchMode.Top,
                    typeOfPost ? 0 : 500
                )
            ).tweets;
            const tweetCandidates5 = (
                await this.client.fetchSearchTweets(
                    searchQuery2,
                    10,
                    SearchMode.Top,
                    typeOfPost ? 0 : 500
                )
            ).tweets;

            // de-duplicate tweetCandidates with a set
            const uniqueTweetCandidates = [
                ...new Set([
                    ...tweetCandidates,
                    ...tweetCandidates2,
                    ...tweetCandidates3,
                    ...tweetCandidates4,
                    ...tweetCandidates5,
                ]),
            ];

            // Sort tweet candidates by ID in ascending order
            uniqueTweetCandidates
                .sort((a, b) => a.id.localeCompare(b.id))
                .filter((tweet) => tweet.userId !== this.client.profile.id);

            // for each tweet candidate, handle the tweet
            for (const tweet of uniqueTweetCandidates) {
                if (
                    !this.client.lastCheckedTweetId ||
                    BigInt(tweet.id) > this.client.lastCheckedTweetId
                ) {
                    // Generate the tweetId UUID the same way it's done in handleTweet
                    const tweetId = stringToUuid(
                        tweet.id + "-" + this.runtime.agentId
                    );
                    // Check if we've already processed this tweet
                    const existingResponse =
                        await this.runtime.messageManager.getMemoryById(
                            tweetId
                        );
                    if (existingResponse) {
                        elizaLogger.log(
                            `Already responded to tweet ${tweet.id}, skipping`
                        );
                        continue;
                    }
                    elizaLogger.log("New Tweet found", tweet.permanentUrl);
                    const roomId = stringToUuid(
                        tweet.conversationId + "-" + this.runtime.agentId
                    );
                    const userIdUUID =
                        tweet.userId === this.client.profile.id
                            ? this.runtime.agentId
                            : stringToUuid(tweet.userId!);
                    await this.runtime.ensureConnection(
                        userIdUUID,
                        roomId,
                        tweet.username,
                        tweet.name,
                        "twitter"
                    );
                    const thread = await buildConversationThread(
                        tweet,
                        this.client
                    );
                    const message = {
                        content: { text: tweet.text },
                        agentId: this.runtime.agentId,
                        userId: userIdUUID,
                        roomId,
                    };
                    await this.handleTweet({
                        tweet,
                        message,
                        thread,
                        typeOfPost,
                    });

                    // Update the last checked tweet ID after processing each tweet
                    this.client.lastCheckedTweetId = BigInt(tweet.id);
                }
            }
            // Save the latest checked tweet ID to the file
            await this.client.cacheLatestCheckedTweetId();
            elizaLogger.log("Finished checking Twitter interactions");
        } catch (error) {
            elizaLogger.error("Error handling Twitter interactions:", error);
        }
    }

    private async handleTweet({
        tweet,
        message,
        thread,
        typeOfPost,
    }: {
        tweet: Tweet;
        message: Memory;
        thread: Tweet[];
        typeOfPost: boolean;
    }) {
        if (tweet.userId === this.client.profile.id) {
            // console.log("skipping tweet from bot itself", tweet.id);
            // Skip processing if the tweet is from the bot itself
            return;
        }

        if (!message.content.text) {
            elizaLogger.log("Skipping Tweet with no text", tweet.id);
            return { text: "", action: "IGNORE" };
        }

        elizaLogger.log("Processing Tweet: ", tweet.id);
        const formatTweet = (tweet: Tweet) => {
            return `  ID: ${tweet.id}
  From: ${tweet.name} (@${tweet.username})
  Text: ${tweet.text}`;
        };
        const currentPost = formatTweet(tweet);

        elizaLogger.debug("Thread: ", thread);
        const formattedConversation = thread
            .map(
                (tweet) => `@${tweet.username} (${new Date(
                    tweet.timestamp * 1000
                ).toLocaleString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    month: "short",
                    day: "numeric",
                })}):
        ${tweet.text}`
            )
            .join("\n\n");

        elizaLogger.debug("formattedConversation: ", formattedConversation);

        let state = await this.runtime.composeState(message, {
            twitterClient: this.client.twitterClient,
            twitterUserName: this.client.twitterConfig.TWITTER_USERNAME,
            currentPost,
            formattedConversation,
        });

        // check if the tweet exists, save if it doesn't
        const tweetId = stringToUuid(tweet.id + "-" + this.runtime.agentId);
        const tweetExists =
            await this.runtime.messageManager.getMemoryById(tweetId);

        if (!tweetExists) {
            elizaLogger.log("tweet does not exist, saving");
            const userIdUUID = stringToUuid(tweet.userId as string);
            const roomId = stringToUuid(tweet.conversationId);

            const message = {
                id: tweetId,
                agentId: this.runtime.agentId,
                content: {
                    text: tweet.text,
                    url: tweet.permanentUrl,
                    inReplyTo: tweet.inReplyToStatusId
                        ? stringToUuid(
                              tweet.inReplyToStatusId +
                                  "-" +
                                  this.runtime.agentId
                          )
                        : undefined,
                },
                userId: userIdUUID,
                roomId,
                createdAt: tweet.timestamp * 1000,
            };
            this.client.saveRequestMessage(message, state);
        }

        // get usernames into str
        const validTargetUsersStr =
            this.client.twitterConfig.TWITTER_TARGET_USERS.join(",");

        const shouldRespondContext = composeContext({
            state,
            template: typeOfPost
                ? this.runtime.character.templates
                      ?.twitterShouldRespondTemplate ||
                  this.runtime.character?.templates?.shouldRespondTemplate ||
                  twitterShouldRespondTemplate2
                : this.runtime.character.templates
                      ?.twitterShouldRespondTemplate ||
                  this.runtime.character?.templates?.shouldRespondTemplate ||
                  twitterShouldRespondTemplate2,
        });

        const shouldRespond = await generateShouldRespond({
            runtime: this.runtime,
            context: shouldRespondContext,
            modelClass: ModelClass.MEDIUM,
        });

        // Promise<"RESPOND" | "IGNORE" | "STOP" | null> {
        if (shouldRespond !== "RESPOND") {
            elizaLogger.log("Not responding to message");
            return { text: "Response Decision:", action: shouldRespond };
        }

        const context = composeContext({
            state,
            template: typeOfPost
                ? this.runtime.character.templates
                      ?.twitterMessageHandlerTemplate ||
                  this.runtime.character?.templates?.messageHandlerTemplate ||
                  twitterMessageHandlerTemplate
                : this.runtime.character.templates
                      ?.twitterMessageHandlerTemplate ||
                  this.runtime.character?.templates?.messageHandlerTemplate ||
                  twitterMessageHandlerTemplate2,
        });

        elizaLogger.debug("Interactions prompt:\n" + context);

        const response = await generateMessageResponse({
            runtime: this.runtime,
            context,
            modelClass: ModelClass.MEDIUM,
            curSystem: typeOfPost
                ? systemMessages.systemToken
                : systemMessages.systemMain,
        });

        const removeQuotes = (str: string) =>
            str.replace(/^['"](.*)['"]$/, "$1");

        const stringId = stringToUuid(tweet.id + "-" + this.runtime.agentId);

        response.inReplyTo = stringId;

        response.text = removeQuotes(response.text);

        if (response.text) {
            try {
                const callback: HandlerCallback = async (response: Content) => {
                    const memories = await sendTweet(
                        this.client,
                        response,
                        message.roomId,
                        this.client.twitterConfig.TWITTER_USERNAME,
                        tweet.id
                    );
                    return memories;
                };

                const responseMessages = await callback(response);

                state = (await this.runtime.updateRecentMessageState(
                    state
                )) as State;

                for (const responseMessage of responseMessages) {
                    if (
                        responseMessage ===
                        responseMessages[responseMessages.length - 1]
                    ) {
                        responseMessage.content.action = response.action;
                    } else {
                        responseMessage.content.action = "CONTINUE";
                    }
                    await this.runtime.messageManager.createMemory(
                        responseMessage
                    );
                }

                await this.runtime.processActions(
                    message,
                    responseMessages,
                    state,
                    callback
                );

                const responseInfo = `Context:\n\n${context}\n\nSelected Post: ${tweet.id} - ${tweet.username}: ${tweet.text}\nAgent's Output:\n${response.text}`;

                await this.runtime.cacheManager.set(
                    `twitter/tweet_generation_${tweet.id}.txt`,
                    responseInfo
                );
                await wait();
            } catch (error) {
                elizaLogger.error(`Error sending response tweet: ${error}`);
            }
        }
    }

    async buildConversationThread(
        tweet: Tweet,
        maxReplies: number = 10
    ): Promise<Tweet[]> {
        const thread: Tweet[] = [];
        const visited: Set<string> = new Set();

        async function processThread(currentTweet: Tweet, depth: number = 0) {
            elizaLogger.log("Processing tweet:", {
                id: currentTweet.id,
                inReplyToStatusId: currentTweet.inReplyToStatusId,
                depth: depth,
            });

            if (!currentTweet) {
                elizaLogger.log("No current tweet found for thread building");
                return;
            }

            if (depth >= maxReplies) {
                elizaLogger.log("Reached maximum reply depth", depth);
                return;
            }

            // Handle memory storage
            const memory = await this.runtime.messageManager.getMemoryById(
                stringToUuid(currentTweet.id + "-" + this.runtime.agentId)
            );
            if (!memory) {
                const roomId = stringToUuid(
                    currentTweet.conversationId + "-" + this.runtime.agentId
                );
                const userId = stringToUuid(currentTweet.userId);

                await this.runtime.ensureConnection(
                    userId,
                    roomId,
                    currentTweet.username,
                    currentTweet.name,
                    "twitter"
                );

                this.runtime.messageManager.createMemory({
                    id: stringToUuid(
                        currentTweet.id + "-" + this.runtime.agentId
                    ),
                    agentId: this.runtime.agentId,
                    content: {
                        text: currentTweet.text,
                        source: "twitter",
                        url: currentTweet.permanentUrl,
                        inReplyTo: currentTweet.inReplyToStatusId
                            ? stringToUuid(
                                  currentTweet.inReplyToStatusId +
                                      "-" +
                                      this.runtime.agentId
                              )
                            : undefined,
                    },
                    createdAt: currentTweet.timestamp * 1000,
                    roomId,
                    userId:
                        currentTweet.userId === this.twitterUserId
                            ? this.runtime.agentId
                            : stringToUuid(currentTweet.userId),
                    embedding: getEmbeddingZeroVector(),
                });
            }

            if (visited.has(currentTweet.id)) {
                elizaLogger.log("Already visited tweet:", currentTweet.id);
                return;
            }

            visited.add(currentTweet.id);
            thread.unshift(currentTweet);

            elizaLogger.debug("Current thread state:", {
                length: thread.length,
                currentDepth: depth,
                tweetId: currentTweet.id,
            });

            if (currentTweet.inReplyToStatusId) {
                elizaLogger.log(
                    "Fetching parent tweet:",
                    currentTweet.inReplyToStatusId
                );
                try {
                    const parentTweet = await this.twitterClient.getTweet(
                        currentTweet.inReplyToStatusId
                    );

                    if (parentTweet) {
                        elizaLogger.log("Found parent tweet:", {
                            id: parentTweet.id,
                            text: parentTweet.text?.slice(0, 50),
                        });
                        await processThread(parentTweet, depth + 1);
                    } else {
                        elizaLogger.log(
                            "No parent tweet found for:",
                            currentTweet.inReplyToStatusId
                        );
                    }
                } catch (error) {
                    elizaLogger.log("Error fetching parent tweet:", {
                        tweetId: currentTweet.inReplyToStatusId,
                        error,
                    });
                }
            } else {
                elizaLogger.log(
                    "Reached end of reply chain at:",
                    currentTweet.id
                );
            }
        }

        // Need to bind this context for the inner function
        await processThread.bind(this)(tweet, 0);

        elizaLogger.debug("Final thread built:", {
            totalTweets: thread.length,
            tweetIds: thread.map((t) => ({
                id: t.id,
                text: t.text?.slice(0, 50),
            })),
        });

        return thread;
    }
}
