import { ApolloServer } from "@apollo/server";
import{startStandaloneServer} from "@apollo/server/standalone"
// db
import db from './_db.js'
//types
import {typeDefs} from './schema.js'

//resolver
const resolvers ={
   Query:{
    games(){
      return db.games;
    },
    reviews(){
        return db.reviews
    },
    review(parent,args,context){
       return db.review.find(item => item.id === args.id)
    },
    game(parent,args,context){
       return db.games.find(item => item.id === args.id)
    },
    author(parent,args,context){
       return db.authors.find(item => item.id === args.id)
    },
    authors(){
        return db.authors
    }   
   },
   Game:{
     reviews(parent){
        return db.reviews.filter(review => review.game_id === parent.id)
     }
   },
   Author:{
    reviews(parent){
        return db.reviews.filter(r => r.author_id === parent.id)
    }
   },
   Review:{
     author(parent){
        return db.authors.find(a => a.id === parent.author_id)
     },
     game(parent){
        return db.games.find(g => g.id === parent.game_id)
     }

   },
   Mutation:{
    addGame(_,args){
        let game = {
            ...args.game,
            id: Math.floor(Math.random()*10000)
        }
         db.games.push(game)
         return db.games
     },
    deleteGame(_,args){
       return db.games = db.games.filter(g => g.id != args.id)
    },
    updateGame(_,args){
        db.games = db.games.map(g =>{
            if(g.id === args.id){
                return{...g,...args.edits}
            }
            return g;
        })

        return db.games
    }
   }
}
// server setup 

const server = new ApolloServer({
   typeDefs,
   resolvers
})

const {url} = await startStandaloneServer(server,{
    listen:{port: 4000}
});

console.log("server ready at port",4000)