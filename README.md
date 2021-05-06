# ESRS Group Project - Server
The ESRS group project is a university assignment where we are creating a game with a cloud REST service. This repository is used for cloud storage and access of user data, levels and playlists.

Users will be able to create accounts were in the game they can build their own levels using the assets provided. This level can be saved securely to the server. Al levels will be accessable using the level list and users can play them and add them to their own playlists which can also be saved to the server.

The game can be found [here](https://github.com/scottduller/esrs-game).

The API can be found [here](https://esrs-server.eba-7ey4i4zp.eu-west-2.elasticbeanstalk.com/api) (_**NB:** The API maybe down for cost saving purposes_)

## Features
* Secure user accounts
* Full CRUD for all routes
* Secure user route access
* Full CICD master-develop branch workflow
* MongoDB cloud database

### Environment Variables

## Installation
Create a config.env file in the config folder with you environmnet variables.
```javascript
PORT = 5000
DEV_MONGO_URI =   // Your MongoDB URI - Development database
TEST_MONGO_URI =  // Your MongoDB URI - Test database
PROD_MONGO_URI =  // Your MongoDB URI - Production database
EXPRESS_SECRET =  // Your cookie secret
```
Installing dependencies
```bash
yarn install
```
## Usage
```bash
# Test the server
yarn test

# Lint the server
yarn eslint

# Start development server
yarn dev

# Start production server
yarn start
```
### Build and Deploy
This repository uses a master-develop branch workflow. Github actions are used to build and do intergration testing on the repository in the develop branch. When pushing or pull-requesting to the master branch Github actions builds, lints, tests and deploys to an AWS Beanstalk instance. 

_**NB:** You must have a AWS beanstalk instance started up with the load balancer having port access to port 5000. You must also create an IAM user with permissions to access to the instance and the attached S3 bucket and input the given access credentials into Github Secrets._

You can deploy to the AWS instance by pushing the development branch to master.

[Click here](https://blog.seamlesscloud.io/2020/07/automated-deployment-to-aws-elastic-beanstalk-using-github-actions/) to read more about AWS beanstalk deployment and AWS credential configuration

### Credits
* University tutor - [Hsi-Ming Ho](https://github.com/hsimho)
* Group partner - [James Fenton](https://github.com/JFenton1997)
