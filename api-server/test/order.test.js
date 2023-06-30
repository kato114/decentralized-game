const request = require('supertest');
import { getJWT, getTestServerSpec, testAdminWalletAddress } from './testHelper';
const Web3 = require('web3');
const matic_url = 'https://polygon-rpc.com/'
const web3 = new Web3(matic_url);
const PORT = process.env.PORT || 5000;
const testServerSpec = getTestServerSpec(process.env.NODE_ENV);

describe("Order Router API Tests", () => {
    describe("POST /order/webLogin", () =>{
        let agent;
        let userWalletAddress;
        let adminToken;
        let userToken;
        let account;
        beforeAll(async () => {
            await new Promise((r) => setTimeout(r, 2000));
            account = web3.eth.accounts.create(web3.utils.randomHex(32));
            userWalletAddress = account.address;
            adminToken = await getJWT(testAdminWalletAddress);
            userToken = await getJWT(userWalletAddress);
            agent = request.agent(testServerSpec);
            let response = await agent.post(`/admin/createUserTesting`).set('authorization', `Bearer ${adminToken}`).send({newAddress: userWalletAddress});
            expect(response.status).toBe(201);
            return;
        });

        afterAll(async () => {
            let response = await agent.delete(`/admin/deleteUserTesting`).set('authorization', `Bearer ${adminToken}`).send({deleteAddress: userWalletAddress});
            expect(response.status).toBe(200);
            return;
        });

        it("should return users verify step if the user exists", async () => {
            const response = await agent.post(`/order/webLogin`).set({'authorization': `Bearer ${userToken}`});
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({status: 4}));
        });

        it("should respond with status -1 if the user doesn't exist", async () => {
            const web3Account = web3.eth.accounts.create(web3.utils.randomHex(32));
            const walletAddress = web3Account.address;
            const token = await getJWT(walletAddress);
            const response = await agent.post(`/order/webLogin`).set({'authorization': `Bearer ${token}`});
            expect(response.body).toEqual(expect.objectContaining({status: -1}));
        });
    });

    describe("POST /order/webRegister", () =>{
        let agent;
        let userWalletAddress;
        let adminToken;
        let userToken;
        let account;
        beforeAll(async () => {
            account = web3.eth.accounts.create(web3.utils.randomHex(32));
            userWalletAddress = account.address;
            adminToken = await getJWT(testAdminWalletAddress);
            userToken = await getJWT(userWalletAddress);
            agent = request.agent(testServerSpec);
            let response = await agent.post(`/admin/createUserTesting`).set('authorization', `Bearer ${adminToken}`).send({newAddress: userWalletAddress});
            expect(response.status).toBe(201);
            return;
        });

        afterAll(async () => {
            let response = await agent.delete(`/admin/deleteUserTesting`).set('authorization', `Bearer ${adminToken}`).send({deleteAddress: userWalletAddress});
            expect(response.status).toBe(200);
            return;
        });

        it("should throw an error if the user already exists", async () => {
            const response = await agent.post(`/order/webRegister`).set({'authorization': `Bearer ${userToken}`});
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({status: false}));
        });

        it("should insert a new user if they do not yet exist", async () => {
            const web3Account = web3.eth.accounts.create(web3.utils.randomHex(32));
            const newWalletAddress = web3Account.address;
            const newToken = await getJWT(newWalletAddress);
            let response = await agent.post(`/order/webRegister`).set({'authorization': `Bearer ${newToken}`});
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({status: true}));
            response =  await agent.get(`/admin/getUser?address=${newWalletAddress}`);
            expect(response.status).toBe(200);
            expect(response.body.address).toEqual(newWalletAddress.toLowerCase());
            response = await agent.delete(`/admin/deleteUserTesting`).set('authorization', `Bearer ${adminToken}`).send({deleteAddress: newWalletAddress});
            expect(response.status).toBe(200);
        });
    });

    // describe("POST /order/getUser", () =>{
    //     let agent;
    //     let userWalletAddress;
    //     let adminToken;
    //     let userToken;
    //     let account;
    //     beforeAll(async () => {
    //         account = web3.eth.accounts.create(web3.utils.randomHex(32));
    //         userWalletAddress = account.address;
    //         adminToken = await getJWT(testAdminWalletAddress);
    //         userToken = await getJWT(userWalletAddress);
    //         agent = request.agent(testServerSpec);
    //         let response = await agent.post(`/admin/createUserTesting`).set('authorization', `Bearer ${adminToken}`).send({newAddress: userWalletAddress});
    //         expect(response.status).toBe(201);
    //         return;
    //     });

    //     afterAll(async () => {
    //         let response = await agent.delete(`/admin/deleteUserTesting`).set('authorization', `Bearer ${adminToken}`).send({deleteAddress: userWalletAddress});
    //         expect(response.status).toBe(200);
    //         return;
    //     });
    // });

    describe("POST /order/topup", () =>{
        let agent;
        let adminToken;
        beforeAll(async () => {
            adminToken = await getJWT(testAdminWalletAddress);
            agent = request.agent(testServerSpec);
            return;
        });

        it("should return 404", async () => {
            let response = await agent.post(`/order/topup`).set({'authorization': `Bearer ${adminToken}`});
            expect(response.status).toBe(404);
        });
    });

    describe("POST /order/getUser", () =>{
        let agent;
        let userWalletAddress;
        let adminToken;
        let userToken;
        let account;

        beforeAll(async () => {
            account = web3.eth.accounts.create(web3.utils.randomHex(32));
            userWalletAddress = account.address;
            adminToken = await getJWT(testAdminWalletAddress);
            userToken = await getJWT(userWalletAddress);
            agent = request.agent(testServerSpec);
            let response = await agent.post(`/admin/createUserTesting`).set('authorization', `Bearer ${adminToken}`).send({newAddress: userWalletAddress});
            expect(response.status).toBe(201);
            return;
        });

        afterAll(async () => {
            let response = await agent.delete(`/admin/deleteUserTesting`).set('authorization', `Bearer ${adminToken}`).send({deleteAddress: userWalletAddress});
            expect(response.status).toBe(200);
            return;
        });

        it("should return user data if the user exists in our database", async () => {
            let response = await agent.post(`/order/getUser`).set({'authorization': `Bearer ${userToken}`});
            expect(response.status).toBe(200);
            expect(response.body.result).toEqual(expect.objectContaining({
                _id: expect.any(String), 
                address: userWalletAddress.toLowerCase(),
                MANALocked: expect.any(Number),
                ETHLocked: expect.any(Number),
                verifyStep: expect.any(Number),
                authorized: expect.any(Number),
                id: expect.any(String),
                playBalance: expect.any(Number),
                competitionBalance: expect.any(Number),
                iceChipsBalance: expect.any(Number),
                iceAgreedTermsofService: expect.any(Boolean),
                iceXpCurrent: expect.any(Number),
                iceXpAllTime: expect.any(Number),
                callCount: expect.any(Number),
                avatarName: expect.any(String),
                avatarImageID: expect.any(String),
                gasFill: expect.any(Number),
                playersList: expect.any(Array),
                tokenArray: expect.any(Array),
                muted: expect.any(Boolean),
                currency: expect.any(String),
                guildName: expect.any(String)
            }));
        });

        it("should return a result of false if the user does not exist", async () => {
            const web3Account = web3.eth.accounts.create(web3.utils.randomHex(32));
            const newWalletAddress = web3Account.address;
            const newToken = await getJWT(newWalletAddress);
            let response = await agent.post(`/order/getUser`).set({'authorization': `Bearer ${newToken}`});
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({status: 'ok', result: 'false'}));
        });
    });

    describe("POST /order/updateHistory", () =>{
        let agent;
        let userWalletAddress;
        let adminToken;
        let userToken;
        let account;

        beforeAll(async () => {
            account = web3.eth.accounts.create(web3.utils.randomHex(32));
            userWalletAddress = account.address;
            adminToken = await getJWT(testAdminWalletAddress);
            userToken = await getJWT(userWalletAddress);
            agent = request.agent(testServerSpec);
            let response = await agent.post(`/admin/createUserTesting`).set('authorization', `Bearer ${adminToken}`).send({newAddress: userWalletAddress});
            expect(response.status).toBe(201);
            return;
        });

        afterAll(async () => {
            let response = await agent.delete(`/admin/deleteUserTesting`).set('authorization', `Bearer ${adminToken}`).send({deleteAddress: userWalletAddress});
            expect(response.status).toBe(200);
            return;
        });

        it("should respond with fail if nothing is passed in the body", async () => {
            let response = await agent.post(`/order/updateHistory`).set({'authorization': `Bearer ${userToken}`});
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({ status: 'fail', result: ''}));
        });
    });

    describe("POST /order/getPlayInfo", () =>{
        let agent;
        let userWalletAddress;
        let adminToken;
        let userToken;
        let account;

        beforeAll(async () => {
            account = web3.eth.accounts.create(web3.utils.randomHex(32));
            userWalletAddress = account.address;
            adminToken = await getJWT(testAdminWalletAddress);
            userToken = await getJWT(userWalletAddress);
            agent = request.agent(testServerSpec);
            let response = await agent.post(`/admin/createUserTesting`).set('authorization', `Bearer ${adminToken}`).send({newAddress: userWalletAddress});
            expect(response.status).toBe(201);
            return;
        });

        afterAll(async () => {
            let response = await agent.delete(`/admin/deleteUserTesting`).set('authorization', `Bearer ${adminToken}`).send({deleteAddress: userWalletAddress});
            expect(response.status).toBe(200);
            return;
        });

        it("should return a result of false if user has no play infos", async () => {
            let response = await agent.post(`/order/getPlayInfo`).set({'authorization': `Bearer ${userToken}`});
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({ status: 'ok', result: 'false'}));
        });
    });

    describe("POST /order/getPlayInfoCSV", () =>{
        let agent;
        let userWalletAddress;
        let adminToken;
        let userToken;
        let account;

        beforeAll(async () => {
            account = web3.eth.accounts.create(web3.utils.randomHex(32));
            userWalletAddress = account.address;
            adminToken = await getJWT(testAdminWalletAddress);
            userToken = await getJWT(userWalletAddress);
            agent = request.agent(testServerSpec);
            let response = await agent.post(`/admin/createUserTesting`).set('authorization', `Bearer ${adminToken}`).send({newAddress: userWalletAddress});
            expect(response.status).toBe(201);
            return;
        });

        afterAll(async () => {
            let response = await agent.delete(`/admin/deleteUserTesting`).set('authorization', `Bearer ${adminToken}`).send({deleteAddress: userWalletAddress});
            expect(response.status).toBe(200);
            return;
        });

        it("should respond with a 404 if the user has no play info records", async () => {
            let response = await agent.post(`/order/getPlayInfoCSV`).set({'authorization': `Bearer ${userToken}`});
            expect(response.status).toBe(404);
            expect(response.body).toEqual(expect.objectContaining({}));
        });
    });
    
    describe("POST /order/getPlayInfoCSV", () =>{
        let agent;
        let userWalletAddress;
        let adminToken;
        let userToken;
        let account;

        beforeAll(async () => {
            account = web3.eth.accounts.create(web3.utils.randomHex(32));
            userWalletAddress = account.address;
            adminToken = await getJWT(testAdminWalletAddress);
            userToken = await getJWT(userWalletAddress);
            agent = request.agent(testServerSpec);
            let response = await agent.post(`/admin/createUserTesting`).set('authorization', `Bearer ${adminToken}`).send({newAddress: userWalletAddress});
            expect(response.status).toBe(201);
            return;
        });

        afterAll(async () => {
            let response = await agent.delete(`/admin/deleteUserTesting`).set('authorization', `Bearer ${adminToken}`).send({deleteAddress: userWalletAddress});
            expect(response.status).toBe(200);
            return;
        });

        it("should respond with a 404 if the user has no play info records", async () => {
            let response = await agent.post(`/order/getPlayInfoCSV`).set({'authorization': `Bearer ${userToken}`});
            expect(response.status).toBe(404);
            expect(response.body).toEqual(expect.objectContaining({}));
        });
    });
});  