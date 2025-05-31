import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { status } from "@grpc/grpc-js";

// Create bulk taxation
export async function CreateTaxations(call) {

//mapper funciton for sendind data
  function mapRequestToTaxation(request) {
  return {
    title: request.title,
    taxRate: request.taxRate,
    effectiveFrom: request.effectiveFrom ? new Date(request.effectiveFrom) : new Date(),
    effectiveTo: request.effectiveTo ? new Date(request.effectiveTo) : null,
    createdBy: request.createdBy,
    createdAt: request.createdAt ? new Date(request.createdAt) : new Date(),
    documentNumber: request.documentNumber,
    remarks: request.remarks,
    isActive: request.isActive ?? true,

    employeeInfo: {
      create: {
        name: request.info?.name,
        age: request.info?.age,
        designation: request.info?.designation,
        maritalStatus: request.info?.maritalStatus,
        department: request.info?.department,
        joiningDate: request.info?.joiningDate ? new Date(request.info.joiningDate) : null,
        isActive: request.info?.isActive ?? true,
      },
    },

    employeeAddress: {
      create: {
        houseNo: request.address?.houseNo,
        street: request.address?.street,
        city: request.address?.city,
        state: request.address?.state,
        country: request.address?.country,
        pinCode: request.address?.pinCode,
        landmark: request.address?.landmark,
        isActive: request.address?.isActive ?? true,
      },
    },
  };
}

// map for sending response in postman or res

function mapTaxationToResponse(taxation) {
  return {
    id: taxation.id,
    title: taxation.title,
    taxRate: taxation.taxRate,
    effectiveFrom: taxation.effectiveFrom,
    effectiveTo: taxation.effectiveTo,
    createdBy: taxation.createdBy,
    createdAt: taxation.createdAt,
    documentNumber: taxation.documentNumber,
    remarks: taxation.remarks,
    isActive: taxation.isActive,
    
    info: taxation.employeeInfo
      ? {
          name: taxation.employeeInfo.name,
          age: taxation.employeeInfo.age,
          designation: taxation.employeeInfo.designation,
          maritalStatus: taxation.employeeInfo.maritalStatus,
          department: taxation.employeeInfo.department,
          joiningDate: taxation.employeeInfo.joiningDate,
          isActive: taxation.employeeInfo.isActive,
        }
      : null,

    address: taxation.employeeAddress
      ? {
          houseNo: taxation.employeeAddress.houseNo,
          street: taxation.employeeAddress.street,
          city: taxation.employeeAddress.city,
          state: taxation.employeeAddress.state,
          country: taxation.employeeAddress.country,
          pinCode: taxation.employeeAddress.pinCode,
          landmark: taxation.employeeAddress.landmark,
          isActive: taxation.employeeAddress.isActive,
        }
      : null,
  };
}


  const taxationRecords = [];

  // Receive data stream from client
  call.on("data", (request) => {
    const taxationData = mapRequestToTaxation(request);
    taxationRecords.push(taxationData);
  });

  // When client finishes sending data
  call.on("end", async () => {
    try {
      const createdTaxations = await prisma.$transaction(
        taxationRecords.map((data) =>
          prisma.taxation.create({
            data,
            include: {
              employeeInfo: true,
              employeeAddress: true,
            },
          })
        )
      );

      for (const tax of createdTaxations) {
        
        call.write({
          message: `Taxation created successfully for ${tax.title}`,
          data: mapTaxationToResponse(tax)
        });
      }

      call.end(); // close server stream
    } catch (err) {
      
      call.emit("error", {
        code: status.INTERNAL,
        message: `CreateTaxations failed: ${err.message}`,
      });
      call.destroy(err);
    }
  });
}

