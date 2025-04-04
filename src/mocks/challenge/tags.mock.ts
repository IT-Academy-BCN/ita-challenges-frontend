import { type TagResponse } from 'src/app/models/tag-response.interface'

export const mockTags: TagResponse = {
  offset: 0,
  limit: 4,
  count: 4,
  results: [
    {
      id_tag: '00000000-0000-0000-0000-000000000000',
      tag_name: 'Recursividad',
      tag_description: 'Retos que implican resolver problemas mediante funciones que se llaman a sí mismas.'
    },
    {
      id_tag: '04104104-1041-0410-4104-104104104104',
      tag_name: 'Algoritmos',
      tag_description: 'Ejercicios centrados en diseño y optimización de algoritmos clásicos y personalizados.'
    },
    {
      id_tag: '08208208-2082-0820-8208-208208208208',
      tag_name: 'Estructuras',
      tag_description: 'Retos sobre listas, pilas, colas, árboles, grafos y otras estructuras de datos.'
    },
    {
      id_tag: '0c30c30c-30c3-0c30-c30c-30c30c30c30c',
      tag_name: 'POO',
      tag_description: 'Desafíos enfocados en Programación Orientada a Objetos: clases, herencia, polimorfismo, etc.'
    },
    {
      id_tag: '11111111-1111-1111-1111-111111111111',
      tag_name: 'Spring',
      tag_description: 'Retos utilizando el framework Spring y Spring Boot.'
    },
    {
      id_tag: '22222222-2222-2222-2222-222222222222',
      tag_name: 'Collections',
      tag_description: 'Ejercicios sobre el uso de ArrayList, HashSet, HashMap y otras colecciones.'
    },
    {
      id_tag: '33333333-3333-3333-3333-333333333333',
      tag_name: 'Threads',
      tag_description: 'Desafíos de programación concurrente y multihilos.'
    },
    {
      id_tag: '44444444-4444-4444-4444-444444444444',
      tag_name: 'Interfaces',
      tag_description: 'Retos sobre implementación y uso de interfaces en Java.'
    }
  ]
}
