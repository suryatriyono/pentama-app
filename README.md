This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Penilaian Tugas Akhir Mahasiswa

A. Layanan yang ingin di capai pada aplikasi PENTAMA(Penilaian Tugas Akhir Mahasiswa):

    1. Peran Student:
      a. Dashboard:
      Didalam dashboard terdapat:
        - Final Project Information
          Yang di dalamnya berisi: Title dan Research Field
        - Comittee Members
          Yang di dalamnya berisi: Supervisors 1 dan 2 serta Examiners 1 dan 2
      b. Profile
        Yang berisi informasi STUDENT
      c. Proposal (Seminar Proposal)
        Dimana STUDENT menginputkan:
        - Title
        - Research Field
        - Supervisors 1 dan 2
        - File
      d.Result (Seminar Hasil)
        Dimana STUDENT menginputkan:
        - Title
        - File
      e. Session (Sidang Skripsi)
        Dimana STUDENT menginputkan:
        - Title
        - File

    2. Peran Lecturer:
      a. Dashboard:
        Dimana di dalamnya terdapat:
        - Jumlah STUDENT yang di uji
        - Jumlah STUDENT yang di bimbing
        - Jadwal pengujian (Seminar Proposal or Seminar Hasil or Sidang Skripsi).
      b. Proposal (Seminar Proposal):
        Dimana didalamnya terdapat Tabel data STUDENT Seminar Proposal dengan aksi input nilai.
      c. Result (Seminar Hasil):
        Dimana didalamnya terdapat Tabel data STUDENT Seminar Hasil dengan aksi input nilai.
      d. Session (Sidang Skripsi):
        Dimana didalamnya terdapat Tabel data STUDENT Sidang Skripsi dengan aksi input nilai.

    3. Peran Admin:
      a. Dashboard:
      Dimana di dalamnya terdapat:
        Jumlah STUDENT berdasarkan tahapan (seminar proposal, seminar hasil dan sidang)
      b. Proposal (Seminar Proposal):
        Diama di dalamnya terdapat tabel data STUDENT Seminar Proposal yang include dengan Supervisors 1 && 2, Examiners 1 && 2, serta aksi untuk merubah Supervisors, Examiners , Jadwal dan Ruangan.
      c. Result (Seminar Hasil):
        Dimana di dalamnya terdapat tabel data STUDENT Seminar Hasil yang include dengan Supervisors 1 && 2, Examiners 1 && 2, serta aksi untuk merubah Supervisors, Examiners , Jadwal dan Ruangan.
      d. Session (Sidang Skripsi):
        Dimana di dalamnya terdapat tabel data STUDENT Sidang Skripsi yang include dengan Supervisors 1 && 2, Examiners 1 && 2, serta aksi untuk merubah Supervisors, Examiners , Jadwal dan Ruangan.
      e. Grade (Nilai):
        Dimana di dalamnya terdapat tabel data nilai Seminar Proposal, Seminar Hasil dan Sidang Skripsi setiap STUDENT

