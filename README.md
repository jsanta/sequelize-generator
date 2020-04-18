# Sequelize Generator Schematic

Aimed to make code generation a little simpler, this command line tool 
generates Typescript code for Sequelize entity model classes.
It doesn't generate all the desired table structure, but most of the code
required to make nice database models based on some copy & pasting process.

## Installation

### From cloning the repo
Execute:
```
git clone git@github.com:jsanta/sequelize-generator.git
cd sequelize-generator
npm install
npm run build
cd <your project folder>
npm link <sequelize-generator folder>
```

### From NPM

Execute:

``npm i sequelize-generator-schematic``

## Usage

From the command line, execute:

``ng g sequelize-generator-schematic:sequelize-generator --project=<project_name> <path> --flat --schema=<the database schema for the table>``

### Parameter explanation:

* *--project=< project >* : receives the project name, for example if you are working on a monorepo, or have multiple projects defined on your angular json. This is optional and if not defined it will take the first project it find on the angular.json file
* *< path >* : should be the relative path where you want the model file to be generated. The schematic will take the file name and use it as the ClassName, modelName and table_name.
* *--flat* : No other folders will be created to contain the file.
* *--schema=< schema >* : Database schema for the table. Defaults to *public*
