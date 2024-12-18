import { Plugin } from "@ai16z/eliza";
import { answerQuestion } from "./actions/answer";
import { quoraProvider } from "./providers/quoraProvider";

export const quoraPlugin: Plugin = {
    name: "quora",
    description: "Quora Plugin for Eliza - Answer and interact with Quora questions",
    actions: [answerQuestion],
    providers: [quoraProvider],
    evaluators: []
};

export default quoraPlugin;
