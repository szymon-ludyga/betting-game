# Application via localhost:

mkdir new-app

cd new-app

git init

git clone https://github.com/SzymonLudyga/betting-game.git

# Browse to directory where server.js is.

cd betting-game

# In terminal type in:

npm install <-- install node packages

npm run start <-- it should start the server of the application, if you don't have nodemon: npm install -g nodemon

npm run test <-- testing application via Mocha/Chai

# Application available at:

http://localhost:3000/