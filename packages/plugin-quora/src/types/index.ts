export interface QuoraQuestion {
    id: string;
    url: string;
    title: string;
    content: string;
    topicTags: string[];
}

export interface QuoraAnswer {
    questionId: string;
    content: string;
    author: string;
    timestamp: Date;
}
