CREATE TABLE "suggestion" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"friend_id" text NOT NULL,
	"tmdb_id" text NOT NULL,
	"media_type" text NOT NULL,
	"title" text NOT NULL,
	"year" text,
	"poster" text,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "suggestion" ADD CONSTRAINT "suggestion_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suggestion" ADD CONSTRAINT "suggestion_friend_id_user_id_fk" FOREIGN KEY ("friend_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "suggestion_user_idx" ON "suggestion" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "suggestion_friend_idx" ON "suggestion" USING btree ("friend_id");