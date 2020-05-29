# Sequelize Generator Schematic

Aimed to make code generation a little simpler, this command line tool 
generates Typescript code for Sequelize entity model classes.

The `sequelize-generator` schematic doesn't generate all the desired table structure, but most of the code required to make nice database models based on some copy & pasting process.

The `entitytype-generator` schematic generates a *sequelize-less* "type" class, that can be used elsewhere (frontend or other backend classes).

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

### The `sequelize-generator` schematic

From the command line, execute:

``ng g sequelize-generator-schematic:sequelize-generator --project=<project_name> <path> --flat --schema=<the database schema for the table>``

#### Parameter explanation:

* *--project=< project >* : receives the project name, for example if you are working on a monorepo, or have multiple projects defined on your angular json. This is optional and if not defined it will take the first project it find on the angular.json file
* *< path >* : should be the relative path where you want the model file to be generated. The schematic will take the file name and use it as the ClassName, modelName and table_name.
* *--flat* : No other folders will be created to contain the file.
* *--schema=< schema >* : Database schema for the table. Defaults to *public*

### The `entitytype-generator` schematic

From the command line, execute:

``ng g sequelize-generator-schematic:entitytype-generator --project=<project_name> --flat <path>``

#### Parameter explanation:

* *--project=< project >* : receives the project name, for example if you are working on a monorepo, or have multiple projects defined on your angular json. This is optional and if not defined it will take the first project it find on the angular.json file
* *< path >* : should be the relative path where you want the *type* class file to be generated. The schematic will take the file name and use it as the *T*ClassName and the implemented *I*Interface.
* *--flat* : No other folders will be created to contain the file.

These type classes generated by the schematic require some extra objects from the so called *'utils'* module. You can find this module in the schematic source.

# IMPORTANT

**Editing the generated files is absolutely required**.  
For *EntityValidators* to work you'll need to run first:  
``npm install --save ajv typescript-json-schema``

Beware: Large database models that consider multiple different schemas 
can lead to class collisions (user table, named as user, in different schemas, each table with a *sightly* different struncture (believe me, it happens...)). 
Be sure to name your classes in an intelligent way to avoid errors due to name 
collisions (eg *schemaCache* caching the wrong json-schema => wrong validations). 

---
*Contact me at:*  
> **e-Mail**: j [at] santa dot cl  
> **Twitter**: [@JSantaCL](https://twitter.com/JSantaCL)  
> **Medium**: https://medium.com/@jsantacl
