import { type User } from 'src/app/models/user.model'

export const mockRegisterUser = {
  idUser: 'mockIdResponse',
  dni: 'mockUserDni',
  email: 'mockUserEmail',
  name: 'mockUserName',
  itineraryId: 'mockUserIteneraryId',
  password: 'mockUserPassword',
  confirmPassword: 'mockUserConfirmPassword'
}

export const testUser: User = {
  idUser: '',
  dni: '12345678Z',
  email: 'test@example.com',
  name: 'testName',
  itineraryId: 'testItinerary',
  password: 'TestPassword1',
  confirmPassword: 'TestPassword1'
}
