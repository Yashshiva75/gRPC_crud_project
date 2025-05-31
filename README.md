# 📚 QuickBooks Class Sync Microservice

This Node.js microservice syncs `Class` data between a **local database** (via Prisma ORM) and **QuickBooks Online** using **gRPC streaming**.  
It receives multiple `Class` entries through a gRPC stream, saves them to the database, and then syncs each to QuickBooks Online.

---

## ⚙️ Tech Stack

- 🟨 **Node.js**
- 🔄 **gRPC** (for efficient streaming)
- 📊 **Prisma ORM** (for PostgreSQL/MySQL)
- 🧾 **QuickBooks Online SDK**
- 📝 **Protocol Buffers** (`.proto`)

---

## 🔁 Data Flow
Client gRPC Stream
⬇
Collect Class Data
⬇
Save to Local DB via Prisma
⬇
Sync Each Class to QuickBooks
⬇
Update Local Record with QB ID + SyncToken
⬇
Respond with Success Message & Created IDs
---

## 📄 Example gRPC Request Payload

```json
{
  "classes": [
    {
      "qb_id": "",
      "name": "Software Dept",
      "full_name": "Company / Software Dept",
      "is_sub_class": true,
      "is_active": true,
      "domain_source": "QBO",
      "version_token": 0,
      "is_sparse": false
    }
  ]
}

🧩 Understanding the Proto File

syntax = "proto3";

message Class {
  string qb_id = 1;
  string name = 2;
  string full_name = 3;
  bool is_sub_class = 4;
  bool is_active = 5;
  string domain_source = 6;
  int32 version_token = 7;
  bool is_sparse = 8;
}

message ClassRequest {
  repeated Class classes = 1;
}

message ClassResponse {
  repeated string ids = 1;
  string message = 2;
}

service ClassService {
  rpc CreateClass (stream ClassRequest) returns (stream ClassResponse);
}
🧠 What is SyncToken?
SyncToken is QuickBooks’ way to track versioning.

If a record changes in QB, it increases the SyncToken.

To update a record, you must send the latest SyncToken, or your request will be rejected.

✅ Success Response
{
  "ids": ["1", "2", "3"],
  "message": "✅ Classes created and synced successfully"
}
🚨 Error Handling
If database creation or QuickBooks sync fails, the server responds with
{
  "ids": [],
  "message": "❌ Error during creation or QB sync"
}
🤝 Contributing
Want to improve this project? PRs are welcome!


