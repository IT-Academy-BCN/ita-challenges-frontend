import { type Challenge } from '../app/models/challenge.model'

export const mockChallenges: Challenge[] = [
  {
    id_challenge: '1',
    challenge_title: 'Challenge 1',
    level: 'EASY',
    popularity: 1,
    creation_date: new Date('2022-05-10'),
    detail: {
      description: 'lorem',
      examples: [],
      notes: 'lorem'
    },
    languages: [
      {
        id_language: '1',
        language_name: 'lorem'
      }
    ],
    solutions: [
      {
        idSolution: '1',
        solutionText: 'Aquí va el texto de la solución 1'
      }
    ]
  },
  {
    id_challenge: '2',
    challenge_title: 'Challenge 2',
    level: 'EASY',
    popularity: 1,
    creation_date: new Date('2022-05-10'),
    detail: {
      description: 'lorem',
      examples: [],
      notes: 'lorem'
    },
    languages: [
      {
        id_language: '2',
        language_name: 'lorem'
      }
    ],
    solutions: [
      {
        idSolution: '1',
        solutionText: 'Aquí va el texto de la solución 1'
      }
    ]
  },
  {
    id_challenge: '3',
    challenge_title: 'Challenge 1',
    level: 'EASY',
    popularity: 1,
    creation_date: new Date('2022-05-10'),
    detail: {
      description: 'lorem',
      examples: [],
      notes: 'lorem'
    },
    languages: [
      {
        id_language: '1',
        language_name: 'lorem'
      }
    ],
    solutions: [
      {
        idSolution: '1',
        solutionText: 'Aquí va el texto de la solución 1'
      }
    ]
  }
]
