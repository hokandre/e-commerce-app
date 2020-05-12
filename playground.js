const app = require('../index.js');

const fs = require("fs");
const chai = require('chai');
const sinonChai = require("sinon-chai");
const chaiHttp = require('chai-http');
const sinon = require("sinon");
const expect = chai.expect;
chai.use(chaiHttp);
chai.use(sinonChai);

class Animal {
    static eat(){
        console.log("Eating....");
    }
}


describe('belajar testing :', () => {

    it('/spies', () =>{
        
    })
})