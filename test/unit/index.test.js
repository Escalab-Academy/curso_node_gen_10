const { UserService } = require('../../src/expressExample/services')

const users = []
const roles = [
  {
    _id: '1234',
    id: '1',
    name: 'admin',
    description: 'system admin'
  },
  {
    _id: '1235',
    id: '2',
    name: 'user',
    description: 'user who can sell and buy articles'
  }
]
const urls = []

jest.mock('../../src/expressExample/database/mongo/queries', () => {
  return {
    url: {
      saveUrl: jest.fn(async url => urls.push(url)),
      getOneUrl: jest.fn(async id => urls.filter(url => url.id === id))
    },
    user: {
      saveUser: jest.fn(async user => users.push(user)),
      getUserByID: jest.fn(async id => users.filter(user => user.id === id)),
      getAllUsers: jest.fn(async () => users),
      removeUserByID: jest.fn(async id => {
        const index = users.findIndex(user => user.id === id)

        if (index === -1) throw new Error('User not found')

        const userToBeDeleted = users[index]

        users.splice(index, 1)

        return userToBeDeleted
      }),
      updateOneUser: jest.fn(async user => {
        const { id, name, lastName, email, salt, hash } = user
        const index = users.findIndex(u => u.id === id)

        if (index === -1) throw new Error('User not found')

        const userUpdated = {
          ...users[index],
          ...(name && { name }),
          ...(lastName && { lastName }),
          ...(email && { email }),
          ...(salt &&
            hash && {
              salt,
              hash
            })
        }

        users.splice(index, 1, userUpdated)

        return userUpdated
      }),
      getOneUser: jest.fn(async query => {
        const { id, name, lastName, email, salt, hash } = query

        return users.find(user => {
          let aux = true

          id && (aux = aux && user.id === id)
          aux && name && (aux = aux && user.name === name)
          aux && lastName && (aux = aux && user.lastName === lastName)
          aux && email && (aux = aux && user.email === email)
          aux && salt && (aux = aux && user.salt === salt)
          aux && hash && (aux = aux && user.hash === hash)

          return aux
        })[0]
      })
    },
    role: {
      saveRole: jest.fn(async role => roles.push(role)),
      getRoleByID: jest.fn(async id => roles.filter(role => role.id === id)[0]),
      getRoleByName: jest.fn(
        async name => roles.filter(role => role.name === name)[0]
      )
    }
  }
})

describe('Unit test: Use cases from UserService', () => {
  test('Add a user', async () => {
    const user = {
      name: 'Camilo',
      lastName: 'Donoso',
      email: 'cdonoso@gmail.com',
      password: '123'
    }

    await new UserService(user).saveUser()
    expect(users.length).toBe(1)
  })

  test('Get all users', async () => {
    const allUsers = await new UserService().getAllUsers()

    expect(allUsers.length).toBe(users.length)
  })
})