B. Ranacangn sistem untuk mencapai Layanan aplikasi:

    1. Register
      Pada saat user melakukan registrasi, akan di sajikan form registrasi yang berisi: Identitas(nim/nip), Password, dan Konfirmasi Password, aplikasi akan cukup cerdas mengindetifikasi yang di inputan user tersebut termasuk nim/nip yang valid, dan sistem aka mengekstrak nim or nip untuk mengambil data yang sesuai untuk di masukan kedalam kolekasi Lecturer(nip) dan Student(nim). Untuk nip saya yakin kamu telah mengerti, sitiap digit nip itu apa maskudnya, berikut adalah ketentuan nim:
      example H1051211028
        H ==> kode fakultas (MIPA)
        1 ==> kode jenjang pendidikan
        05 ==> kode program studi
        1 ==> kode program reguler/non reguler
        21 ==> kode tahun(angkatan)
        1 ==> kode semester masuk pertama kali sebagai mahasiswa
        028 ==> no urutan pendaftaran di fakultas
      berikut adalah penjelasan yang lebih rinci:
        Digit 1 kode fakultas
        Digit 2 jenjang pendidikan (0 diplima, 1 S1, 2 S2, 3 S3)
        Digit 3 dan 4 urutan jurusan dan prodi
        Digit 5 program reguler/non reguler
        Digit 6 dan 7 tahun masuk
        Digit 8 kode semester
        Digit 9 10 11 urutan pendaftaran di fakultas

    2. Login
      Ketika user belum berhasil login maka halaman yang boleh di akses adalah:
        - "/" Landing
        - "/login" login
        - "/register" register
      selain halaman public tersebut maka akan di redirect ke "/". Kemudian berikut adalah halaman user dan ketentuanya:
        - "/" Dashboard
        - "/proposal" Proposal
        - "/result" Result
        - "/hearing" Hearing
      Nah jika di perhatikan ada yang unik dari sebuah route halaman yaitu "/" nah ini nanti tampilanya akan menyesuaikan beradasrkan user jika belum berhasil login maka Landing jika sudah maka di check lagi apake user tersebut Student, Lecturer atau Admin sehingga tampilnya akan menyesuikan lagi.
      Kemudain setelah berhasil login maka akan di redirect ke "/" Dashboard dan di check apa role user tersebut agar tampilnya sesuai. Namun meskupun di redirec ke "/" ada penggecekan lagi untuk mengetahui apakh data user tersebut sudah lengkap ada belum yah meskipun ada data yang di ambil secara otomatis dari nim or nip tidak menuntuk kemungkin ada data yang harus dinputka sediri, jika belum lengkap maka akan di arahkan ke "/profile" agar user dapat melengkapi profilenya dan user tidak dapat mengakses halaman manapun selain "/profle" seblum melengkapi data diri.
      Kemudian ada tambahan ketentuan untuk role Student selain ketentun tersebut yang sama dengan Lecturer dan Admin ada ketentuan yang lebih ketat untuk Student, Jika Proposal belum selesai maka Result dan Hearing tidak adapat di akses, Result akan dapat di akses ketika Proposal sudah selesai dan Hearing akan dapat di akses ketika Proposal dan Result sudah selesai.

    3. Penilaian.
      Setelah Student mengrimkan proposal maka sistem akan dengan cerdas menentukan Examiners 1 dan 2 serta ruangan dan jadwal, sehingaa di proposal pada admin akan mucul data yang di kirmkan tersebut berupa data STUDENT Seminar Proposal yang include dengan Supervisors 1 && 2, Examiners 1 && 2, serta aksi untuk merubah Supervisors, Examiners , Jadwal dan Ruangan. Nah meskipun data sudah otomatis terisi untuk jaga-jaga jika ruang sedang di renovasi atau digunakan, lecurer yang di tentukan sistem sedang ada halangan sehingga tidak dapat melakukan penilaian dan juga jika ada perubahan jadwal dan tombol aksi ini akan disable ketika lewat dari 3 hari. selanjutnya proposal di Lecturer yang terpilih sebagai Exmainer dan Supervisor akan sama seperti Admin tadi hanya saja melakukan penilaian serta di dashboard terdapat jadwal, dan di Student juga terdapat jadwal dan ruangan yang telah di tentukan, meskipun admin tidak melakukan apa-apa, seistem sudah cerdas menentukan Examiners 1 dan 2 serta ruangan dan jadwal sehingga secara real time setalah student mengirimkan proposal di admin,lectuer serta student itu sendiri terdapat data baru.
      Proposal(seminar proposal) ini adalah penentuan apakah Student tersebut lolos atau tidak, jika nila dari ke 4 penilai yaitu Supervisor 1 dan 2  serta Exminer 1 dan 2 itu < 70 maka student harus mengulang kembail proposal, kemuadin jika >= 70 maka lolos dan bisa lanjut ke tahap result, Result(seimar hasil) ini sama seperti Proposal yaitu menginputkan data namum sistem tidak lagi menentukan Examiners 1 dan 2 namun hanya menentukan ruangan dan jadwal,dan aksi hanya bisa mengubah ruangan dan jadwal setalah 3 hari aksi sudah tidak bisa di gunkan lagi, untuk di lecturer pada Result sama seperti proposal tadi dan jadwal lama yang mungkin telah selesai akan di gantu dengan jdawal baru, begitu pun di Student, dan setelah Result ini selsai maka barulah student bisa lanjut ke tahap Hearing, yang sama seperti Result. Kemudain untuk nilai final projek dimablik dari 0.4(40%) nilai Result dan 0.6(60%) nilai Hearing berapaun itu itu lah nilanya dan sudah pasti lolos.

