-- CreateTable
CREATE TABLE "Webset" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "searchQuery" TEXT NOT NULL,
    "validationCriterias" TEXT[],
    "enrichmentCriterias" TEXT[],
    "count" INTEGER NOT NULL DEFAULT 10,
    "createdByuserId" TEXT NOT NULL,

    CONSTRAINT "Webset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsetRow" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "originalData" JSONB,
    "validationData" TEXT[],
    "enrichmentData" TEXT[],
    "websetId" TEXT,

    CONSTRAINT "WebsetRow_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Webset" ADD CONSTRAINT "Webset_createdByuserId_fkey" FOREIGN KEY ("createdByuserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebsetRow" ADD CONSTRAINT "WebsetRow_websetId_fkey" FOREIGN KEY ("websetId") REFERENCES "Webset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
