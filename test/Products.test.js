import chai from "chai";
import supertest from "supertest";
import { env } from "../src/config/config.js";

const expect = chai.expect
const requester = supertest(`http://localhost:${ env.apiserver.port }/api`)

describe('Testing GET en el endpoint', () => {
    it('GET debe devolver un objeto', async () => {
        const result = requester.get('/products')
        expect( result ).to.be.an('object')
    })
    it('GET debe buscar y devolver objeto de usuario por id', async () => {
        const id = '645d41a4e00785c5e9045101' // id de producto REAL
        const result = requester.get(`/products/${ id }`)
        expect( result ).to.be.an('object')
    })
})