// test.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function addStud() {
  try {
    const res = await prisma.student.create({
      data: {
        name: "Vindo",
        age:30,
        class: 102,
      },
    });
    console.log('data entered')
    return res;
  } catch (error) {
    console.error("Error creating student:", error);
  } finally {
    await prisma.$disconnect();
  }
}

//Add subject
 async function addSubject(name) {
  try{
    const sub = await prisma.subject.create({
    data :{
      sub_name:name
    }
  })
  console.log('Subject added:',name)
  return sub;
  }catch(error){
    console.log('Error',error)
  }
}

export default addSubject
