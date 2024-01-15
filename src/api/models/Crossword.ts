import { Difficulty } from './Difficulty'
import { Topic } from './Topic'

export type Crossword = {
  id: number
  crosswordDefinition: string
  difficulty: Difficulty
  topic: Topic
  likes: number
}
