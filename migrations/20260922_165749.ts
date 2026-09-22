import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "learners" (
  	"id" text PRIMARY KEY NOT NULL,
  	"identity_subject" text,
  	"merged_into" text,
  	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
  	CONSTRAINT "learners_identity_subject_unique" UNIQUE("identity_subject")
  );
  
  CREATE TABLE "progress_events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"learner_id" text NOT NULL,
  	"page_id" text NOT NULL,
  	"component_key" text NOT NULL,
  	"content_hash" text,
  	"kind" text NOT NULL,
  	"value" jsonb,
  	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "progress_events" ADD CONSTRAINT "progress_events_learner_id_learners_id_fk" FOREIGN KEY ("learner_id") REFERENCES "public"."learners"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "progress_events_learner_page_idx" ON "progress_events" USING btree ("learner_id","page_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "learners" CASCADE;
  DROP TABLE "progress_events" CASCADE;`)
}