export function mapTaxationToResponse(tax) {
  return {
    id: tax.id,
    title: tax.title,
    taxRate: tax.taxRate,
    effectiveFrom: tax.effectiveFrom,
    effectiveTo: tax.effectiveTo,
    createdBy: tax.createdBy,
    documentNumber: tax.documentNumber,
    remarks: tax.remarks,
    isActive: tax.isActive,
    createdAt: tax.createdAt,
    info: {
      name: tax.employeeInfo.name,
      age: tax.employeeInfo.age,
      designation: tax.employeeInfo.designation,
      maritalStatus: tax.employeeInfo.maritalStatus,
      department: tax.employeeInfo.department,
      joiningDate: tax.employeeInfo.joiningDate,
      isActive: tax.employeeInfo.isActive,
    },
    address: {
      houseNo: tax.employeeAddress.houseNo,
      street: tax.employeeAddress.street,
      city: tax.employeeAddress.city,
      state: tax.employeeAddress.state,
      country: tax.employeeAddress.country,
      pinCode: tax.employeeAddress.pinCode,
      landmark: tax.employeeAddress.landmark,
      isActive: tax.employeeAddress.isActive,
    },
  };
}

export async function GetTaxationById(call) {
  try {
    const id = Number(call.request.id);
    const tax = await prisma.taxation.findUnique({
      where: { id },
      include: {
        employeeInfo: true,
        employeeAddress: true,
      },
    });
   
    if (!tax) {
      call.emit("error", {
        code: status.NOT_FOUND,
        message: `Taxation record with id ${id} not found`,
      });
      call.end();
      return;
    }

    // Map the data before sending response
    const responseData = mapTaxationToResponse(tax);
     
    call.write({
      message: `Taxation record found for id ${id}`,
       data:responseData,
    });

    call.end();
  } catch (err) {
    
    call.emit("error", {
      code: status.INTERNAL,
      message: `getTaxationById failed: ${err.message}`,
    });
    call.destroy(err);
  }
}

//Update taxation 
export async function UpdateTaxations(call) {

  function mapUpdateRequestToTaxation(taxationData) {
  return {
    title: taxationData.title,
    taxRate: taxationData.taxRate,
    effectiveFrom: taxationData.effectiveFrom ? new Date(taxationData.effectiveFrom) : undefined,
    effectiveTo: taxationData.effectiveTo ? new Date(taxationData.effectiveTo) : undefined,
    createdBy: taxationData.createdBy,
    documentNumber: taxationData.documentNumber,
    remarks: taxationData.remarks,
    isActive: taxationData.isActive,
    createdAt: taxationData.createdAt ? new Date(taxationData.createdAt) : undefined,

    employeeInfo: {
      update: {
        name: taxationData.info?.name,
        age: taxationData.info?.age,
        designation: taxationData.info?.designation,
        maritalStatus: taxationData.info?.maritalStatus,
        department: taxationData.info?.department,
        joiningDate: taxationData.info?.joiningDate ? new Date(taxationData.info.joiningDate) : undefined,
        isActive: taxationData.info?.isActive,
      },
    },

    employeeAddress: {
      update: {
        houseNo: taxationData.address?.houseNo,
        street: taxationData.address?.street,
        city: taxationData.address?.city,
        state: taxationData.address?.state,
        country: taxationData.address?.country,
        pinCode: taxationData.address?.pinCode,
        landmark: taxationData.address?.landmark,
        isActive: taxationData.address?.isActive,
      },
    },
  };
}

  call.on("data", async (taxationData) => {
    
    try {
      const updatedTax = await prisma.taxation.update({
        where: { id: taxationData.id },
        data: mapUpdateRequestToTaxation(taxationData)
      });

      call.write({
        id: updatedTax.id,
        message: `Updated taxation with ID ${updatedTax.id}`,
        success: true,
        data:mapUpdateRequestToTaxation(taxationData),
        include:{
          employeeInfo: true,
          employeeAddress: true
        }
      });
    } catch (err) {
      call.write({
        id: taxationData.id,
        message: `Failed to update: ${err.message}`,
        success: false,
      });
    }
  });

  call.on("end", () => {
    call.end();
  });

  call.on("error", (err) => {
    console.error("Client stream error:", err.message);
  });
}

