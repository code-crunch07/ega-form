-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "applicantType" TEXT,
ADD COLUMN     "campus" TEXT,
ADD COLUMN     "currentStep" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "digitalSignature" TEXT,
ADD COLUMN     "intake" TEXT,
ADD COLUMN     "major" TEXT,
ADD COLUMN     "privacyAccepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "programmeLevel" TEXT,
ADD COLUMN     "scholarshipApply" BOOLEAN DEFAULT false,
ADD COLUMN     "school" TEXT,
ADD COLUMN     "studyMode" TEXT,
ADD COLUMN     "submittedAt" TIMESTAMP(3),
ADD COLUMN     "termsAccepted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "countryOfBirth" TEXT,
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "emergencyContactName" TEXT,
ADD COLUMN     "emergencyContactPhone" TEXT,
ADD COLUMN     "emergencyContactRelation" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "maritalStatus" TEXT,
ADD COLUMN     "middleName" TEXT,
ADD COLUMN     "nationalId" TEXT,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "passportExpiry" TIMESTAMP(3),
ADD COLUMN     "passportNumber" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "preferredName" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "whatsApp" TEXT;

-- CreateTable
CREATE TABLE "EducationHistory" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "board" TEXT,
    "major" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "grade" TEXT,
    "transcriptUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EducationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmploymentHistory" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "currentlyEmployed" BOOLEAN NOT NULL DEFAULT false,
    "employer" TEXT,
    "position" TEXT,
    "industry" TEXT,
    "yearsExperience" INTEGER,
    "salary" TEXT,
    "resumeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmploymentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnglishTest" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "testName" TEXT NOT NULL,
    "score" TEXT NOT NULL,
    "testDate" TIMESTAMP(3),
    "certificateUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnglishTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EducationHistory" ADD CONSTRAINT "EducationHistory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmploymentHistory" ADD CONSTRAINT "EmploymentHistory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnglishTest" ADD CONSTRAINT "EnglishTest_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
