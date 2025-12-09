# User Stories & Backlog (เรื่องราวผู้ใช้และงานที่ค้าง)
## โปรเจกต์: ระบบบริหารจัดการสินทรัพย์ถาวรแบบง่าย (Simple Fixed Asset Management System)

---

## Epic 1: การจัดการทะเบียนสินทรัพย์ (Asset Inventory Management)

### Story 1.1: จัดการประเภทสินทรัพย์ (Manage Asset Types)
**สถานะ:** ร่าง (Draft)

**Story:**
**ในฐานะ** ผู้จัดการสินทรัพย์ (Admin),
**ฉันต้องการ** สร้าง แก้ไข และลบประเภทสินทรัพย์ (หมวดหมู่),
**เพื่อให้** ฉันสามารถจัดหมวดหมู่สินทรัพย์ได้อย่างถูกต้อง เพื่อง่ายต่อการติดตามและทำรายงาน

**เกณฑ์การยอมรับ (Acceptance Criteria):**
1.  Admin สามารถดูรายการประเภทสินทรัพย์ที่มีอยู่ได้
2.  Admin สามารถเพิ่มประเภทสินทรัพย์ใหม่โดยระบุชื่อ (จำเป็น, ห้ามซ้ำ) และคำอธิบาย (ไม่บังคับ)
3.  Admin สามารถแก้ไขชื่อหรือคำอธิบายของประเภทสินทรัพย์ที่มีอยู่ได้
4.  Admin สามารถลบประเภทสินทรัพย์ได้ **ก็ต่อเมื่อ** ไม่มีสินทรัพย์ใดๆ ผูกอยู่กับประเภทนั้น
5.  ระบบแสดงข้อความแจ้งเตือนข้อผิดพลาดหากพยายามลบประเภทที่กำลังถูกใช้งานอยู่

**งานย่อย (Tasks / Subtasks):**
- [ ] พัฒนาหน้าจอจัดการประเภทสินทรัพย์ (หน้าตั้งค่า)
    - [ ] สร้างคอมโพเนนต์ `AssetTypeList`
    - [ ] สร้าง Modal/Dialog `AssetTypeForm`
- [ ] พัฒนา Server Actions สำหรับประเภทสินทรัพย์
    - [ ] `createAssetType` (พร้อมการตรวจสอบข้อมูล)
    - [ ] `updateAssetType`
    - [ ] `deleteAssetType` (พร้อมการตรวจสอบความสัมพันธ์ข้อมูล)
- [ ] เชื่อมต่อหน้าจอกับ Server Actions

**บันทึกสำหรับนักพัฒนา (Dev Notes):**
-   **ตาราง:** `AssetType` (id, name, description)
-   **การตรวจสอบ:** ชื่อต้องไม่ซ้ำกัน
-   **ความสัมพันธ์:** ตรวจสอบจำนวนในตาราง `Asset` ที่มี `typeId` ตรงกันก่อนทำการลบ

---

### Story 1.2: ลงทะเบียนสินทรัพย์ใหม่ (Register New Asset)
**สถานะ:** ร่าง (Draft)

**Story:**
**ในฐานะ** ผู้จัดการสินทรัพย์,
**ฉันต้องการ** ลงทะเบียนสินทรัพย์ใหม่เข้าสู่ระบบ,
**เพื่อให้** ฉันสามารถเริ่มติดตามสถานะและการมอบหมายของสินทรัพย์นั้นได้

**เกณฑ์การยอมรับ (Acceptance Criteria):**
1.  Admin สามารถเข้าถึงฟอร์ม "เพิ่มสินทรัพย์" ได้
2.  Admin ต้องระบุข้อมูล: รหัสสินทรัพย์ (ห้ามซ้ำ), ชื่อ, ประเภท (เลือก), หมายเลขซีเรียล, สถานะ (ค่าเริ่มต้น: ว่าง/พร้อมใช้)
3.  Admin สามารถระบุข้อมูลเพิ่มเติม (ไม่บังคับ): วันที่ซื้อ, ราคา
4.  ระบบตรวจสอบว่ารหัสสินทรัพย์ไม่ซ้ำกับที่มีอยู่
5.  เมื่อบันทึก สินทรัพย์จะถูกเพิ่มลงในฐานข้อมูลด้วยสถานะ "ว่าง/พร้อมใช้" (เว้นแต่จะระบุเป็นอย่างอื่น)

