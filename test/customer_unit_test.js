const app = require('../index.js');

const fs = require("fs");
const chai = require('chai');
const sinonChai = require("sinon-chai");
const chaiHttp = require('chai-http');
const sinon = require("sinon");
const expect = chai.expect;
chai.use(chaiHttp);
chai.use(sinonChai);

const { Customer } = require("../models");


describe('Customer : ', ()=> {
    afterEach( async () => {
        try {
            let response = await Customer.destroy({ 
                where : {},
                truncate : {
                    cascade : true
                }
            })
        }catch(error){
            console.log("\x1b[31m", "error when after hook" );
            console.log(error);
        }
    })

    it('/post customer : should return new customer', async ()=> {
        let newCustomerData = {
            name : 'andre h',
            birthday : '1998-11-09',
            email : 'hokandre1998@gmail.com',
            gender : 'M',
            password : '12345678',
            username : 'hokandre'
        }

        const customerCreateSpy = sinon.spy(Customer,'create');
        const hookSpy = sinon.spy();
        Customer.afterCreate(hookSpy);

        let response = await Customer.create(newCustomerData);

        expect(customerCreateSpy).to.have.been.calledOnce;
        expect(hookSpy).to.have.been.calledOnce;
    })
})