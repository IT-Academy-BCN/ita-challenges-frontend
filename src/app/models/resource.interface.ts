export interface ResourceResponse {
  id: string
  title: string
  slug: string
  description: string
  url: string
  resourceType: string
  userId: string
  categoryId: string
  createdAt: string
  updatedAt: string
  user: User
  topics: TopicElement[]
  voteCount: VoteCount
  isFavorite: boolean
}

export interface TopicElement {
  topic: TopicTopic
}

export interface TopicTopic {
  id: string
  name: string
  slug: string
  categoryId: string
  createdAt: string
  updatedAt: string
}

export interface User {
  name: string
}

export interface VoteCount {
  upvote: number
  downvote: number
  total: number
  userVote: number
}
