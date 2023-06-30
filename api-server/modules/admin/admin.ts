const dbMongo = require('../../db/dbMongo');
const { redis } = require('../redis');
import {UserNotFoundError, ValidationError} from '../errors/errors';
import {getWearableInventory} from '../ice/ice';

const handleUpdateManagerOf = async (userInfo, managerAddress: string) => {
    const address = userInfo.address;
    if(managerAddress == address){
        throw new ValidationError(JSON.stringify({Invalid_Address: ['User cannot be the manager of their own guild.']}))
    }
    //if we pass a null managerAddress then we want to remove the manager
    if(managerAddress.toString().length === 0){
        const userInfo = await dbMongo.findUser(address);
        const oldManager = userInfo.guildManager.toLowerCase();
        if(oldManager){
            await dbMongo.updateUser( oldManager, {managerOf: ""});
            await dbMongo.updateUser( address, {guildManager: ""});
        }
        return;
    }else if (userInfo.guildManager){
        throw new ValidationError(JSON.stringify({Invalid_Manager_Assignment: ['This user has already been assigned a manager.']}));
    }
    const managerAddressLowercase = managerAddress.toString().toLowerCase();
    //check if the manager has any wearables
    const managerWearableInventory = await getWearableInventory(managerAddressLowercase);
    if(managerWearableInventory && managerWearableInventory.length > 0){
        throw new ValidationError(JSON.stringify({Invalid_Manger: ['A user with wearables cannot be an assigned manager.']}))
    }
    const managerUserInfo = await dbMongo.findUser(managerAddressLowercase);
    if(!managerUserInfo){
        await dbMongo.insertUser({address: managerAddressLowercase});
    }
    if(managerUserInfo.managerOf){
        throw new ValidationError(JSON.stringify({Invalid_Manager_Assignment: ['This user is already the manager of another guild.']}))
    }

    const guildOwnerIsBanned = await dbMongo.findBannedUser(address) || await redis.get(`bannedUsers:${address}`);
    const managerIsBanned = await dbMongo.findBannedUser(managerAddressLowercase) || await redis.get(`bannedUsers:${managerAddressLowercase}`);
    if(!!guildOwnerIsBanned){
        throw new ValidationError(JSON.stringify({Invalid_Manger: ['A banned user cannot be made into a manager.']}))
    }
    if(!!managerIsBanned){
        throw new ValidationError(JSON.stringify({Invalid_Manger_Of: ['A banned users guild cannot be managed.']}))
    }

    await dbMongo.updateUser( address, {guildManager: managerAddressLowercase})
    await dbMongo.updateUser(managerAddressLowercase, {managerOf: address});
    return;
}


export const updateUser = async (requestParams) => {
    const errorResult = updateUserParamCheck(requestParams);
    if(Object.keys(errorResult).some((errorField) => errorResult[errorField].length != 0)){
        throw new ValidationError(JSON.stringify(errorResult));
    }

    const address = requestParams.address.toString().toLowerCase();
    let userInfo = await dbMongo.findUser(address);
    if(!userInfo){
      throw new UserNotFoundError(JSON.stringify({USER_NOT_FOUND: [`User address ${address} not found`]}));
    }

    if(Object.keys(requestParams).includes('assignedManager')){
        try{
            if(userInfo.managerOf){
                throw new ValidationError(JSON.stringify({Invalid_Manager_Of: ['A user that is a manager of another guild cannot assign a manager']}));
            }
            await handleUpdateManagerOf(userInfo, requestParams.assignedManager);
        }catch(error){
            throw error;
        }
    }
    return;
}


//this function checks which parameters we allow to update
//add in more accepted parameters as we do more for the endpoint
export const updateUserParamCheck = (requestParams) => {
    let errorResult = {Invalid_Parameters: [], Missing_User_Address: []};
    const validUpdateUserParams:string[] = [
        'address',
        'assignedManager'
    ];
    const paramsList:string[] = Object.keys(requestParams);
    paramsList.forEach((param)=> {
        if(!validUpdateUserParams.includes(param)){
            errorResult['Invalid_Parameters'].push(`Parameter ${param} not accepted`);
        }
    })
    if(!requestParams.address){
        errorResult['Missing_User_Address'].push('No user address passed');
    }

    if(paramsList.includes('assignedManager') && (requestParams.assignedManager.slice(0, 2) !== '0x') && requestParams.assignedManager.length != 0){
        errorResult['Invalid_Parameters'].push(`Please pass a valid manager address`);
    }
    return errorResult;
}



export const withdrawManagement = async (requestParams) => {
    const address = requestParams.address.toString().toLowerCase();
    let userInfo = await dbMongo.findUser(address);
    if(!userInfo){
      throw new UserNotFoundError(JSON.stringify({USER_NOT_FOUND: [`User address ${address} not found`]}));
    }
    if(userInfo.managerOf){
        const guildOwnerAddress = userInfo.managerOf.toLowerCase();
        const guildOwnerInfo =  await dbMongo.findUser(guildOwnerAddress);
        if(guildOwnerInfo){
            await dbMongo.updateUser( guildOwnerAddress, {guildManager: ""});
        }
        await dbMongo.updateUser( address, {managerOf: ""});
        return;
    }else{
        throw new ValidationError(JSON.stringify({INVALID_WITHDRAW: [`User address ${address} is not a manager`]}));
    }
}
