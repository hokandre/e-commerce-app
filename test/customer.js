const app = require('../index.js');

const fs = require("fs");
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require("sinon");
const expect = chai.expect;
chai.use(chaiHttp);

const { Customer } = require("../models");

const image = fs.readFileSync(__dirname+'/test.png');
const image2MB = fs.readFileSync(__dirname+'/test-2-mb.jpg');
const pdfFile = fs.readFileSync(__dirname+'/dummy.pdf');

describe('CUSTOMER TASK :', async () => {

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

    it('POST /customer should return new customer',  (done) => {
        let newCustomerData = {
            name : 'andre h',
            birthday : '1998-11-09',
            email : 'hokandre1998@gmail.com',
            gender : 'M',
            password : '12345678',
            username : 'hokandre'
        }

        chai.request(app)
            .post('/customer')
            .type("form")
            .attach('avatar', image, 'test.png')
            .field("name", newCustomerData.name)
            .field("birthday", newCustomerData.birthday)
            .field("email", newCustomerData.email)
            .field("gender", newCustomerData.gender)
            .field("password", newCustomerData.password)
            .field("username", newCustomerData.username)
            .end((err, response) => {

                expect(response).to.have.status(201);
                expect(response.body).to.have.property('id');
                expect(response.body).to.have.property('avatar');
                expect(response.body).to.not.have.property('password');
                expect(response.body.name).to.equal(newCustomerData.name);
                expect(response.body.birthday).to.equal(newCustomerData.birthday);
                expect(response.body.email).to.equal(newCustomerData.email);
                expect(response.body.gender).to.equal(newCustomerData.gender);
                expect(response.body.username).to.equal(newCustomerData.username);
                
                let isFileExits = fs.existsSync(response.body.avatar);
                expect(isFileExits).to.equal(true);

                if(isFileExits){
                    fs.unlinkSync(response.body.avatar);
                }

                done();
            })
    })

    it('POST /customer should return error file too large', (done) => {
        let newCustomerData = {
            name : 'andre h',
            birthday : '1998-11-09',
            email : 'hokandre1998@gmail.com',
            gender : 'M',
            password : '12345678',
            username : 'hokandre'
        }

        chai.request(app)
            .post('/customer')
            .type("form")
            .attach('avatar', image2MB, 'test.png')
            .field("name", newCustomerData.name)
            .field("birthday", newCustomerData.birthday)
            .field("email", newCustomerData.email)
            .field("gender", newCustomerData.gender)
            .field("password", newCustomerData.password)
            .field("username", newCustomerData.username)
            .end((err, response) => {      
                expect(response).to.have.status(400);
                expect(response.body.properties[0]).to.have.property('property');
                expect(response.body.properties[0]).to.have.property('message');
                expect(response.body.properties[0].message).to.equal('File too large');
                expect(response.body.properties[0].property).to.equal('avatar');
                done();
            })
    })

    it('POST /customer should return error file type', (done) => {
        let newCustomerData = {
            name : 'andre h',
            birthday : '1998-11-09',
            email : 'hokandre1998@gmail.com',
            gender : 'M',
            password : '12345678',
            username : 'hokandre'
        }

        chai.request(app)
            .post('/customer')
            .type("form")
            .attach('avatar', pdfFile, 'test.pdf')
            .field("name", newCustomerData.name)
            .field("birthday", newCustomerData.birthday)
            .field("email", newCustomerData.email)
            .field("gender", newCustomerData.gender)
            .field("password", newCustomerData.password)
            .field("username", newCustomerData.username)
            .end((err, response) => {      
                expect(response).to.have.status(400);
                expect(response.body.properties[0]).to.have.property('property');
                expect(response.body.properties[0]).to.have.property('message');
                expect(response.body.properties[0].message).to.equal('Unexpected field');
                expect(response.body.properties[0].property).to.equal('avatar');
                done();
            })
    })
    
})

