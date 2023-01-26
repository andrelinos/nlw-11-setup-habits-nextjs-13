-- CreateTable
CREATE TABLE `habits` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `habit_week_days` (
    `id` VARCHAR(191) NOT NULL,
    `habit_id` VARCHAR(191) NOT NULL,
    `week_day` INTEGER NOT NULL,

    INDEX `habit_week_days_habit_id_idx`(`habit_id`),
    UNIQUE INDEX `habit_week_days_habit_id_week_day_key`(`habit_id`, `week_day`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `days` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,

    UNIQUE INDEX `days_date_key`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `day_habits` (
    `id` VARCHAR(191) NOT NULL,
    `day_id` VARCHAR(191) NOT NULL,
    `habit_id` VARCHAR(191) NOT NULL,

    INDEX `day_habits_habit_id_idx`(`habit_id`),
    UNIQUE INDEX `day_habits_day_id_habit_id_key`(`day_id`(50), `habit_id`(50)),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
