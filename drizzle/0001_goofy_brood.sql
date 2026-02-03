CREATE TABLE "watch_item" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"tmdb_id" text NOT NULL,
	"media_type" text NOT NULL,
	"title" text NOT NULL,
	"year" text,
	"poster" text,
	"status" text DEFAULT 'watched',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "watch_item" ADD CONSTRAINT "watch_item_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "watch_item_user_idx" ON "watch_item" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "watch_item_tmdb_user_idx" ON "watch_item" USING btree ("user_id","tmdb_id");