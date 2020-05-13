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
const bcrypt = require("../helper/bcrypt");

const image = fs.readFileSync(__dirname+'/test.png');
const image2MB = fs.readFileSync(__dirname+'/test-2-mb.jpg');
const pdfFile = fs.readFileSync(__dirname+'/dummy.pdf');

describe('CUSTOMER INTEGRATION TEST :', () => {

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
        const hashPasswordStub = sinon.stub(bcrypt, 'hashPassword');
        const hookBeforeCreatedStub = sinon.stub(Customer, 'beforeCreate');

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

                hookBeforeCreatedStub.resolves('ok');
                hashPasswordStub.resolves('ok');
                hookBeforeCreatedStub.restore();
                hashPasswordStub.restore();
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

    it('POST /customer should return error empty name', (done) => {
        let newCustomerData = {
            name : '',
            birthday : '1998-11-09',
            email : 'hokandre1998@gmail.com',
            gender : 'M',
            password : '12345678',
            username : 'hokandre'
        }

        chai.request(app)
            .post('/customer')
            .send(newCustomerData)
            .end( (err, response) => {
                expect(response).to.have.status(400);
                expect(response.body.properties[0]).to.have.property('property');
                expect(response.body.properties[0]).to.have.property('message');
                expect(response.body.properties[0].message).to.equal('name must be filled');
                expect(response.body.properties[0].property).to.equal('name');
                done();
            })
    })

    it('POST /customer should return error birthday format not correct', (done) => {
        let newCustomerData = {
            name : 'andre',
            birthday : 'aaa',
            email : 'hokandre1998@gmail.com',
            gender : 'M',
            password : '12345678',
            username : 'hokandre'
        }

        chai.request(app)
            .post('/customer')
            .send(newCustomerData)
            .end( (err, response) => {
                expect(response).to.have.status(400);
                expect(response.body.properties[0]).to.have.property('property');
                expect(response.body.properties[0]).to.have.property('message');
                expect(response.body.properties[0].message).to.equal('birthday\'s format is  incorrect');
                expect(response.body.properties[0].property).to.equal('birthday');
                done();
            })
    })
    
    it('POST /customer should return error email not unique', async () => {
        let newCustomerData = {
            name : 'Andre',
            birthday : '1998-11-09',
            email : 'hokandre@gmail.com',
            gender : 'M',
            password : '12345678',
            username : 'hokandre'
        }

        const customer1 = await Customer.create(newCustomerData);

        const response = await chai.request(app)
            .post('/customer')
            .send(newCustomerData);

        expect(response).to.have.status(400);
        expect(response.body.properties[0]).to.have.property('property');
        expect(response.body.properties[0]).to.have.property('message');
        expect(response.body.properties[0].message).to.equal('email address already in use');
        expect(response.body.properties[0].property).to.equal('email');

    })  
    
    it('POST /customer should return error email empty', async () => {
        let newCustomerData = {
            name : 'Andre',
            birthday : '1998-11-09',
            email : '',
            gender : 'M',
            password : '12345678',
            username : 'hokandre'
        }

        const response = await chai.request(app)
            .post('/customer')
            .send(newCustomerData);

        expect(response).to.have.status(400);
        expect(response.body.properties[0]).to.have.property('property');
        expect(response.body.properties[0]).to.have.property('message');
        expect(response.body.properties[0].message).to.equal('email must be filled');
        expect(response.body.properties[0].property).to.equal('email');
    })

    it('POST /customer should return error email not correct', async () => {
        let newCustomerData = {
            name : 'Andre',
            birthday : '1998-11-09',
            email : 'hokandre.com',
            gender : 'M',
            password : '12345678',
            username : 'hokandre'
        }

        const response = await chai.request(app)
            .post('/customer')
            .send(newCustomerData);

        expect(response).to.have.status(400);
        expect(response.body.properties[0]).to.have.property('property');
        expect(response.body.properties[0]).to.have.property('message');
        expect(response.body.properties[0].message).to.equal('email\'s format is incorrect');
        expect(response.body.properties[0].property).to.equal('email');
    })

    it('POST /customer should return gender not correct', async () => {
        let newCustomerData = {
            name : 'Andre',
            birthday : '1998-11-09',
            email : 'hokandre@1998.com',
            gender : 'L',
            password : '12345678',
            username : 'hokandre'
        }

        const response = await chai.request(app)
            .post('/customer')
            .send(newCustomerData);

        expect(response).to.have.status(400);
        expect(response.body.properties[0]).to.have.property('property');
        expect(response.body.properties[0]).to.have.property('message');
        expect(response.body.properties[0].message).to.equal('gender is incorrect type');
        expect(response.body.properties[0].property).to.equal('gender');
    })

    it('POST /customer should return error password not min 8 caracter', async () => {
        let newCustomerData = {
            name : 'Andre',
            birthday : '1998-11-09',
            email : 'hokandre@1998.com',
            gender : 'F',
            password : '123456',
            username : 'hokandre'
        }

        const response = await chai.request(app)
            .post('/customer')
            .send(newCustomerData);

        expect(response).to.have.status(400);
        expect(response.body.properties[0]).to.have.property('property');
        expect(response.body.properties[0]).to.have.property('message');
        expect(response.body.properties[0].message).to.equal('password must be min 8 letter');
        expect(response.body.properties[0].property).to.equal('password');
    })

    it('POST /customer should return error password empty', async () => {
        let newCustomerData = {
            name : 'Andre',
            birthday : '1998-11-09',
            email : 'hokandre@1998.com',
            gender : 'F',
            password : '',
            username : 'hokandre'
        }

        const response = await chai.request(app)
            .post('/customer')
            .send(newCustomerData);

        expect(response).to.have.status(400);
        expect(response.body.properties[0]).to.have.property('property');
        expect(response.body.properties[0]).to.have.property('message');
        expect(response.body.properties[0].message).to.equal('password must be filled');
        expect(response.body.properties[0].property).to.equal('password');
    })

    it('POST /customer should return error username empty', async () => {
        let newCustomerData = {
            name : 'Andre',
            birthday : '1998-11-09',
            email : 'hokandre@1998.com',
            gender : 'F',
            password : '12345678',
            username : ''
        }

        const response = await chai.request(app)
            .post('/customer')
            .send(newCustomerData);

        expect(response).to.have.status(400);
        expect(response.body.properties[0]).to.have.property('property');
        expect(response.body.properties[0]).to.have.property('message');
        expect(response.body.properties[0].message).to.equal('username must be filled');
        expect(response.body.properties[0].property).to.equal('username');
    })

    it('POST /customer should return error username not unique', async () => {
       
        let newCustomerData1 = {
            name : 'Andre',
            birthday : '1998-11-09',
            email : 'hokandre@1998.com',
            gender : 'F',
            password : '12345678',
            username : 'hokandre'
        }

        let newCustomerData2 = {
            name : 'Andre',
            birthday : '1998-11-09',
            email : 'hokandre@gmail.com',
            gender : 'F',
            password : '12345678',
            username : 'hokandre'
        }
        const customer1 = await Customer.create(newCustomerData1);

        const response = await chai.request(app)
            .post('/customer')
            .send(newCustomerData2);

        expect(response).to.have.status(400);
        expect(response.body.properties[0]).to.have.property('property');
        expect(response.body.properties[0]).to.have.property('message');
        expect(response.body.properties[0].message).to.equal('username already in use');
        expect(response.body.properties[0].property).to.equal('username');
    
    })

    it('POST /customer should return error username min 8 caracter', async () => {
        let newCustomerData = {
            name : 'Andre',
            birthday : '1998-11-09',
            email : 'hokandre@1998.com',
            gender : 'F',
            password : '12345678',
            username : 'hokan'
        }

        const response = await chai.request(app)
            .post('/customer')
            .send(newCustomerData);

        expect(response).to.have.status(400);
        expect(response.body.properties[0]).to.have.property('property');
        expect(response.body.properties[0]).to.have.property('message');
        expect(response.body.properties[0].message).to.equal('username must be min 8 caracter');
        expect(response.body.properties[0].property).to.equal('username');
    })

    it('PUT /customer should return updated customer data', async () =>{
        let customerData = {
            name : 'Andre',
            birthday : '1998-11-09',
            email : 'hokandre@1998.com',
            gender : 'F',
            password : '12345678',
            username : 'hokandre',
            avatar : 'default.jpg'
        }

        const hashPasswordStub = sinon.stub(bcrypt, 'hashPassword');
        
        let customer = await Customer.create(customerData);

        //update
        customerData.name = "Andre Hok";
        customerData.birthday = "1998-11-10";
        customer.gender = "M";

        customerData.id = customer.id;


        const response = await chai.request(app)
            .put(`/customer/${customerData.id}`)
            .type("form")
            .field("name", customerData.name)
            .field("birthday", customerData.birthday)
            .field("email", customerData.email)
            .field("gender", customerData.gender)
            .field("username", customerData.username)
            .attach('avatar', image, 'test.png')

        expect(response).to.have.status(200);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('avatar');
        expect(response.body).to.not.have.property('password');
        expect(response.body.name).to.equal(customerData.name);
        expect(response.body.birthday).to.equal(customerData.birthday);
        expect(response.body.email).to.equal(customerData.email);
        expect(response.body.gender).to.equal(customerData.gender);
        expect(response.body.username).to.equal(customerData.username);

        let isFileExits = fs.existsSync(response.body.avatar);
        expect(isFileExits).to.equal(true);

        if(isFileExits){
            fs.unlinkSync(response.body.avatar);
        }

        expect(hashPasswordStub.called).equal(false);
        
        hashPasswordStub.restore();
    })

    

    it('PUT /customer change password', async () =>{
        let customerData = {
            name : 'Andre',
            birthday : '1998-11-09',
            email : 'hokandre@1998.com',
            gender : 'F',
            password : '12345678',
            username : 'hokandre',
            avatar : 'default.jpg',
            password : 'AKU MEREKA '
        }

        const hashPasswordStub = sinon.stub(bcrypt, 'hashPassword');
        
        let customer = await Customer.create(customerData);
        //update
        customerData.name = "Andre Hok";
        customerData.birthday = "1998-11-10";
        customerData.password = "DUNIA INI"
        customerData.id = customer.id;


        const response = await chai.request(app)
            .put(`/customer/${customerData.id}`)
            .type("form")
            .field("name", customerData.name)
            .field("birthday", customerData.birthday)
            .field("email", customerData.email)
            .field("gender", customerData.gender)
            .field("username", customerData.username)
            .field("password", customerData.password)
            .attach('avatar', image, 'test.png')

        expect(response).to.have.status(200);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('avatar');
        expect(response.body).to.not.have.property('password');
        expect(response.body.name).to.equal(customerData.name);
        expect(response.body.birthday).to.equal(customerData.birthday);
        expect(response.body.email).to.equal(customerData.email);
        expect(response.body.gender).to.equal(customerData.gender);
        expect(response.body.username).to.equal(customerData.username);
        let isFileExits = fs.existsSync(response.body.avatar);
        expect(isFileExits).to.equal(true);

        if(isFileExits){
            fs.unlinkSync(response.body.avatar);
        }

        hashPasswordStub.resolves('ok');
        
        hashPasswordStub.restore();
    })

    /*
    it('PUT /customer change avatar', async () =>{
        let customerData = {
            name : 'Andre',
            birthday : '1998-11-09',
            email : 'hokandre@1998.com',
            gender : 'F',
            username : 'hokandre',
            avatar : 'default.jpg'
        }

        const hashPasswordStub = sinon.stub(bcrypt, 'hashPassword');
        
        let customer = await Customer.create(customerData);

        //update
        customerData.name = "Andre Hok";
        customerData.birthday = "1998-11-10";
        customerData.id = customer;


        const response = await chai.request(app)
            .put(`/customer/${customerData.id}`)
            .type("form")
            .field("name", customerData.name)
            .field("birthday", customerData.birthday)
            .field("email", customerData.email)
            .field("gender", customerData.gender)
            .field("username", customerData.username)
            .attach('avatar', image, 'test.png')

        expect(response).to.have.status(200);
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

        hashPasswordStub.resolves('ok');
        
        hashPasswordStub.restore();
    })*/
    /*
    it('PUT /customer should return 204 no content', async () =>{
        
        let fakeId = '123';

        const response = await chai.request(app)
            .put(`/customer/${fakeId}`)
            .type("form")

        console.log("\x1b[33m", response.body);
        expect(response).to.have.status(204);
    })
    */
})


