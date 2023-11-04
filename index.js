const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

const { v1: uuid } = require('uuid')

let persons = [
  {
  
    id: "3d594650-3436-11e9-bc57-8b80ba54c431",
    name: "Wolfy",
    description: "Large dog, very friendly and ready to meet other large breeds",
    imageUrl: "https://i.ibb.co/tzWGk3j/husky.jpg",
    likes: "Juicy Bones",
  },
  {
  
    id: '3d599470-3436-11e9-bc57-8b80ba54c431',
    name: "Wolfy2",
    description: "Large dog, very friendly and ready to meet other large breeds",
    imageUrl: "https://i.ibb.co/tzWGk3j/husky.jpg",
    likes: "Juicy Bones",
  },
  
  {
  
    id: '3d599471-3436-11e9-bc57-8b80ba54c431',
    name: "Wolfy3",
    description: "Large dog, very friendly and ready to meet other large breeds",
    imageUrl: "https://i.ibb.co/tzWGk3j/husky.jpg",
    likes: "Juicy Bones",
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
    description: String
    imageURL: String!
    likes: String!
    location: Address!
   
  }

  type Query {
    dogCount: Int!
    allDogs: [Dog!]!
    findDog(name: String!): Dog
  }
  type Mutation {
    addDog(
      name: String!
      description: String
      imageURL: String!
      likes: String!
      location: Address!
    ): Dog
  }
`

const resolvers = {
  Dog: {
    address: (root) => {
      return { 
        street: root.street,
        city: root.city
      }
    }
  },
  Query: {
    dogCount: () => dogs.length,
    allDogs: () => dogs,
    findDog: (root, args) =>
      dogs.find(p => p.name === args.name)
  },
  Mutation: {
    addDog: (root, args) => {
      const dog = { ...args, id: uuid() }
      dogs = dogs.concat(dog)
      return dog
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