## Konfigurai MongoDB⚙️

1. Frist
   Donwnload and Install MongoDB, MongoDB Shell and MogoDB Compass [here](https://www.mongodb.com/try/download/community)
2. Login to MongoDB Shell as Administrator


    ```bash
        mongosh
    ```

3. Create admin for MongoDB


    ```bash
      use admin
      db.createUser({
      user: "alfy",
      pwd: "rahasiaalfy",
      roles: [
          { role: "userAdminAnyDatabase", db: "admin" },
          { role: "readWriteAnyDatabase", db: "admin" },
          { role: "hostManager", db: "admin"},
          { role: "clusterManager", db: "admin"},
          { role: "clusterMonitor", db: "admin"}
        ]
      });
    ```

4. Create user for managine database in your application project


    ```bash
      use pentama-db
      db.createUser({
        user: "pentama",
        pwd: "Salmon123",
        roles: [
          { role: "readWrite", db: "pentama-db" }
        ]
      });
    ```

5. Make sure 'your_very_secret_key' is a long adn secure key. For example, you could user (use is administrator):


    - Create key file
      ```bash
        echo "lRKjx5HhDQ8pamx40Put6uDx0i3J8xAiVBlpcjH6/X0=" > C:\Program Files\MongoDB\Server\8.0\bin\alfy.key
      ```
    - Check the user's identity to perfrom the next step
      ```bash
        whoami
      ```
    - Set key file permissions
      ```bash
        cd "C:\Program Files\MongoDB\Server\8.0\bin"
        icacls your.key /inheritance:r
        icacls your.key /grant "your_user_indentitiy":R
      ```
    - Set authentication konfiguration in mongod.cfg
      ```bash
        # MongoDB Configuration File
        storage:
          dbPath: D:\Your\MongoDB\data  #  Replace eith the appropriate pat

        systemLog:
          destination: file
          logAppend: true
          path: C:\Program Files\MongoDB\Server\8.0\log\mongod.log  # Replacte path if needed

        net:
          bindIp: 127.0.0.1  # Add IP if needed
          port: 27017

        # Security configuration
        security:
          authorization: enabled
          keyFile: "C:/Program Files/MongoDB/Server/8.0/bin/your.key"  # Path ke key file

        # Reolication configuration
        replication:
          replSetName: rs0
      ```
    - Restart your MongoDB
      ```bash
        # Stop MongoDB
        net stop MongoDB
        # Start MongoDB
        net start MongoDB
      ```
    - When the MongoDB server does not running then do this✨:
      ```bash
        mongod --config "C:\Program Files\MongoDB\Server\8.0\bin\mongod.cfg"
      ```
    - Then log back into the MongoDB Shell dan do the following instructions:
      ```bash
        mongosh "mongodb://adminUser:strongAdminPassword@localhost:27017"
        _______________________________________________________________________
        rs.initiate({_id: "rs0", members: [{_id: 0, host:"localhost:27017"}]})
      ```

6. Schema prisma example:


    ```prisma
      generator client {
        provider = "prisma-client-js"
      }

      datasource db {
        provider = "mongodb"
        url      = env("DATABASE_URL")
      }

      enum Role {
        STUDENT // Mahasiswa
        LECTURER // Dosen
      }

      enum Expertise {
        AES // Applied Enterprise System
        NIC // Network and Infrastructure Computing
      }

      enum FinalProjectStage {
        PROPOSAL // Seminar Proposal
        RESULT // Seminar Hasil
        FINAL // Sidang
        COMPLETED // Selesai
      }

      enum FinalProjectStatus {
        DRAFT // Tugas Akhir dalam proses pengajuan awal oleh mahasiswa
        SUBMITTED // Tugas Akhir telah diajukan (proposal, hasil, atau final)
        REVIEWED // Tugas Akhir telah dinilai oleh semua penguji
        PASSED // Tugas Akhir lulus tahapan
        FAILED // Tugas Akhir tidak lulus tahapan
        COMPLETED // Tugas Akhir telah selesai semua tahapannya
      }

      enum Position {
        LEKTOR_KEPALA // Jenjang Lektor Kepala
        PROFESOR // Jenjang Profesor
        ASISTEN_AHLI // Jenjang Asisten Ahli
        LEKTOR // Jenjang Lektor
      }

      enum AssessorRole {
        CHAIRPERSON // Ketua (Pembimbing 1)
        SECRETARY // Sekretaris (Pembimbing 2)
        EXAMINER_1 // Penguji 1
        EXAMINER_2 // Penguji 2
      }

      enum AssessmentStatus {
        DRAFT // Penilaian sedang diisi, belum fina
        SUBMITTED // Penilaian telah diserahkan dan final
        FINALIZED // Penilaian telah difinalisasi
      }

      model User {
        id          String       @id @default(auto()) @map("_id") @db.ObjectId
        password    String
        role        Role
        createdAt   DateTime     @default(now())
        updatedAt   DateTime     @updatedAt
        // Relasi berdasarkan peran
        student     Student?
        lecturer    Lecturer?
        // Relasi dengan Assessment
        assessments Assessment[] @relation("Assessor")
      }

      model Student {
        id              String        @id @default(auto()) @map("_id") @db.ObjectId
        nim             String        @unique
        faculty         String // Fakultas
        education_level String // Tingkat Pendidikan
        studyProgram    String // Program studi
        batch           String // Tahun angkatan
        researchField   Expertise // Bidang penelitian
        avatarUrl       String        @default("/uploads/images/student.png")
        createdAt       DateTime      @default(now())
        updatedAt       DateTime      @updatedAt
        // Relasi dengan User (student)
        user            User          @relation(fields: [userId], references: [id])
        userId          String        @unique @db.ObjectId
        // Relasi dengan FinalProject
        finalProject    FinalProject?
      }

      model Lecturer {
        id               String            @id @default(auto()) @map("_id") @db.ObjectId
        nip              String            @unique
        position         Position // Jabatan
        expertise        Expertise //  Keahlian (AES/NIC)
        avatarUrl        String            @default("/uploads/images/lecturer.png")
        // Ketentuan beban kerja dosen
        examiningCount   Int               @default(0) // Peran sebagai penguji tim penguji
        chairCount       Int               @default(0) // Peran sebagai ketua tim penguji
        secretaryCount   Int               @default(0) // Peran sebagai sekretaris tim penguji
        createdAt        DateTime          @default(now())
        updatedAt        DateTime          @updatedAt
        // Relasi dengan User (lecturer)
        user             User              @relation(fields: [userId], references: [id])
        userId           String            @unique @db.ObjectId
        // Relasi dengan tim penguji
        chairpersonTeams ExaminationTeam[] @relation("ChairpersonRole")
        secretaryTeams   ExaminationTeam[] @relation("SecretaryRole")
        examinerTeams1   ExaminationTeam[] @relation("ExaminerOne")
        examinerTeams2   ExaminationTeam[] @relation("ExaminerTwo")
      }

      model FinalProject {
        id                String             @id @default(auto()) @map("_id") @db.ObjectId
        researchField     Expertise
        currentStage      FinalProjectStage  @default(PROPOSAL)
        status            FinalProjectStatus @default(DRAFT) // Status Tugas Akhir
        attemptCount      Int                @default(0) // Jumlah percobaan
        // Nilai akhir (setelah semua tahap selesai)
        finalGrade        Float?
        completedAt       DateTime?
        createdAt         DateTime           @default(now())
        updatedAt         DateTime           @updatedAt
        // Relasi dengan Student
        student           Student            @relation(fields: [studentId], references: [id])
        studentId         String             @unique @db.ObjectId
        // Relasi dengan Tim Penguji
        examinationTeamId String?            @db.ObjectId
        examinationTeam   ExaminationTeam?   @relation(fields: [examinationTeamId], references: [id])
        // Relasi dengan semua tahapan
        proposal          Proposal?
        result            Result?
        hearing           Hearing?
        // Relasi dengan tim penguji
      }

      model Proposal {
        id              String             @id @default(auto()) @map("_id") @db.ObjectId
        title           String
        filePath        String
        status          FinalProjectStatus @default(DRAFT)
        // Jadwal dan lokasi seminar proposal
        seminarDate     DateTime
        seminarLocation String
        revisionCount   Int                @default(0) // Jumlah revisi yang telah dilakukan
        // Relasi dengan FinalProject
        finalProject    FinalProject       @relation(fields: [finalProjectId], references: [id])
        finalProjectId  String             @unique @db.ObjectId
        // Nilai rata-rata (dihitung dari semua penilaian)
        averageGrade    Float
        createdAt       DateTime           @default(now())
        updatedAt       DateTime           @updatedAt
        // Relasi dengan Assessment
        Assessment      Assessment[]
      }

      model Result {
        id              String             @id @default(auto()) @map("_id") @db.ObjectId
        title           String
        filePath        String
        status          FinalProjectStatus @default(DRAFT)
        // Jadwal dan lokasi seminar hasil
        seminarDate     DateTime
        seminarLocation String
        // Relasi dengan FinalProject
        finalProject    FinalProject       @relation(fields: [finalProjectId], references: [id])
        finalProjectId  String             @unique @db.ObjectId
        // Nilai rata-rata (dihitung dari semua penilaian)
        averageGrade    Float
        createdAt       DateTime           @default(now())
        updatedAt       DateTime           @updatedAt
        // Relasi dengan Assessment
        Assessment      Assessment[]
      }

      model Hearing {
        id              String             @id @default(auto()) @map("_id") @db.ObjectId
        title           String
        filePath        String
        status          FinalProjectStatus @default(DRAFT)
        // Jadwal dan lokasi sidang
        hearingDate     DateTime?
        hearingLocation String?
        // Relasi dengan FinalProject
        finalProject    FinalProject       @relation(fields: [finalProjectId], references: [id])
        finalProjectId  String             @unique @db.ObjectId
        // Nilai rata-rata (dihitung dari semua penilaian)
        averageGrade    Float?
        createdAt       DateTime           @default(now())
        updatedAt       DateTime           @updatedAt
        // Relasi dengan Assessment
        Assessment      Assessment[]
      }

      model ExaminationTeam {
        id             String       @id @default(auto()) @map("_id") @db.ObjectId
        finalProjectId String       @unique @db.ObjectId
        finalProject   FinalProject @relation(fields: [finalProjectId], references: [id])
        // Relasi dengan Lecturer untuk berbagai peran
        chairpersonId  String?      @db.ObjectId
        chairperson    Lecturer?    @relation("ChairpersonRole", fields: [chairpersonId], references: [id])
        secretaryId    String?      @db.ObjectId
        secretary      Lecturer?    @relation("SecretaryRole", fields: [secretaryId], references: [id])
        examiner1Id    String       @db.ObjectId
        examiner1      Lecturer     @relation("ExaminerOne", fields: [examiner1Id], references: [id])
        examiner2Id    String       @db.ObjectId
        examiner2      Lecturer     @relation("ExaminerTwo", fields: [examiner2Id], references: [id])
        createdAt      DateTime     @default(now())
        updatedAt      DateTime     @updatedAt
      }

      model Assessment {
        id                String            @id @default(auto()) @map("_id") @db.ObjectId
        assessorRole      AssessorRole // Peran penilai
        stage             FinalProjectStage // Tahap proyek yang dinilai
        status            AssessmentStatus  @default(DRAFT) // Status penilaian
        assessmentDate    DateTime? // Tanggal penilaian dilakukan
        // Kriteria penilaian (opsional, jika aplikasi membutuhkan kriteria terpisah)
        contentGrade      Float? // Nilai untuk konten/substansi
        presentationGrade Float? // Nilai untuk presentasi
        methodologyGrade  Float? // Nilai untuk metodologi
        comments          String? // Komentar/catatan dari penilai
        // Relasi dengan User (penilai)
        assessor          User              @relation("Assessor", fields: [assessorId], references: [id])
        assessorId        String            @db.ObjectId
        // Relasi dengan tahapan yang dinilai (menggunakan satu relasi berdasarkan stage)
        proposal          Proposal          @relation(fields: [proposalId], references: [id])
        proposalId        String            @db.ObjectId
        result            Result            @relation(fields: [resultId], references: [id])
        resultId          String            @db.ObjectId
        hearing           Hearing           @relation(fields: [hearingId], references: [id])
        hearingId         String            @db.ObjectId
      }

    ```
