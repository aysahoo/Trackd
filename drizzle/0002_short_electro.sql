CREATE TABLE "friend" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"friend_id" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "friend" ADD CONSTRAINT "friend_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friend" ADD CONSTRAINT "friend_friend_id_user_id_fk" FOREIGN KEY ("friend_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "friend_user_idx" ON "friend" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "friend_friend_idx" ON "friend" USING btree ("friend_id");