**งานย่อย (Tasks / Subtasks):**
- [ ] พัฒนาฟอร์มเพิ่มสินทรัพย์
    - [ ] สร้างคอมโพเนนต์ `AssetForm` (ใช้ซ้ำได้สำหรับการแก้ไข)
    - [ ] ดึงข้อมูล `AssetTypes` มาแสดงใน Dropdown
- [ ] พัฒนา Server Action `createAsset`
    - [ ] ตรวจสอบความถูกต้องด้วย Zod (รหัสต้องไม่ซ้ำ)
    - [ ] คำสั่ง Prisma create
- [ ] เพิ่มการจัดการ Toast แจ้งเตือน (สำเร็จ/ผิดพลาด)

**บันทึกสำหรับนักพัฒนา (Dev Notes):**
-   **ตาราง:** `Asset`
-   **UI:** ใช้ `Combobox` สำหรับการเลือกประเภทสินทรัพย์
-   **Flow Diagram:**
    ```mermaid
    graph TD
        A[Admin fills Asset Form] -->|Submit| B(Server Action: createAsset)
        B --> C{Validate Unique Code}
        C -->|Duplicate| D[Return Error]
        C -->|Unique| E[Create Asset in DB]
        E --> F[Return Success]
    ```

---

### Story 1.3: ดูรายการและรายละเอียดสินทรัพย์ (View Asset List & Details)
**สถานะ:** ร่าง (Draft)

**Story:**
**ในฐานะ** ผู้จัดการสินทรัพย์,
**ฉันต้องการ** ดูรายการสินทรัพย์ทั้งหมดและกรองข้อมูลได้,
**เพื่อให้** ฉันสามารถค้นหาสินทรัพย์ที่ต้องการหรือดูว่ามีอะไรว่างอยู่บ้างได้อย่างรวดเร็ว

**เกณฑ์การยอมรับ (Acceptance Criteria):**
1.  Admin เห็นตารางสินทรัพย์ที่มีคอลัมน์: รหัส, ชื่อ, ประเภท, ซีเรียล, สถานะ, ผู้ถือครอง
2.  Admin สามารถค้นหาจาก ชื่อ, รหัส, หรือ หมายเลขซีเรียล
3.  Admin สามารถกรองตาม สถานะ (เช่น แสดงเฉพาะที่ว่าง) และ ประเภท
4.  การคลิกที่แถวของสินทรัพย์จะเปิดหน้าดูรายละเอียดสินทรัพย์
5.  หน้าละเอียดสินทรัพย์แสดงข้อมูลครบถ้วนและผู้ถือครองปัจจุบัน (ถ้ามี)

**งานย่อย (Tasks / Subtasks):**
- [ ] พัฒนาหน้ารายการสินทรัพย์
    - [ ] สร้างคอมโพเนนต์ `AssetTable` พร้อมระบบแบ่งหน้า (Pagination)
    - [ ] พัฒนาช่องค้นหาและตัวกรอง
- [ ] พัฒนาหน้ารายละเอียดสินทรัพย์
    - [ ] ดึงข้อมูลสินทรัพย์ตาม ID (รวมถึง `type` และ `transactions`)
    - [ ] แสดงการ์ดข้อมูล
- [ ] พัฒนา Server Action `getAssets` พร้อม logic การกรอง

**บันทึกสำหรับนักพัฒนา (Dev Notes):**
-   **ประสิทธิภาพ:** ใช้การแบ่งหน้า (เช่น 10 รายการต่อหน้า)
-   **การค้นหา:** ใช้ `contains` ของ Prisma สำหรับฟิลด์ค้นหา

---

## Epic 2: การเบิกจ่ายและรับคืน (Asset Assignment / Operations)

### Story 2.1: เบิกจ่ายสินทรัพย์ (Check-out / Assign to Employee)
**สถานะ:** ร่าง (Draft)

