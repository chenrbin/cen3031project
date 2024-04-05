# Initialization
Create a .env file in the backend directory

Set ATLAS_URI to the mongodb connection string

Random values can be generated in the terminal using:
	node
	require('crypto').randomBytes(64).toString('hex')

Set ACCESS to a random value
Set REFRESH to a random value

run "npm install" to install the necessary dependencies. 

# To start server
Run "npm start" in the backend directory

# Documentation
## Users
Get / to obtain a list of all users and their attributes.
List of clubs is stored by id

Post /register to add a user. Parameters: {username, password}. Username must be unique.
Generates access token

Post /login to attempt to log in. Parameters: {username, password}. 
Returns status 401 if invalid.

Get /refresh attempt to get a new access token
Returns status 403 if forbidden.

Post /logout to remove refreshToken and jwt cookie if any
Returns status 204 if successful.

Post /add/:id to add a club to the user's list of clubs using clubID. Parameters: {clubId}
:id is user's id. Parameter is club's id
Returns status 409 if club is already added, 404 if club does not exist

Post /add/clubname/:id to add a club to the user's list of clubs using club name. 
Parameters: {clubName}. Returns status 409 if club is already added, 404 if club does not exist

Post /remove/:id to remove a club from the user's list of clubs using club name. 
Parameters: {clubId}. Returns status 404 if club is not in user list or does not exist.

Post /clear/:id to clear a user's clubList. Returns 404 if user does not exist.

Get /list/:id to get information on all clubs in a user's clubList
Returns an array of club entries.

Get /lookup to search for a user's information using username.
Return status 404 if username not found. 

Get /:id to obtain a single user's username, password (hashed), and list of clubs.

Put /update/:id to update a user's username and password.

Delete /:id to delete a user, user cannot be deleted if they are the owner of a club.

Delete /delete to delete by name

## Clubs
Get / to obtain a list of all clubs and their attributes

Post /create to create a club. Parameters: {clubName, category, url, description, memberCount}
Only clubName and category are required. clubName must be unique.

Get /:id to obtain a single club's information

Get /lookup to search for a club using exact clubName

Get /find/club to search for a club using a fuzzy search library
Returns 404 if no clubs found

Get /find/category to get all clubs of a specified category
Returns 404 if no clubs found

Put /update/:id to update a club's attributes. 

Delete /:id to delete a club

Delete /delete to delete by name
