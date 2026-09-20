-- 003: Detail page fields for movies and TV shows (director, cast, quality badge, likes)
ALTER TABLE `movies`
    ADD COLUMN `director` VARCHAR(255) NULL AFTER `age_rating`,
    ADD COLUMN `cast_members` TEXT NULL AFTER `director`,
    ADD COLUMN `quality` VARCHAR(50) NULL AFTER `cast_members`,
    ADD COLUMN `likes` INT UNSIGNED NOT NULL DEFAULT 0 AFTER `views`;

ALTER TABLE `tv_shows`
    ADD COLUMN `director` VARCHAR(255) NULL AFTER `age_rating`,
    ADD COLUMN `cast_members` TEXT NULL AFTER `director`,
    ADD COLUMN `quality` VARCHAR(50) NULL AFTER `cast_members`,
    ADD COLUMN `likes` INT UNSIGNED NOT NULL DEFAULT 0 AFTER `views`;
