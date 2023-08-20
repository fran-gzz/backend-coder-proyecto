import chai from 'chai'
import supertest from 'supertest'
import { env } from '../src/config/config.js'

const expect = chai.expect

const requester = supertest(`http://localhost:${ env.apiserver.port }/api`)


describe('Testing GET en el endpoint', () => {
    it('GET debe devolver un objeto', async () => {
        const result = requester.get('/carts')
        expect( result ).to.be.an('object')
    })
    it('GET debe buscar y devolver objeto de usuario por id', async () => {
        const id = '64c1b9d902ba5e4242ba0327' // id de carrito REAL
        const result = requester.get(`/carts/${ id }`)
        expect( result ).to.be.an('object')
    })
})