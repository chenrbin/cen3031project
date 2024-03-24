# Initialization
Create a .env file in the backend directory

Set ATLAS_URI to the mongodb connection string

Random values can be generated in the terminal using:
	node
	require('crypto').randomBytes(64).toString('hex')

Set ACCESS to a random value

Set REFRESH to a random value


# To start server
Run "npm start" in the backend directory

# Documentation
## Users
Get / to obtain a list of all users and their attributes.
List of clubs is stored by id

Post /register to add a user. Parameters: {username, password}. Username must be unique.

Post /login to attempt to log in. Parameters: {username, password}. 
Returns status 401 if invalid.

Get /refresh attempt to get a new access token
Returns status 403 if forbidden.

Post /logout to remove refreshToken and jwt cookie if any
Returns status 204 if successful.

Post /add/:id to add a server to the user's list of clubs. Parameters: {clubId}
route is user's id. Parameter is club's id
Returns status 403 if club is already added.

Post /clear/:id to remove a server to the user's list of clubs. Parameters: {clubId}
route is user's id. Parameter is club's id
Returns status 404 if club is already removed.


Get /:id to obtain a single user's username, password (hashed), and list of clubs.

Put /update/:id to update a user's username and password

Delete /:id to delete a user

Delete /delete to delete by name

## Clubs
Get / to obtain a list of all clubs and their attributes

Post /add to add a server. Parameters: {clubName, category, url, description, memberCount}
Only clubName and category are required. clubName must be unique.

Get /:id to obtain a single club's information

Get /find/club to search for a club using a fuzzy search library

Get /find/category to get all clubs of a specified category

Put /update/:id to update a club's attributes. 

Delete /:id to delete a club

Delete /delete to delete by name
