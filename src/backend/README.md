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

Post /register to add a user. Parameters: {username, password}

Post /login to attempt to log in. Parameters: {username, password}. 
Returns status 401 if invalid.

Get /refresh attempt to get a new access token
Returns status 403 if forbidden.

Post /logout to remove refreshToken and jwt cookie if any
Returns status 204 if successful.

Post /add/:id to add a server to the user's list of clubs.

Get /:id to obtain a single user's username, password (hashed), and list of clubs

Put /update/:id to update a user's username and password

Delete /:id to delete a user

## Clubs
Get / to obtain a list of all clubs and their attributes

Post /add to add a server. Parameters: {clubName, category, url, description, memberCount}
Only clubName and category are required.

Get /:id to obtain a single club's information

Get /find/club to search for a club using a fuzzy search library

Get /find/category to get all clubs of a specified category

Put /update/:id to update a club's attributes. 

Delete /:id to delete a club