# Lets-Chat
Basic chatting app using MERN Stack

# Application Setup
1. @command: npm init  
   @desc: for intializing nodejs
2. @command: npm install all
   @desc: to install all dependencies
3. Create a .env file with below config
   NODE_ENV = development
   PORT = 5000
   MONGO_URI = mongodb+srv://giritej:giritej@cluster1.stfwigk.mongodb.net/
   JWT_SECRET = 'abc123'
4. @command: npm start
   @desc: command to start backend server

# API Routes #
(all are example data)
(atleast create 2 users)
# User API
1. @desc    Register a new user
   @route   POST /api/users
   @body:
   {
    name: "username",
    email: "email@email.com",
    password: "password"
   }

2. @desc    Login User
   @route   POST /api/users/login
   @body:
   {
    nameOrEmail: "username",
    password: "password"
   }
   {
    nameOrEmail: "email@email.com",
    password: "password"
   }
   @things_to_do: after getting the jwt token copy and paste it in headers as
   authorization: Bearer jwt_token

3. @desc    Get user profile
   @route   GET /api/users/profile

4. @desc    Get user profile
   @route   POST /api/users/logout  

5. @desc    Get all users to chat
   @route   GET /api/users/usernames 

# Chat API
1. @desc    Send invitation to user for chat
   @route   POST /api/chat/send
   @body:   
   {
    recipientUsername: "user_2"
   }

2. @desc    Get all invitation sent and received of user
   @route   GET /api/chat/invitations

3. @desc    Lets user to accept the invitation
   @route   POST /api/chat/accept
   @body: (get it from requests)
   {
    invitationId: "id"
   }

4. @desc    Lets user to reject invitation
   @route   POST /api/chat/reject
   {
    invitationId: "id"
   }

5. @desc    API to send message to a user
   @route   POST /api/chat/message
   @body:
   { 
    recipientUsername: "user_2",
    text: "Hi"
   }

6. @desc    API to get all the one on one conversations
   @route   GET /api/chat/conversations
   @body:
   {
    recipientUsername: "user_2"
   }