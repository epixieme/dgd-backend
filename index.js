const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

const { v1: uuid } = require('uuid')

let dogs = [
  {

    id: "3d594650-3436-11e9-bc57-8b80ba54c431",
    name: "Wolfy",
    description: "Large dog, very friendly and ready to meet other large breeds",
    imageUrl: "https://i.ibb.co/tzWGk3j/husky.jpg",
    likes: "Juicy Bones",
    street:"3 the view",
    city:"London"
  },
  {

    id: '3d599470-3436-11e9-bc57-8b80ba54c431',
    name: "Wolfy2",
    description: "Large dog, very friendly and ready to meet other large breeds",
    imageUrl: "https://i.ibb.co/tzWGk3j/husky.jpg",
    likes: "Juicy Bones",
    street:"3 the view",
    city:"London"
  },

  {

    id: '3d599471-3436-11e9-bc57-8b80ba54c431',
    name: "Wolfy3",
    description: "Large dog, very friendly and ready to meet other large breeds",
    imageUrl: "https://i.ibb.co/tzWGk3j/husky.jpg",
    likes: "Juicy Bones",
    street:"3 the view",
    city:"London"
  },

]

const typeDefs = `
type Address {
  street: String!
  city: String!

}

  type Dog {
    id: ID!
    name: String!
    description: String!
    imageUrl: String!
    likes: String!
    address: Address!
  }

  enum YesNo {
    YES
    NO
  }
 
  type Query {
    dogCount: Int!
    allDogs(street: YesNo): [Dog!]!
    findDog(name: String!): Dog
  }

  type Mutation {
    addDog(
      name: String!
      description: String
      imageUrl: String!
      likes: String!
    ): Dog
    editStreet (
      name: String!
      street: String!
    ): Dog
  }
`

const resolvers = {

  Query: {
    dogCount: () => dogs.length,
    allDogs: (root, args) => {
      if (!args.street)
        return dogs
      const byStreet = (dog) => args.street === 'yes' ? dog.street : !dog.street
      return dogs.filter(byStreet)
    },
    findDog: (root, args) =>
      dogs.find(d => d.name === args.name)
  },
  Dog: {
    // apollo handles the other resolvers by default if not specified like the address is below eg name, description and so on
    address: (root) => {
      return {
        street: root.street,
        city: root.city
      }
    }
  },
  Mutation: {
    addDog: (root, args) => {
      if (dogs.find(d => d.name === args.name)) {
        throw new GraphQLError('Name must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }
      const dog = { ...args, id: uuid() }
      dogs = dogs.concat(dog)
      return dog

    },
    editStreet: (root, args) => {
      const dog = dogs.find(d => d.name === args.name)
      if (!dog) {
        return null
      }
  
      const updatedPerson = { ...dog, street: args.street }
      dogs = dogs.map(d => d.name === args.name ? updatedDog : d)
      return updatedPerson
    }   
    
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})