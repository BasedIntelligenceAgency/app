export interface TweetAnalysis {
  username: string;
  tribe: string;
  basedScore: number;
  explanation: string;
}

export interface TwitterOAuthCredentials {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
} 