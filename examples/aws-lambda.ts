// https://syncfiddle.net/fiddle/-MWUAsYsharYFWiXVqFW

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from 'aws-sdk';
import { DynamoDB, Kinesis } from 'aws-sdk';
import { createHmac, randomBytes } from "crypto";
import { Agent } from 'https'


import { v4 as uuid } from 'uuid';

AWS.config.region = process.env.REGION ?? 'eu-west-1';

type User = {
    email: string
    password: string
};

type Hash = {
    salt: string
    hashedPassword: string
}

const generateSalt = (): string => {
    const rounds = 12
    return randomBytes(Math.ceil(rounds / 2)).toString('hex').slice(0, rounds);
};

const generateHash = (data: User, salt: string): Hash => {
    let hash = createHmac('sha512', salt);
    hash.update(data.password);
    let value = hash.digest('hex');
    return {
        salt: salt,
        hashedPassword: value
    };
};

const agent = new Agent({keepAlive: true});
const dynamodb = new DynamoDB({httpOptions: {agent}});
  
const promiseWrapper = (prom) => {
   return new Promise((res, rej) => {
  	 try {
       prom().then(data => {
      	 res({ data, err: null });
       })
     } catch(e) {
       res({ data: null, err: e });
     }
  }
}
  
export const createUserHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    const kinesis = new Kinesis({ apiVersion: '2013-12-02' });
    const timestamp = new Date().getTime();
    const user = JSON.parse(event.body) as User;
    const hash = generateHash(user, generateSalt())
    const id = uuid();

    const dynamoParams = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            id: {S: id},
            email: {S: user.email},
            password: {S: hash.hashedPassword},
            salt: {S: hash.salt},
            checked: {BOOL: false},
            createdAt: {N: timestamp.toString()},
            updatedAt: {N: timestamp.toString()}
        }
    };
    const kinesisParams = {
        Data: JSON.stringify(user);
        PartitionKey: user.email,
        StreamName: 'users.new'
    };

    try {
        await dynamodb.putItem(dynamoParams).promise();
        await kinesis.putRecord(kinesisParams).promise();
      
      	Promise.all[
          	promiseWrapper(dynamodb.putItem(dynamoParams)),
            promiseWrapper(kinesis.putRecord(kinesisParams))
        ].then(values => {
					// check valsues
        }) 
      
    } catch (err) {
        console.error(err);
        return {statusCode: 500, body: "Something went wrong"};
    }
    console.info('Successfully Created User', user);
    
    return {statusCode: 201, body: {id}}
}
