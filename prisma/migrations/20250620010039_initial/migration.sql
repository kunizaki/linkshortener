-- CreateTable
CREATE TABLE "shortlinks" (
    "id" TEXT NOT NULL,
    "shortId" TEXT NOT NULL,
    "original" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shortlinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accesslogs" (
    "id" TEXT NOT NULL,
    "shortLinkId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAgent" TEXT NOT NULL,
    "ip" TEXT NOT NULL,

    CONSTRAINT "accesslogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shortlinks_shortId_key" ON "shortlinks"("shortId");

-- AddForeignKey
ALTER TABLE "accesslogs" ADD CONSTRAINT "accesslogs_shortLinkId_fkey" FOREIGN KEY ("shortLinkId") REFERENCES "shortlinks"("shortId") ON DELETE CASCADE ON UPDATE CASCADE;
