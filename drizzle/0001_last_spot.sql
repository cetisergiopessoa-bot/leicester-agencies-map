CREATE TABLE `agencies` (
	`id` varchar(36) NOT NULL DEFAULT 'uuid()',
	`name` text NOT NULL,
	`address` text NOT NULL,
	`phone` text,
	`email` text,
	`website` text,
	`latitude` decimal(10,8) NOT NULL,
	`longitude` decimal(11,8) NOT NULL,
	`description` text,
	`services` text,
	`documentsRequired` text,
	`openingHours` json,
	`region` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `agencies_id` PRIMARY KEY(`id`)
);
