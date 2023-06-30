const request = require('supertest');
const { v4: uuidv4 } = require('uuid');
import { getJWT, getTestServerSpec, testAdminWalletAddress } from './testHelper';
const Web3 = require('web3');
const matic_url = 'https://polygon-rpc.com/';
const web3 = new Web3(matic_url);
const testServerSpec = getTestServerSpec(process.env.NODE_ENV);

describe("Ice Router API Tests", () => {
    describe("GET /mintToken/:itemID/:tokenAddress", () =>{
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

        it("should block a user from minting if their mintVerify step is too low", async () => {
            //we randomly generate this address as this test is to check for failure
            const web3Account = web3.eth.accounts.create(web3.utils.randomHex(32));
            const testTokenAddress =  web3Account.address;
            let response = await agent.get(`/ice/mintToken/1/${testTokenAddress}`).set('authorization', `Bearer ${userToken}`);
            expect(response.body).toEqual(expect.objectContaining({
                status: false, 
                result: expect.any(String)
            }));
        });

        it("should block a user from passing invalid input into the type query string", async () => {
            //we randomly generate this address as this test is to check for failure
            const web3Account = web3.eth.accounts.create(web3.utils.randomHex(32));
            const testTokenAddress =  web3Account.address;
            let response = await agent.get(`/ice/mintToken/1/${testTokenAddress}?type=badType`).set('authorization', `Bearer ${userToken}`);
            expect(response.status).toBe(422);
            expect(response.body).toEqual(expect.objectContaining({error: expect.any(String)}));
        });

    });

    describe("GET /upgradeToken/:tokenId/:tokenAddress", () =>{
        let agent;
        let userWalletAddress;
        let adminToken;
        let account;
        let userToken;
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
        it("should invalidate invalid token ownership", async () => {
            //we randomly generate this address as this test is to check for failure
            const web3Account = web3.eth.accounts.create(web3.utils.randomHex(32));
            const testTokenAddress =  web3Account.address;
            let response = await agent.get(`/ice/upgradeToken/1/${testTokenAddress}`).set('authorization', `Bearer ${userToken}`);
            expect(response.body).toEqual(expect.objectContaining({
                status: false, 
                result: 'Invalid token owner'
            }));
        });
    });

    describe("GET /getMetadata/:contractAddress/:tokenId", () =>{
        let agent;

        beforeAll(async () => {
            jest.setTimeout(60000);
            agent = request.agent(testServerSpec);
            return;
        });

        it("should get metadata for a valid contract and valid token id", async () => {
            //contract address for the ice linen collection
            const contractAddress =  `0xd79cf5a41d8caec4688e01b4754ea2da6f51e856`;
            //token id for the Boater Hat level 2
            const tokenId = 1;
            let response = await agent.get(`/ice/getMetadata/${contractAddress}/${tokenId}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({
                id: expect.any(String), 
                name: expect.any(String),
                description: expect.any(String),
                language: expect.any(String),
                image: expect.any(String),
                thumbnail: expect.any(String),
                attributes: expect.arrayContaining([expect.objectContaining({
                    trait_type: expect.any(String),
                    value: expect.any(String),
                })])
            }));
        });
        it("should return an empty object for an invalid contract", async () => {
            //random address
            const web3Account = web3.eth.accounts.create(web3.utils.randomHex(32));
            const contractAddress =  web3Account.address;
            //random token id
            const tokenId = 1;
            let response = await agent.get(`/ice/getMetadata/${contractAddress}/${tokenId}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({}));
        });
    });

    describe("POST /delegateToken", () =>{
        let agent;
        let userWalletAddress;
        let adminToken;
        let account;
        let userToken;
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

        it("should return status false if no delegateAddress provided", async () => {
            const web3Account = web3.eth.accounts.create(web3.utils.randomHex(32));
            const contractAddress =  web3Account.address;
            const tokenId = 1;
            let response = await agent.post(`/ice/delegateToken`).set('authorization', `Bearer ${userToken}`).send({tokenId, contractAddress});
            expect(response.body).toEqual(expect.objectContaining({
                status: false, 
                result: 'Missing parameter(s)',
                code: 1
            }));
        });

        it("should return status false and code 4 if caller is not the token owner", async () => {
            let web3Account = web3.eth.accounts.create(web3.utils.randomHex(32));
            const contractAddress =  web3Account.address;
            web3Account = web3.eth.accounts.create(web3.utils.randomHex(32));
            const delegateAddress = web3Account.address;
            const tokenId = 1;
            let response = await agent.post(`/ice/delegateToken`).set('authorization', `Bearer ${userToken}`).send({tokenId, contractAddress, delegateAddress});
            expect(response.body).toEqual(expect.objectContaining({
                status: false, 
                result: 'Invalid token owner',
                code: 4
            }));
        });
    });

    describe("POST /undelegateToken", () =>{
        let agent;
        let userWalletAddress;
        let adminToken;
        let account;
        let userToken;
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
        
        it("should return status false if no delegateAddress provided", async () => {
            const web3Account = web3.eth.accounts.create(web3.utils.randomHex(32));
            const contractAddress =  web3Account.address;
            const tokenId = 1;
            let response = await agent.post(`/ice/undelegateToken`).set('authorization', `Bearer ${userToken}`).send({tokenId, contractAddress});
            expect(response.body).toEqual(expect.objectContaining({
                status: false, 
                result: 'Missing parameter(s)',
                code: 1
            }));
        });

        it("should return status false and code 3 if no delegate mapping exists", async () => {
            let web3Account = web3.eth.accounts.create(web3.utils.randomHex(32));
            const contractAddress =  web3Account.address;
            web3Account = web3.eth.accounts.create(web3.utils.randomHex(32));
            const delegateAddress = web3Account.address;
            const tokenId = 1;
            let response = await agent.post(`/ice/undelegateToken`).set('authorization', `Bearer ${userToken}`).send({tokenId, contractAddress, delegateAddress});
            expect(response.body).toEqual(expect.objectContaining({
                status: false, 
                result: 'Delegate mapping does not exist',
                code: 3
            }));
        });
    });

    describe("GET /getWearableInventory", () =>{
        let agent;
        let userWalletAddress;
        let adminToken;
        let account;
        beforeAll(async () => {
            account = web3.eth.accounts.create(web3.utils.randomHex(32));
            userWalletAddress = account.address;
            adminToken = await getJWT(testAdminWalletAddress);
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

        it("should return false if no address is provided", async () => {
            let response = await agent.get(`/ice/getWearableInventory`);
            expect(response.body).toEqual(expect.objectContaining({
                status: false, 
                result: 'No address was provided'
            }));
        });

        it("should return an empty array if the owner had no wearables", async () => {
            let response = await agent.get(`/ice/getWearableInventory?address=${userWalletAddress}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.any(Array));
            expect(response.body.length).toBe(0);
        });
    });

    describe("GET /delegateInfo", () =>{
        let agent;
        let userWalletAddress;
        let adminToken;
        let account;
            
        beforeAll(async () => {
            account = web3.eth.accounts.create(web3.utils.randomHex(32));
            userWalletAddress = account.address;
            adminToken = await getJWT(testAdminWalletAddress);
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

        it("should return false if no address provided", async () => {
            let response = await agent.get(`/ice/delegateInfo`);
            expect(response.body).toEqual(expect.objectContaining({
                status: false, 
                result: 'No address was provided'
            }));
        });

        it("should return empty delegate Info if user has no wearables delegated", async () => {
            let response = await agent.get(`/ice/delegateInfo?address=${userWalletAddress}`);
            expect(response.status).toBe(200);
            const delegateInfo = response.body;
            expect(delegateInfo).toEqual(expect.objectContaining({
                outgoingDelegations: expect.any(Array), 
                incomingDelegations: expect.any(Array)
            }));
            expect(delegateInfo.outgoingDelegations.length).toBe(0);
            expect(delegateInfo.incomingDelegations.length).toBe(0);
        });
    });

    describe("GET /claimRewards", () =>{
        let agent;
        let userWalletAddress;
        let adminToken;
        let account;
        let userToken;
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

        it("should return false if the user has no ice rewards to claim", async () => {
            const response = await agent.get(`/ice/claimRewards`).set('authorization', `Bearer ${userToken}`);
            expect(response.body).toEqual(expect.objectContaining({
                status: false, 
                result: expect.any(String)
            }));
        });
    });

    describe("GET /getUnclaimedRewardsAmount", () =>{
        let agent;
        let userWalletAddress;
        let adminToken;
        let account;

        beforeAll(async () => {
            account = web3.eth.accounts.create(web3.utils.randomHex(32));
            userWalletAddress = account.address;
            adminToken = await getJWT(testAdminWalletAddress);
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

        it("should return a false status if no address provided", async () => {
            let response = await agent.get('/ice/getUnclaimedRewardsAmount');
            expect(response.body.status).toBe(false);
        });

        it("should return a users unclaimed ice rewards", async () => {
            let response = await agent.get('/ice/getUnclaimedRewardsAmount').query({ address: userWalletAddress });
            expect(response.body).toEqual(expect.objectContaining({
                totalUnclaimedAmount: expect.any(String), 
                totalClaimedAmount: expect.any(String)
            }));
            expect(response.status).toBe(200);
        });
    });

    describe("GET /getRewardsConfig", () =>{
        it("should return ice challenge constants", async () => {
            let agent = request.agent(testServerSpec);
            let response = await agent.get('/ice/getRewardsConfig');
            expect(response.status).toBe(200);
            const responseBody = response.body;
            expect(responseBody).toHaveProperty('challengeCategories');
            expect(responseBody).toHaveProperty('leaderboardMultiplierMap');
            expect(responseBody).toHaveProperty('xpUpgradeCosts');
            expect(responseBody).toHaveProperty('delegatorSplits');
        });
    });

    describe("GET /getGameplayReports", () =>{
        let agent;
        let userWalletAddress;
        let adminToken;
        let account;
        beforeAll(async () => {
            account = web3.eth.accounts.create(web3.utils.randomHex(32));
            userWalletAddress = account.address;
            adminToken = await getJWT(testAdminWalletAddress);
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

        it("should return a false status if no address provided", async () => {
            const response = await agent.get('/ice/getGameplayReports');
            expect(response.body.status).toBe(false);
        });

        it("should be successful if no interval is passed", async () => {
            const response = await agent.get('/ice/getGameplayReports').query({ address: userWalletAddress });
            expect(response.status).toBe(200);
            const gamePlayReports = response.body;
            expect(gamePlayReports).toEqual(expect.any(Array));
            if(gamePlayReports.length > 0) {
                expect(gamePlayReports[0]).toEqual(expect.objectContaining({
                        day: expect.any(String), 
                        gameplay: expect.any(Object), 
                        delegation: []
                }));
            }
        });

        it("should be able to pass an interval", async () => {
            const response = await agent.get('/ice/getGameplayReports').query({ address: userWalletAddress, interval: 'day' });
            const gamePlayReports = response.body;
            expect(gamePlayReports).toEqual(expect.any(Array));
            expect(gamePlayReports.length).toBe(1);
            expect(gamePlayReports[0]).toEqual(expect.objectContaining({
                    day: expect.any(String), 
                    gameplay: expect.any(Object), 
                    delegation: []
            }));
            expect(response.status).toBe(200);
        });
    
    });

    describe("GET /getDelegationBreakdown/:interval", () =>{
        let agent;
        let userWalletAddress;
        let adminToken;
        let account;

        beforeAll(async () => {
            account = web3.eth.accounts.create(web3.utils.randomHex(32));
            userWalletAddress = account.address;
            adminToken = await getJWT(testAdminWalletAddress);
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

        it("should return a false status if no address provided", async () => {
            const response = await agent.get('/ice/getDelegationBreakdown/day');
            expect(response.body).toEqual(expect.objectContaining({
                status: false, 
                result: 'No address was provided'
            }));
        });

        it("should return 404 if invalid interval passed", async () => {
            const response = await agent.get('/ice/getDelegationBreakdown/year').query({ address: userWalletAddress });
            expect(response.status).toBe(404);
        });

        it("should return the delegation breakdown for a valid interval", async () => {
            const response = await agent.get('/ice/getDelegationBreakdown/week').query({ address: userWalletAddress });
            expect(response.body).toEqual(expect.objectContaining({}));
            expect(response.status).toBe(200);
        });
    });

    describe("POST /retriggerIceDrop", () =>{
        it("should return 403 if address does not exist in database", async () => {
            const agent = request.agent(testServerSpec);
            const account = web3.eth.accounts.create(web3.utils.randomHex(32));
            const walletAddress = account.address;
            const userToken = await getJWT(walletAddress);
            const response = await agent.post('/ice/retriggerIceDrop').set('authorization', `Bearer ${userToken}`);
            expect(response.status).toBe(403);
        });
    });

    describe("GET /play", () =>{
        let agent;
        beforeAll(async () => {
            agent = request.agent(testServerSpec);
            return;
        });

        it("should successfully return status code 302", async () => {
            const response = await agent.get('/ice/play');
            expect(response.status).toBe(302);
        });
    });

    describe("PATCH /editDelegation", () =>{
        let agent;
        let userWalletAddress;
        let adminToken;
        let account;
        let userToken;
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

        it("should return 422 if user sends guildName and delegateAddress", async () => {
            const response = await agent.patch('/ice/editDelegation')
                .set('authorization', `Bearer ${userToken}`)
                .send({guildName: 'foo', delegateAddress: 'boo'});
            expect(response.status).toBe(422);
        });

        it("should return 422 if user sends incorrect parameters", async () => {
            const response = await agent.patch('/ice/editDelegation')
                .set('authorization', `Bearer ${userToken}`)
                .send({badParameter: 'foo', delegateAddress: 'boo'});
            expect(response.status).toBe(422);
        });

        it("should allow user to edit their guildName", async () => {
            const newGuildName = `0x${uuidv4().replace(/-/g, '')}-test`;
            let response = await agent.patch('/ice/editDelegation')
                .set('authorization', `Bearer ${userToken}`)
                .send({guildName: newGuildName});
            expect(response.status).toBe(200);
            response =  await agent.get(`/admin/getUser?address=${userWalletAddress}`);
            expect(response.body.guildName).toEqual(newGuildName);
        });
    });

    describe("Get /getAccessoryMarketplace", () =>{
        let agent;
        beforeAll(async () => {
            agent = request.agent(testServerSpec);
            return;
        });

        it("should return the NFT accessory infos", async () => {
            const response = await agent.get('/ice/getAccessoryMarketplace');
            expect(response.status).toBe(200);
            expect(response.body[0]).toEqual(expect.objectContaining({
                collectionName: expect.any(String), 
                contractAddress: expect.any(String), 
                collectionMap: expect.any(Array)
        }));
        });
    });

    describe("Get /secondaryRevenue", () =>{
        let agent;
        beforeAll(async () => {
            agent = request.agent(testServerSpec);
            return;
        });

        it("should return the secondary revenue for a valid transferEvent", async () => {
            const successfulTransferEventId = "0x0002fb060972e9c8220998e056e5278a78620467df76ba0398512fb5347453d8";
            const response = await agent.get(`/ice/secondaryRevenue?transactionId=${successfulTransferEventId}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({
                contractAddress: "0x451612c0e742e27f2cfb3888ad2813eec8dd1ba3", 
                paymentTokenAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", 
                paymentTokenAmount: 0.06958
            }));
        });

        it("should fail gracefully with 422 if no transactionId is passed", async () => {
            const response = await agent.get(`/ice/secondaryRevenue`);
            expect(response.status).toBe(422);
            expect(response.body).toEqual(expect.objectContaining({
                error: expect.any(String)
            }));
        });

        it("should return 200 success and null paymentTokenAddress and zero paymentTokenAmount if no money transfered", async () => {
            const unsuccessfulTransferEventId = "0xd2445ad6d050a626a9b13ac67d53e3c55399f70a581b3806541f1a27cbd3bdd5";
            const response = await agent.get(`/ice/secondaryRevenue?transactionId=${unsuccessfulTransferEventId}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({
                contractAddress: "0xcb06f6aee0655252a3f6f2884680421d55d3c645", 
                paymentTokenAddress: null, 
                paymentTokenAmount: 0
            }));
        });
    });
});  