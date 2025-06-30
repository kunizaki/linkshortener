CREATE TABLE "accesslogs" (
	"id" text PRIMARY KEY NOT NULL,
	"shortLinkId" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"userAgent" text NOT NULL,
	"ip" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shortlinks" (
	"id" text PRIMARY KEY NOT NULL,
	"shortId" text NOT NULL,
	"original" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "shortlinks_shortId_unique" UNIQUE("shortId")
);
--> statement-breakpoint
ALTER TABLE "accesslogs" ADD CONSTRAINT "accesslogs_shortLinkId_shortlinks_shortId_fk" FOREIGN KEY ("shortLinkId") REFERENCES "public"."shortlinks"("shortId") ON DELETE cascade ON UPDATE no action;