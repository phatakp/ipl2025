CREATE TYPE "public"."match_result_type" AS ENUM('runs', 'wickets', 'superover');--> statement-breakpoint
CREATE TYPE "public"."match_status" AS ENUM('completed', 'abandoned', 'scheduled');--> statement-breakpoint
CREATE TYPE "public"."match_type" AS ENUM('league', 'qualifier1', 'qualifier2', 'eliminator', 'final');--> statement-breakpoint
CREATE TYPE "public"."prediction_status" AS ENUM('won', 'lost', 'no_result', 'placed', 'default');--> statement-breakpoint
CREATE TYPE "public"."team_enum" AS ENUM('CSK', 'DC', 'RR', 'RCB', 'MI', 'SRH', 'KKR', 'LSG', 'GT', 'PBKS');--> statement-breakpoint
CREATE TABLE "match_history" (
	"date" timestamp NOT NULL,
	"team1_name" "team_enum" NOT NULL,
	"team2_name" "team_enum" NOT NULL,
	"winner_Name" "team_enum",
	"venue" varchar(191) NOT NULL,
	"result_margin" integer,
	"result_type" "match_result_type",
	"team1_runs" integer DEFAULT 0 NOT NULL,
	"team1_balls" integer DEFAULT 0 NOT NULL,
	"team2_runs" integer DEFAULT 0 NOT NULL,
	"team2_balls" integer DEFAULT 0 NOT NULL,
	"is_league_match" boolean DEFAULT true NOT NULL,
	CONSTRAINT "history_id" PRIMARY KEY("team1_name","team2_name","date")
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"num" integer PRIMARY KEY NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"team1_name" "team_enum",
	"team2_name" "team_enum",
	"winner_name" "team_enum",
	"status" "match_status" DEFAULT 'scheduled' NOT NULL,
	"type" "match_type" DEFAULT 'league' NOT NULL,
	"result_type" "match_result_type",
	"result_margin" integer,
	"venue" varchar(191) NOT NULL,
	"is_double_played" boolean DEFAULT false NOT NULL,
	"min_stake" integer DEFAULT 30 NOT NULL,
	"team1_runs" integer DEFAULT 0 NOT NULL,
	"team1_wickets" integer DEFAULT 0 NOT NULL,
	"team1_balls" integer DEFAULT 0 NOT NULL,
	"team2_runs" integer DEFAULT 0 NOT NULL,
	"team2_wickets" integer DEFAULT 0 NOT NULL,
	"team2_balls" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "predictions" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"match_num" integer,
	"user_id" varchar NOT NULL,
	"team_name" "team_enum",
	"status" "prediction_status" DEFAULT 'placed' NOT NULL,
	"is_double" boolean DEFAULT false NOT NULL,
	"is_ipl_winner" boolean DEFAULT false NOT NULL,
	"is_updated" boolean DEFAULT false NOT NULL,
	"amount" integer NOT NULL,
	"result_amt" real DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"user_id" varchar(256) PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"image_url" text,
	"first_name" varchar(256) NOT NULL,
	"last_name" varchar(256),
	"balance" real DEFAULT 0 NOT NULL,
	"doubles_left" integer DEFAULT 5 NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"is_paid" boolean DEFAULT false NOT NULL,
	"team_name" "team_enum",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "stats" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"team1_name" "team_enum" NOT NULL,
	"team2_name" "team_enum",
	"played" integer DEFAULT 0 NOT NULL,
	"won" integer DEFAULT 0 NOT NULL,
	"lost" integer DEFAULT 0 NOT NULL,
	"home_played" integer DEFAULT 0 NOT NULL,
	"home_won" integer DEFAULT 0 NOT NULL,
	"away_played" integer DEFAULT 0 NOT NULL,
	"away_won" integer DEFAULT 0 NOT NULL,
	"bat_first_played" integer DEFAULT 0 NOT NULL,
	"bat_first_won" integer DEFAULT 0 NOT NULL,
	"bat_second_played" integer DEFAULT 0 NOT NULL,
	"bat_second_won" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"short_name" "team_enum" PRIMARY KEY NOT NULL,
	"long_name" text NOT NULL,
	"played" integer DEFAULT 0 NOT NULL,
	"won" integer DEFAULT 0 NOT NULL,
	"lost" integer DEFAULT 0 NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"nrr" real DEFAULT 0 NOT NULL,
	"for_runs" integer DEFAULT 0 NOT NULL,
	"for_balls" integer DEFAULT 0 NOT NULL,
	"against_runs" integer DEFAULT 0 NOT NULL,
	"against_balls" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "teams_long_name_unique" UNIQUE("long_name")
);
--> statement-breakpoint
ALTER TABLE "match_history" ADD CONSTRAINT "match_history_team1_name_teams_short_name_fk" FOREIGN KEY ("team1_name") REFERENCES "public"."teams"("short_name") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_history" ADD CONSTRAINT "match_history_team2_name_teams_short_name_fk" FOREIGN KEY ("team2_name") REFERENCES "public"."teams"("short_name") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_history" ADD CONSTRAINT "match_history_winner_Name_teams_short_name_fk" FOREIGN KEY ("winner_Name") REFERENCES "public"."teams"("short_name") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_team1_name_teams_short_name_fk" FOREIGN KEY ("team1_name") REFERENCES "public"."teams"("short_name") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_team2_name_teams_short_name_fk" FOREIGN KEY ("team2_name") REFERENCES "public"."teams"("short_name") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_winner_name_teams_short_name_fk" FOREIGN KEY ("winner_name") REFERENCES "public"."teams"("short_name") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_match_num_matches_num_fk" FOREIGN KEY ("match_num") REFERENCES "public"."matches"("num") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_user_id_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_team_name_teams_short_name_fk" FOREIGN KEY ("team_name") REFERENCES "public"."teams"("short_name") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_team_name_teams_short_name_fk" FOREIGN KEY ("team_name") REFERENCES "public"."teams"("short_name") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "match_unique_idx" ON "matches" USING btree ("team1_name","team2_name","date");--> statement-breakpoint
CREATE UNIQUE INDEX "pred_unique_idx" ON "predictions" USING btree ("match_num","user_id");--> statement-breakpoint
CREATE INDEX "profile_balance_idx" ON "profiles" USING btree ("balance");--> statement-breakpoint
CREATE UNIQUE INDEX "stats_unique_idx" ON "stats" USING btree ("team1_name","team2_name");--> statement-breakpoint
CREATE INDEX "team_name_idx" ON "teams" USING btree ("long_name");