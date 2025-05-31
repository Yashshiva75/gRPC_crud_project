import { PrismaClient } from '@prisma/client';
import grpc from '@grpc/grpc-js';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export const createAccount = async (call, callback) => {
  try {
    const accountsData = [];

    call.on('data', (account) => {
    
      accountsData.push(account);
    });

    call.on('end', async () => {
      try {
        // Run everything inside a single Prisma transaction
        const createdAccounts = await prisma.$transaction(async (tx) => {
          const kycDetailsList = await Promise.all(
            accountsData.map((acc) =>
              tx.kycDetails.create({
                data: {
                  panCardNumber: acc.kycDetails.documentNumber,
                  aadharNumber: acc.kycDetails.adharNumber,
                  isVerified: false,
                },
              })
            )
          );

          const contactInfoList = await Promise.all(
            accountsData.map((acc) =>
              tx.contactInfo.create({
                data: {
                  phone: acc.contactInfo.phone,
                  email: acc.contactInfo.email,
                  address: acc.contactInfo.address,
                  city: '',
                  pincode: '',
                  country: '',
                  isActive: true,
                },
              })
            )
          );

          const mapAccountType = (type) => {
            switch (type) {
              case 0: return 'Savings';
              case 1: return 'Current';
              case 2: return 'Fixed_deposit';
              default: return 'Savings';
            }
          };

          const mapAccountStatus = (status) => {
            switch (status) {
              case 0: return 'Active';
              case 1: return 'Inactive';
              default: return 'Active';
            }
          };

          const accountPayload = accountsData.map((acc, idx) => ({
            holderName: acc.holderName,
            accountNumber: acc.accountNumber,
            type: mapAccountType(acc.type),
            status: mapAccountStatus(acc.status),
            balance: acc.balance,
            openedAt: new Date(acc.openedAt),
            isActive: acc.isActive,
            createdAt: new Date(acc.createdAt),
            updatedAt: new Date(acc.updatedAt),
            contactInfoId: contactInfoList[idx].id,
            kycDetailsId: kycDetailsList[idx].id,
          }));

          const createdAccounts = await Promise.all(
            accountPayload.map((acc) =>
              tx.account.create({
                data: acc,
                include: {
                  contactInfo: true,
                  kycDetails: true,
                },
              })
            )
          );

          return createdAccounts;
        },{ timeout: 15000 });

        // Mapping back to gRPC format
        const mapTypeToGrpc = (type) => {
          switch (type) {
            case 'Savings': return 0;
            case 'Current': return 1;
            case 'Fixed_deposit': return 2;
            default: return 0;
          }
        };

        const mapStatusToGrpc = (status) => {
          switch (status) {
            case 'Active': return 0;
            case 'Inactive': return 1;
            default: return 0;
          }
        };

        for (const createdAccount of createdAccounts) {
          const grpcResponse = {
            id: createdAccount.id,
            holderName: createdAccount.holderName,
            accountNumber: createdAccount.accountNumber,
            type: mapTypeToGrpc(createdAccount.type),
            status: mapStatusToGrpc(createdAccount.status),
            balance: createdAccount.balance,
            openedAt: createdAccount.openedAt.toISOString(),
            isActive: createdAccount.isActive,
            createdAt: createdAccount.createdAt.toISOString(),
            updatedAt: createdAccount.updatedAt.toISOString(),
            contactInfo: createdAccount.contactInfo
              ? {
                  id: createdAccount.contactInfo.id,
                  email: createdAccount.contactInfo.email,
                  phone: createdAccount.contactInfo.phone,
                  address: createdAccount.contactInfo.address,
                }
              : undefined,
            kycDetails: createdAccount.kycDetails
              ? {
                  id: createdAccount.kycDetails.id,
                  documentType: 'PAN',
                  documentNumber: createdAccount.kycDetails.panCardNumber,
                  issuedBy: '',
                  issuedDate: '',
                }
              : undefined,
          };

          call.write({
            message: 'Account created successfully',
            data: grpcResponse,
          });
        }

        call.end();
      } catch (err) {
        console.error('Bulk insert error:', err);
        call.write({ message: 'Error during bulk insert', data: null });
        call.end();
      }
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    callback({ code: grpc.status.INTERNAL, message: 'Internal error' });
  }
};

