# Application via localhost:

mkdir new-app

cd new-app

git init

git clone https://github.com/SzymonLudyga/github-repos.git

# Browse to directory where server.js is.

cd betting-game

# In first terminal type in:

npm install <-- install node packages

npm run start <-- it should start the server of the application, if you don't have nodemon: npm install -g nodemon

npm run test <-- testing application via Mocha/Chai