**Story:**
**ในฐานะ** ผู้จัดการสินทรัพย์,
**ฉันต้องการ** มอบหมายสินทรัพย์ที่ว่างอยู่ให้กับพนักงาน,
**เพื่อให้** ระบบบันทึกว่าใครเป็นผู้รับผิดชอบสินทรัพย์ชิ้นนั้นอยู่ในปัจจุบัน

**เกณฑ์การยอมรับ (Acceptance Criteria):**
1.  Admin สามารถเข้าถึงฟอร์ม "เบิกจ่าย" (Check-out)
2.  Admin สามารถค้นหาและเลือก **พนักงาน**
3.  Admin สามารถค้นหาและเลือก **สินทรัพย์**
    *   **ข้อจำกัด:** แสดงหรือเลือกได้เฉพาะสินทรัพย์ที่มีสถานะ `ว่าง/พร้อมใช้` (AVAILABLE) เท่านั้น
4.  Admin บันทึกวันที่มอบหมาย (ค่าเริ่มต้น: วันนี้)
5.  เมื่อยืนยัน:
    *   สถานะสินทรัพย์อัปเดตเป็น `กำลังใช้งาน` (IN_USE)
    *   สร้างบันทึกประวัติ (Transaction log) ด้วยการกระทำ `CHECK_OUT`
    *   ระบบแสดงข้อความสำเร็จ

**งานย่อย (Tasks / Subtasks):**
- [ ] พัฒนา UI การเบิกจ่าย
    - [ ] สร้าง `CheckOutForm`
    - [ ] พัฒนาคอมโพเนนต์ `EmployeeSelect` และ `AssetSelect` (แบบกรองสถานะ)
- [ ] พัฒนา Server Action `assignAsset`
    - [ ] ใช้ `prisma.$transaction`
    - [ ] อัปเดตสถานะสินทรัพย์
    - [ ] สร้างบันทึก Transaction
- [ ] จัดการกรณีแย่งกันกด (Race conditions) (Optimistic check หรือ DB constraint)

**บันทึกสำหรับนักพัฒนา (Dev Notes):**
-   **Transaction:** นี่คือการทำงานที่สำคัญ ต้องใช้ DB transaction เพื่อความถูกต้องของข้อมูล
-   **UI:** `AssetSelect` ควรแสดงสถานะให้เห็นชัดเจน (แม้ว่าจะกรองมาแล้วก็ตาม)
-   **Sequence Diagram:**
    ```mermaid
    sequenceDiagram
        actor Admin
        participant UI as Check-out Form
        participant API as Server Action
        participant DB as Database

        Admin->>UI: Select Asset (Available) & Employee
        UI->>API: assignAsset(assetId, empId)
        API->>DB: Start Transaction
        API->>DB: Update Asset Status -> IN_USE
        API->>DB: Create Transaction Log (CHECK_OUT)
        DB-->>API: Success
        API-->>UI: Return Success
        UI-->>Admin: Show Toast & Redirect
    ```

---

### Story 2.2: รับคืนสินทรัพย์ (Check-in / Return)
**สถานะ:** ร่าง (Draft)

**Story:**
**ในฐานะ** ผู้จัดการสินทรัพย์,
**ฉันต้องการ** บันทึกการรับคืนสินทรัพย์,
**เพื่อให้** สินทรัพย์นั้นพร้อมใช้งานอีกครั้งหรือถูกส่งซ่อม

**เกณฑ์การยอมรับ (Acceptance Criteria):**
1.  Admin สามารถเข้าถึงฟอร์ม "รับคืน" (Check-in)
2.  Admin เลือกสินทรัพย์ที่สถานะปัจจุบันคือ `กำลังใช้งาน` (IN_USE)
3.  Admin ระบุวันที่คืน
4.  Admin **ต้อง** เลือกสถานะใหม่: `ว่าง/พร้อมใช้` (AVAILABLE), `ส่งซ่อม` (MAINTENANCE), หรือ `ตัดจำหน่าย` (RETIRED)
5.  Admin สามารถเพิ่มบันทึกเกี่ยวกับสภาพของสินทรัพย์
6.  เมื่อยืนยัน:
    *   สถานะสินทรัพย์อัปเดตเป็นสถานะใหม่ที่เลือก
    *   สร้างบันทึกประวัติ (Transaction log) ด้วยการกระทำ `CHECK_IN`

