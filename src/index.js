import express from 'express'
import dotenv from 'dotenv'
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
const PROTO_PATH = './src/hello.proto';
import {CreateTaxations,GetTaxationById,UpdateTaxations} from "./controllers/taxations.js"
import { status } from "@grpc/grpc-js";
import addStud from "./controllers/test.js";
import  addSubject  from './controllers/test.js';
import { createAccount } from './controllers/Accounting.js';
dotenv.config()

const PORT = process.env.PORT
const password = process.env.PG_PASSWORD

const app = express()
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const helloPackage = grpcObject.hello;

// async function run() {
//   const student = await addStud();
//   console.log("New student:", student);
// }

// run()

// Add sub
// addSubject("Hindi")

const sayHello = (call, callback) => {
  const name = call.request.name;
  callback(null, { message: `Hello, ${name}!` });
};

const add = (call,callback) => {
    const num = call.request.number
    const result = num + 2
    callback(null,{result})
}

const idGetter = (call, callback) => {
  const data = [
    { Id: 1, name: 'Yash', age: 22 },
    { Id: 2, name: 'Sakshi', age: 24 },
    { Id: 3, name: 'Rakhes', age: 25 },
    { Id: 4, name: 'Vinay', age: 26 },
  ];

 
  const id = call.request.Id;

  const user = data.find(d => d.Id === id);
  if (!user) {
    return callback({ code: grpc.status.NOT_FOUND, message: 'User not found' });
  }

  // 👇 Ensure this matches `idResponse { info details = 1; }`
  callback(null, { details: { name: user.name, age: user.age } });
};


// Create a gRPC server
const server = new grpc.Server();

// Add service to the server
server.addService(helloPackage.HelloService.service, { sayHello,add,idGetter });

server.addService(helloPackage.TaxationService.service, {
  CreateTaxations,
  GetTaxationById,
  UpdateTaxations
});
server.addService(helloPackage.Accounting.service,{
  createAccount
})
// Start the server
server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('gRPC server running on port 50051');
  server.start();
});

console.log('change in yash-dev')