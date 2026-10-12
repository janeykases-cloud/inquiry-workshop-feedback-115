CREATE TABLE `responses` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`session` text NOT NULL,
	`role` text NOT NULL,
	`years` text NOT NULL,
	`payload` text NOT NULL,
	`created` text NOT NULL
);