**งานย่อย (Tasks / Subtasks):**
- [ ] พัฒนา UI การรับคืน
    - [ ] สร้าง `CheckInForm`
    - [ ] กรอง Asset Select ให้แสดงเฉพาะสินทรัพย์ที่ `IN_USE`
- [ ] พัฒนา Server Action `returnAsset`
    - [ ] `prisma.$transaction`
    - [ ] อัปเดตสถานะสินทรัพย์
    - [ ] สร้างบันทึก Transaction

**บันทึกสำหรับนักพัฒนา (Dev Notes):**
-   **UX:** ควรอนุญาตให้ค้นหาจากชื่อพนักงานเพื่อหาสินทรัพย์ที่เขาถืออยู่ได้
-   **Sequence Diagram:**
    ```mermaid
    sequenceDiagram
        actor Admin
        participant UI as Check-in Form
        participant API as Server Action
        participant DB as Database

        Admin->>UI: Select Asset (In Use)
        Admin->>UI: Select New Status (e.g. Available)
        UI->>API: returnAsset(assetId, status, notes)
        API->>DB: Start Transaction
        API->>DB: Update Asset Status -> New Status
        API->>DB: Create Transaction Log (CHECK_IN)
        DB-->>API: Success
        API-->>UI: Return Success
    ```

---

## Epic 3: แดชบอร์ดและรายงาน (Dashboard & Reporting)

### Story 3.1: ดูภาพรวมแดชบอร์ด (View Dashboard Overview)
**สถานะ:** ร่าง (Draft)

**Story:**
**ในฐานะ** ผู้จัดการสินทรัพย์,
**ฉันต้องการ** เห็นแดชบอร์ดแสดงสถิติสำคัญ,
**เพื่อให้** ฉันรู้สถานะภาพรวมของคลังสินทรัพย์ได้ทันที

**เกณฑ์การยอมรับ (Acceptance Criteria):**
1.  แดชบอร์ดแสดงการ์ดสำหรับ: สินทรัพย์ทั้งหมด, ว่าง, กำลังใช้งาน, ส่งซ่อม
2.  แดชบอร์ดแสดงรายการ "ความเคลื่อนไหวล่าสุด" (5-10 รายการล่าสุด)
3.  การคลิกที่การ์ดสถานะ จะนำทางไปที่หน้ารายการสินทรัพย์ที่กรองสถานะนั้นๆ ไว้แล้ว

**งานย่อย (Tasks / Subtasks):**
- [ ] พัฒนาหน้าแดชบอร์ด
    - [ ] สร้างคอมโพเนนต์ `StatsGrid`
    - [ ] สร้างคอมโพเนนต์ `RecentActivityTable`
- [ ] พัฒนาการดึงข้อมูล (Data Fetching)
    - [ ] `getAssetStats`: นับจำนวนสินทรัพย์แยกตามสถานะ
    - [ ] `getRecentTransactions`: ดึง 10 รายการล่าสุด เรียงตามวันที่จากใหม่ไปเก่า

**บันทึกสำหรับนักพัฒนา (Dev Notes):**
-   **ประสิทธิภาพ:** ใช้ `Promise.all` เพื่อดึงข้อมูลสถิติพร้อมกัน

---

## มาตรฐานการทดสอบ (Testing Standards) - ใช้กับทุก Story
-   **Unit Tests:** Jest + React Testing Library สำหรับ UI components
-   **Integration Tests:** ทดสอบ Server Actions โดยใช้ Test DB หรือ Mocked Prisma
-   **E2E Tests:** Playwright สำหรับ Flow สำคัญ (Check-in/Check-out)
-   **สถานที่เก็บไฟล์:** โฟลเดอร์ `__tests__` ที่อยู่คู่กันหรืออยู่ที่ Root
