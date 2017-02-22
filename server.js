import express from 'express'
import graphQLHTTP from 'express-graphql'
import DataLoader from 'dataloader'
import fetch from 'node-fetch'
import { graphql } from 'graphql'

import schema from './schema.js'

const app = express();

function getFollowers(url) {
    console.log(url)
    return fetch(url+'?client_id=f64f7957d1ad23b29a94&client_secret=7f8c1767535a86c48efc2fe34a03558d91f94eb4')
                .then(res => res.json())
}

const userLoader = new DataLoader(urls => Promise.all(urls.map(getFollowers)))

const loaders = {
	user: userLoader
}

app.use(graphQLHTTP({
	schema,
	graphiql: true,
	context: { loaders },
}))

app.listen(7600);

const newApp = express();

newApp.get('/profile/:login', (req, res) => {
	const { login } = req.params
	const query = `query($login: String) {
  user(login: $login) {
    name
    login
    email
  }  
}`
	graphql(schema, query, null, null, {
		login
	}).then(result => {
		res.send(result)
	})

})

newApp.listen(7700);