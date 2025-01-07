import {
    composeContext,
    generateText,
    IAgentRuntime,
    Memory,
    ModelClass,
} from "@elizaos/core";
import { SearchMode } from "agent-twitter-client";
import { shouldAddStartup, startupSumUpNew, startupSumUpOld } from "./promts";
// import { addStartup } from "./post";
export function getRandomLocation(): string {
    const locations = [
        "near:NYC within:15mi",
        "near:LosAngeles within:20mi",
        "near:Berlin within:10km",
        "near:London within:10mi",
        "near:SanFrancisco within:10mi",
        "near:Tokyo within:5km",
        "near:Sydney within:10km",
        // Add more if desired
    ];
    // 80% chance to include a location
    if (Math.random() < 0.8) {
        return locations[Math.floor(Math.random() * locations.length)];
    } else {
        return ""; // No location parameter
    }
}
/**
 * Generates a random date range between Jan 1, 2020, and today,
 * returning `sinceDate` and `untilDate` in YYYY-MM-DD format.
 */
export function getRandomDateRange(): { sinceDate: string; untilDate: string } {
    const end = new Date().getTime(); // current date
    const start = end - 7 * 24 * 60 * 60 * 1000; // 7 days ago
    const randomSince = new Date(start + Math.random() * (end - start));
    // "until" date is always after "since"
    const randomUntil = new Date(
        randomSince.getTime() + Math.random() * (end - randomSince.getTime())
    );
    // Format as YYYY-MM-DD
    return {
        sinceDate: randomSince.toISOString().split("T")[0],
        untilDate: randomUntil.toISOString().split("T")[0],
    };
}
/**
 * Picks a random language parameter (e.g., 'lang:en') from a list.
 */
export function getRandomLanguage(): string {
    const langs = ["lang:en", "lang:es", "lang:fr", "lang:de", "lang:it"];
    return langs[Math.floor(Math.random() * langs.length)];
}
/**
 * Optionally picks an extra keyword 50% of the time.
 * If included, returns one of the startup/business-related keywords.
 */
export function getRandomKeyword(): string {
    const keywords = [
        "when airdrop",
        "when TGE",
        "failed startup",
        "startup scam",
        "failed startup",
        "bad investment",
        "bad crypto scam",
        "rug pull",
        "failed token",
        "scam token",
        "exit scam",
        "dead project",
        "crypto failure",
        "wallet",
        "Marketplace",
    ];
    // 50% chance to include one
    if (Math.random() < 0.5) {
        return keywords[Math.floor(Math.random() * keywords.length)];
    }
    return "";
}
export async function processStartupCandidate(
    client: any, // Replace `any` with your actual client type (e.g., YourClientClass)
    runtime: IAgentRuntime,
    message: Memory,
    tweetusername: string
) {
    try {
        // 1) Fetch the profile data
        const userInfo = await client.fetchProfile(tweetusername);
        if (!userInfo) {
            console.log("No user info found. Skipping...");
            return;
        }
        console.log("targetUserInfo 1", userInfo);
        const userDisplay = `NAME: ${userInfo.screenName}, BIO: ${userInfo.bio}`;
        // 2) Gather top 50 tweets referencing the user
        const top50TweetsResponse = await client.fetchSearchTweets(
            `@${tweetusername}`,
            50,
            SearchMode.Top
        );
        const tweetsForCheck = top50TweetsResponse.tweets
            .map((tw, idx) => `${idx + 1}) ${tw.text}`)
            .join("\n");
        // 3) Compose + generate "shouldAddStartup" prompt
        const checkStartupState = await runtime.composeState(message, {
            bio: userInfo.bio,
            tweets: tweetsForCheck,
        });
        const checkStartupCtx = composeContext({
            state: checkStartupState,
            template: shouldAddStartup,
        });
        const isStartupAnswer = await generateText({
            runtime,
            context: checkStartupCtx,
            modelClass: ModelClass.MEDIUM,
        });
        const finalAnswer = isStartupAnswer.trim();
        console.log("isStartupAnswer:", finalAnswer);
        // 4) If user is a startup, fetch oldest & latest tweets, generate summaries
        if (finalAnswer === "true") {
            console.log("makinggggg");
            // 4a) Fetch oldest 50 tweets
            const oldestTweetsRaw = await client.fetchOldest50Tweets(
                userInfo.id
            );
            console.log("makinggggg2");
            const oldestTweets = oldestTweetsRaw.map(
                (tw) => `Tweet ID: ${tw.id}, Text: ${tw.text}`
            );
            const oldestTweetsList = oldestTweets
                .map((tweetStr, idx) => `${idx + 1}) ${tweetStr}`)
                .join("\n");
            console.log("makinggggg1");
            const sumUpOldState = await runtime.composeState(message, {
                tweets: oldestTweetsList,
            });
            const sumUpOldCtx = composeContext({
                state: sumUpOldState,
                template: startupSumUpOld,
            });
            console.log("makinggggg3");
            const oldestSummary = await generateText({
                runtime,
                context: sumUpOldCtx,
                modelClass: ModelClass.MEDIUM,
            });
            console.log("makinggggg4");
            // 4b) Fetch latest 50 tweets
            const latestTweetsResponse = await client.fetchUserPosts(
                userInfo.id,
                50
            );
            const latestTweets = latestTweetsResponse.map(
                (tw) => `Tweet ID: ${tw.id}, Text: ${tw.text}`
            );
            const latestTweetsList = latestTweets
                .map((tweetStr, idx) => `${idx + 1}) ${tweetStr}`)
                .join("\n");
            console.log("makinggggg5");
            const sumUpNewState = await runtime.composeState(message, {
                bio: userInfo.bio,
                tweets: latestTweetsList,
            });
            const sumUpNewCtx = composeContext({
                state: sumUpNewState,
                template: startupSumUpNew,
            });
            const newestSummary = await generateText({
                runtime,
                context: sumUpNewCtx,
                modelClass: ModelClass.MEDIUM,
            });
            console.log("makinggggg6");
            // 5) Build a consolidated data string
            const startupData = `
          username: @${tweetusername},
          bio: "${userInfo.bio}",
          name: "${userInfo.screenName}",
          summaryOfOldest: "${oldestSummary}",
          summaryOfNewest: "${newestSummary}"
        `.trim();
            // 6) Call addStartup
            console.log(`Adding startup1: ${userDisplay}`);
            console.log(`Adding startup2: ${startupData}`);
            // await addStartup(runtime, client.profile.username, startupData);
            console.log(`Added startup: ${userDisplay}`);
        } else {
            console.log(`Not a startup: ${userDisplay}`);
        }
    } catch (error) {
        console.log("Error fetching user info or evaluating startup:", error);
    }
}
