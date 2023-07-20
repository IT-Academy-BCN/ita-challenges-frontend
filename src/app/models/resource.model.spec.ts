import { Resource } from './resource.model';

describe('Resource', () => {
  it('should correctly assign values in the constructor', () => {
    const elementMock = {
      id_resource: 'Test ID',
      resource_description: 'Test Description',
      author: 'Test Author',
      generation_date: new Date()
    };

    const resource = new Resource(elementMock);

    expect(resource.idResource).toEqual(elementMock.id_resource);
    expect(resource.resourceDescription).toEqual(elementMock.resource_description);
    expect(resource.author).toEqual(elementMock.author);
    expect(resource.generationDate).toEqual(elementMock.generation_date);
  });
});
