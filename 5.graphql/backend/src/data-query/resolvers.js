import { AuthenticationError, UserInputError } from 'apollo-server'
import Person from '../models/Person.js'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET

export const resolvers = {
  Query: {
    personCount: async () => await Person.countDocuments(),
    allPersons: async (root, args) => {
      if (!args.phone) return await Person.find({})
      return await Person.find({ phone: { $exists: args.phone === 'YES' } })
    },
    findPerson: async (root, args) => await Person.findOne({ name: args.name }),
    me: async (root, args, { currentUser }) => currentUser
  },
  Mutation: {
    addPerson: async (root, args, { currentUser }) => {
      if (!currentUser) throw new AuthenticationError('not authorized')
      const person = new Person(args)

      try {
        await person.save()
        currentUser.friends = currentUser.friends.concat(person)
        await currentUser.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      return person
    },
    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name })
      if (!person) return

      person.phone = args.phone

      try {
        await person.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      return person
    },
    createUser: (root, args) => {
      const user = new User({ username: args.username })

      return user.save().catch(error => {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'holiwi') {
        throw new UserInputError('wrongs credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return {
        value: jwt.sign(userForToken, JWT_SECRET, {
          expiresIn: '7d'
        })
      }
    },
    addAsFriend: async (root, args, { currentUser }) => {
      if (!currentUser) throw new AuthenticationError('not authorized')

      const person = await Person.findOne({ name: args.name })
      if (!person) return null

      const notFriendYet = !currentUser.friends.map(p => p.name).includes(person.name)

      if (notFriendYet) {
        currentUser.friends = currentUser.friends.concat(person)
        await currentUser.save()
      } else {
        throw new Error(`${person.name} is already your friend :)`)
      }

      return currentUser
    }
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city
      }
    }
  }
}
