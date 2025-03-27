interface TagResponse {
  offset: number
  limit: number
  count: number
  results: Array<{
    id_tag: string
    tag_name: string
    tag_description: string
  }>
}

export const phpTags: TagResponse = {
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
    }
  ]
}

export const javaTags: TagResponse = {
  offset: 0,
  limit: 4,
  count: 4,
  results: [
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

export const javascriptTags: TagResponse = {
  offset: 0,
  limit: 4,
  count: 4,
  results: [
    {
      id_tag: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      tag_name: 'Promises',
      tag_description: 'Retos sobre programación asíncrona y manejo de promesas.'
    },
    {
      id_tag: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      tag_name: 'DOM',
      tag_description: 'Ejercicios de manipulación del Document Object Model.'
    },
    {
      id_tag: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      tag_name: 'Arrays',
      tag_description: 'Desafíos utilizando métodos de array como map, filter, reduce.'
    },
    {
      id_tag: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
      tag_name: 'Closures',
      tag_description: 'Retos sobre scope y closures en JavaScript.'
    }
  ]
}

export const sqlTags: TagResponse = {
  offset: 0,
  limit: 4,
  count: 4,
  results: [
    {
      id_tag: '55555555-5555-5555-5555-555555555555',
      tag_name: 'Joins',
      tag_description: 'Ejercicios de consultas con diferentes tipos de JOIN.'
    },
    {
      id_tag: '66666666-6666-6666-6666-666666666666',
      tag_name: 'Subqueries',
      tag_description: 'Retos utilizando subconsultas y consultas anidadas.'
    },
    {
      id_tag: '77777777-7777-7777-7777-777777777777',
      tag_name: 'Agregación',
      tag_description: 'Desafíos con funciones de agregación como COUNT, SUM, AVG.'
    },
    {
      id_tag: '88888888-8888-8888-8888-888888888888',
      tag_name: 'Triggers',
      tag_description: 'Ejercicios sobre creación y uso de triggers en SQL.'
    }
  ]
}

export const pythonTags: TagResponse = {
  offset: 0,
  limit: 4,
  count: 4,
  results: [
    {
      id_tag: '99999999-9999-9999-9999-999999999999',
      tag_name: 'Django',
      tag_description: 'Retos utilizando el framework Django.'
    },
    {
      id_tag: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
      tag_name: 'List Comprehension',
      tag_description: 'Ejercicios usando comprensión de listas y generadores.'
    },
    {
      id_tag: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
      tag_name: 'Decorators',
      tag_description: 'Desafíos sobre creación y uso de decoradores en Python.'
    },
    {
      id_tag: '12121212-1212-1212-1212-121212121212',
      tag_name: 'NumPy',
      tag_description: 'Retos de computación numérica con NumPy.'
    }
  ]
}

export const typescriptTags: TagResponse = {
  offset: 0,
  limit: 4,
  count: 4,
  results: [
    {
      id_tag: '34343434-3434-3434-3434-343434343434',
      tag_name: 'Interfaces',
      tag_description: 'Retos sobre definición y uso de interfaces en TypeScript.'
    },
    {
      id_tag: '56565656-5656-5656-5656-565656565656',
      tag_name: 'Generics',
      tag_description: 'Ejercicios utilizando tipos genéricos.'
    },
    {
      id_tag: '78787878-7878-7878-7878-787878787878',
      tag_name: 'Decorators',
      tag_description: 'Desafíos sobre implementación de decoradores en TypeScript.'
    },
    {
      id_tag: '90909090-9090-9090-9090-909090909090',
      tag_name: 'Type Guards',
      tag_description: 'Retos sobre el uso de guardas de tipo y narrowing.'
    }
  ]
}
