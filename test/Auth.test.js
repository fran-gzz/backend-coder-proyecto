import mongoose from "mongoose";
import Auth from "../src/dao/mongo/auth.mongo.dao.js";
import chai from "chai";
import supertest from "supertest";
import { env } from "../src/config/config.js";
import { faker } from "@faker-js/faker";
import logger from "../src/config/winston.config.js";


mongoose.connect(env.mongo.uri, {
    dbName: env.mongo.dbname
})

const expect = chai.expect
const requester = supertest(`http://localhost:${ env.apiserver.port }/api/auth`)

const authDAO = new Auth()

let mockUser = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 1, max: 99 }),
    password: 'secret',
}
describe('Testing POST en ruta /api/auth', () => {
    
    it('Se debe crear un usuario usando el endpoint /register', async () => {  
        const response = await requester.post('/register').send( mockUser )
        const { _body } = response;
        expect( _body.status ).to.be.equals( 201 );
        logger.http( _body.message )
    })
})

// DAO
describe('Testing GET en Auth DAO', () => {
    it('READ All debe devolver un arreglo', async () => {
        const result = await authDAO.readAll()
        expect( result ).to.be.an('array')
    })
    it('READ ONE debe buscar y devolver objeto de usuario por email', async () => {
        const user = await authDAO.readOne( mockUser.email )
        console.log( user )
        expect( user ).to.be.an('object')
    })
})


describe('Testing DELETE en Auth DAO', () => {
    it('Se debe eliminar un usuario utilizando su ID', async () => {
        const user = await authDAO.readOne( mockUser.email )
        const result = await authDAO.delete( user._id )
        logger.http('Usuario eliminado con el ID: ' + result._id )
    })
})