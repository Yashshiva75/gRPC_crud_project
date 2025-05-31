import { PrismaClient } from '@prisma/client';
import grpc from '@grpc/grpc-js';
import { getQuickBooksInstance } from '../QBInstance.js';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export const CreateClass = async (call, callback) => {
  try {
    const classDataList = [];

    // 1️⃣ Stream se data aane par
    call.on('data', (data) => {

      if (Array.isArray(data.classes)) {
        data.classes.forEach((cls) => {
          classDataList.push({
            qbId: cls.qb_id,
            name: cls.name,
            fullName: cls.full_name || null,
            isSubClass: cls.is_sub_class || false,
            isActive: cls.is_active !== false,
            domainSource: cls.domain_source || null,
            versionToken: cls.version_token || 0,
            isSparse: cls.is_sparse || false,
          });
        });
      }
    });

    // 2️⃣ Stream khatam hone par
    call.on('end', async () => {
      try {
        const qbo = await getQuickBooksInstance();

        const createdClasses = await prisma.$transaction(async (tx) => {
          return await Promise.all(
            classDataList.map(async (data) => {
              // 3️⃣ DB me create karo
              const created = await tx.qBClass.create({
                data: {
                  qbId: data.qbId,
                  name: data.name,
                  fullName: data.fullName,
                  isSubClass: data.isSubClass,
                  isActive: data.isActive,
                  domainSource: data.domainSource,
                  versionToken: data.versionToken,
                  isSparse: data.isSparse,
                },
              });

              // 4️⃣ QB me sync karo
              await new Promise((resolve, reject) => {
                qbo.createClass(
                  {
                    Name: created.name,
                    FullyQualifiedName: created.fullName || created.name,
                    SubClass: created.isSubClass,
                    Active: created.isActive,
                    sparse: created.isSparse,
                    domain: created.domainSource,
                  },
                  (err, qbRes) => {
                    if (err) {
                      console.error('❌ QuickBooks sync error:', err);
                      reject(err);
                    } else {
                      tx.qBClass.update({
                        where: { id: created.id },
                        data: {
                          qbId: qbRes.Id,
                          versionToken: parseInt(qbRes.SyncToken) || 0,
                        },
                      }).then(resolve).catch(reject);
                    }
                  }
                );
              });

              return created;
            })
          );
        });

        // 5️⃣ Response stream bhejna
        const ids = createdClasses.map((cls) => cls.id.toString());
        call.write({ ids, message: '✅ Classes created and synced successfully' });
        call.end();
      } catch (err) {
        console.error('💥 Transaction/Sync Error:', err);
        call.write({ ids: [], message: '❌ Error during creation or QB sync' });
        call.end();
      }
    });

    // 6️⃣ Error handling
    call.on('error', (err) => {
      console.error('📛 gRPC stream error:', err);
      call.write({ ids: [], message: '❌ Stream error occurred' });
      call.end();
    });

  } catch (err) {
    console.error('🔥 Server Crash:', err);
    callback({ code: grpc.status.INTERNAL, message: 'Internal server error' });
  }
};