// client.js
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { response } from 'express';

// Load the .proto file
const PROTO_PATH = './hello.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const helloPackage = grpcObject.hello;

// Create a client instance and connect to the gRPC server
const client = new helloPackage.HelloService('localhost:50051', grpc.credentials.createInsecure());

// Call the sayHello method
client.sayHello({ name: 'Yash' }, (error, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('Server Response: ', response.message);
  }
});

client.add({number:10},(error,response)=>{
    if(error){
        console.error('Error',error)
    }else{
        console.log(`Server send this result✅ ${response.result}`)
    }
})

client.idGetter({Id:4},(error,response)=>{
    if(error){
        console.log('Error',error)
    }else{
        console.log(`✅ This is info from server ${response.details.name}`)
    }
})
