export interface Tag {
  id_tag: string
  tag_name: string
  tag_description: string
}

export interface TagResponse {
  offset: number
  limit: number
  count: number
  results: Tag[]
}
