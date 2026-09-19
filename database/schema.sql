CREATE DATABASE IF NOT EXISTS htmovie_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE htmovie_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS site_settings;
DROP TABLE IF EXISTS watch_history;
DROP TABLE IF EXISTS my_lists;
DROP TABLE IF EXISTS movie_cast;
DROP TABLE IF EXISTS tv_show_cast;
DROP TABLE IF EXISTS movie_languages;
DROP TABLE IF EXISTS tv_show_languages;
DROP TABLE IF EXISTS movie_genres;
DROP TABLE IF EXISTS tv_show_genres;
DROP TABLE IF EXISTS episodes;
DROP TABLE IF EXISTS seasons;
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS tv_shows;
DROP TABLE IF EXISTS people;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS languages;
DROP TABLE IF EXISTS live_channels;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE site_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO site_settings (setting_key, setting_value) VALUES
    ('site_name', 'HTMovie'),
    ('site_description', 'A cinematic home for movies, series, live television, and games.'),
    ('hero_title', 'Stories worth staying up for.'),
    ('hero_description', 'Find a sharper kind of streaming: celebrated films, addictive series, live channels, and a little room for the unexpected.'),
    ('hero_image_url', ''),
    ('hero_cta_label', 'Start watching'),
    ('hero_cta_url', '/movies'),
    ('featured_section_title', 'Keep exploring'),
    ('featured_section_description', 'Curated for tonight');

CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(1000) NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    status ENUM('active', 'blocked') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE genres (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT NULL,
    image_url VARCHAR(1000) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE languages (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE people (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(180) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    bio TEXT NULL,
    photo_url VARCHAR(1000) NULL,
    birth_date DATE NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_people_name (name)
) ENGINE=InnoDB;

CREATE TABLE movies (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(280) NOT NULL UNIQUE,
    description TEXT NULL,

    -- URL-first media fields. Can contain external CDN/provider URLs
    -- or your own public URL such as /uploads/movies/example.jpg.
    poster_url VARCHAR(2000) NULL,
    backdrop_url VARCHAR(2000) NULL,
    trailer_url VARCHAR(2000) NULL,
    video_url VARCHAR(2000) NULL,

    duration_minutes SMALLINT UNSIGNED NULL,
    release_year YEAR NULL,
    rating DECIMAL(3,1) NULL,
    age_rating VARCHAR(20) NULL,

    status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    featured TINYINT(1) NOT NULL DEFAULT 0,

    views BIGINT UNSIGNED NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_movies_title (title),
    INDEX idx_movies_year (release_year),
    INDEX idx_movies_status (status),
    INDEX idx_movies_featured (featured),
    INDEX idx_movies_rating (rating)
) ENGINE=InnoDB;

CREATE TABLE tv_shows (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(280) NOT NULL UNIQUE,
    description TEXT NULL,

    poster_url VARCHAR(2000) NULL,
    backdrop_url VARCHAR(2000) NULL,
    trailer_url VARCHAR(2000) NULL,

    release_year YEAR NULL,
    rating DECIMAL(3,1) NULL,
    age_rating VARCHAR(20) NULL,

    status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    featured TINYINT(1) NOT NULL DEFAULT 0,

    views BIGINT UNSIGNED NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_tv_title (title),
    INDEX idx_tv_year (release_year),
    INDEX idx_tv_status (status),
    INDEX idx_tv_featured (featured),
    INDEX idx_tv_rating (rating)
) ENGINE=InnoDB;

CREATE TABLE seasons (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tv_show_id BIGINT UNSIGNED NOT NULL,
    season_number INT UNSIGNED NOT NULL,
    title VARCHAR(255) NULL,
    description TEXT NULL,
    poster_url VARCHAR(2000) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uq_show_season (tv_show_id, season_number),
    CONSTRAINT fk_seasons_show
        FOREIGN KEY (tv_show_id) REFERENCES tv_shows(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE episodes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    season_id BIGINT UNSIGNED NOT NULL,
    episode_number INT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,

    thumbnail_url VARCHAR(2000) NULL,
    video_url VARCHAR(2000) NULL,
    trailer_url VARCHAR(2000) NULL,

    duration_minutes SMALLINT UNSIGNED NULL,
    release_date DATE NULL,

    status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    views BIGINT UNSIGNED NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uq_season_episode (season_id, episode_number),
    INDEX idx_episode_status (status),

    CONSTRAINT fk_episodes_season
        FOREIGN KEY (season_id) REFERENCES seasons(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE movie_genres (
    movie_id BIGINT UNSIGNED NOT NULL,
    genre_id INT UNSIGNED NOT NULL,

    PRIMARY KEY (movie_id, genre_id),

    CONSTRAINT fk_movie_genres_movie
        FOREIGN KEY (movie_id) REFERENCES movies(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_movie_genres_genre
        FOREIGN KEY (genre_id) REFERENCES genres(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE tv_show_genres (
    tv_show_id BIGINT UNSIGNED NOT NULL,
    genre_id INT UNSIGNED NOT NULL,

    PRIMARY KEY (tv_show_id, genre_id),

    CONSTRAINT fk_tv_genres_show
        FOREIGN KEY (tv_show_id) REFERENCES tv_shows(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_tv_genres_genre
        FOREIGN KEY (genre_id) REFERENCES genres(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE movie_languages (
    movie_id BIGINT UNSIGNED NOT NULL,
    language_id INT UNSIGNED NOT NULL,

    PRIMARY KEY (movie_id, language_id),

    CONSTRAINT fk_movie_languages_movie
        FOREIGN KEY (movie_id) REFERENCES movies(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_movie_languages_language
        FOREIGN KEY (language_id) REFERENCES languages(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE tv_show_languages (
    tv_show_id BIGINT UNSIGNED NOT NULL,
    language_id INT UNSIGNED NOT NULL,

    PRIMARY KEY (tv_show_id, language_id),

    CONSTRAINT fk_tv_languages_show
        FOREIGN KEY (tv_show_id) REFERENCES tv_shows(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_tv_languages_language
        FOREIGN KEY (language_id) REFERENCES languages(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE movie_cast (
    movie_id BIGINT UNSIGNED NOT NULL,
    person_id BIGINT UNSIGNED NOT NULL,
    character_name VARCHAR(180) NULL,
    cast_order INT UNSIGNED NOT NULL DEFAULT 0,

    PRIMARY KEY (movie_id, person_id),

    CONSTRAINT fk_movie_cast_movie
        FOREIGN KEY (movie_id) REFERENCES movies(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_movie_cast_person
        FOREIGN KEY (person_id) REFERENCES people(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE tv_show_cast (
    tv_show_id BIGINT UNSIGNED NOT NULL,
    person_id BIGINT UNSIGNED NOT NULL,
    character_name VARCHAR(180) NULL,
    cast_order INT UNSIGNED NOT NULL DEFAULT 0,

    PRIMARY KEY (tv_show_id, person_id),

    CONSTRAINT fk_tv_cast_show
        FOREIGN KEY (tv_show_id) REFERENCES tv_shows(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_tv_cast_person
        FOREIGN KEY (person_id) REFERENCES people(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE my_lists (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    content_type ENUM('movie', 'tv_show') NOT NULL,
    content_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uq_user_content (user_id, content_type, content_id),
    INDEX idx_my_list_user (user_id),

    CONSTRAINT fk_my_list_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE watch_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    content_type ENUM('movie', 'episode') NOT NULL,
    content_id BIGINT UNSIGNED NOT NULL,
    progress_seconds INT UNSIGNED NOT NULL DEFAULT 0,
    duration_seconds INT UNSIGNED NOT NULL DEFAULT 0,
    completed TINYINT(1) NOT NULL DEFAULT 0,
    last_watched_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uq_watch_item (user_id, content_type, content_id),
    INDEX idx_watch_user (user_id),
    INDEX idx_watch_last_watched (last_watched_at),

    CONSTRAINT fk_watch_history_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE live_channels (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(280) NOT NULL UNIQUE,
    description TEXT NULL,

    logo_url VARCHAR(2000) NULL,
    thumbnail_url VARCHAR(2000) NULL,
    stream_url VARCHAR(2000) NULL,

    category VARCHAR(100) NULL,
    language_id INT UNSIGNED NULL,

    is_live TINYINT(1) NOT NULL DEFAULT 0,
    featured TINYINT(1) NOT NULL DEFAULT 0,
    status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_live_status (status),
    INDEX idx_live_featured (featured),

    CONSTRAINT fk_live_language
        FOREIGN KEY (language_id) REFERENCES languages(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE games (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(280) NOT NULL UNIQUE,
    description TEXT NULL,

    thumbnail_url VARCHAR(2000) NULL,
    banner_url VARCHAR(2000) NULL,
    game_url VARCHAR(2000) NULL,

    category VARCHAR(100) NULL,
    featured TINYINT(1) NOT NULL DEFAULT 0,
    status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',

    views BIGINT UNSIGNED NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_games_title (title),
    INDEX idx_games_status (status),
    INDEX idx_games_featured (featured)
) ENGINE=InnoDB;

-- Initial common genres
INSERT INTO genres (name, slug) VALUES
('Action', 'action'),
('Adventure', 'adventure'),
('Animation', 'animation'),
('Comedy', 'comedy'),
('Crime', 'crime'),
('Documentary', 'documentary'),
('Drama', 'drama'),
('Fantasy', 'fantasy'),
('Horror', 'horror'),
('Mystery', 'mystery'),
('Romance', 'romance'),
('Science Fiction', 'science-fiction'),
('Thriller', 'thriller'),
('War', 'war'),
('Western', 'western')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Initial common languages
INSERT INTO languages (name, code) VALUES
('English', 'en'),
('Urdu', 'ur'),
('Hindi', 'hi'),
('Arabic', 'ar'),
('Korean', 'ko'),
('Japanese', 'ja'),
('Spanish', 'es'),
('French', 'fr'),
('Turkish', 'tr'),
('Chinese', 'zh')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Admin creation should be handled by the application using a properly
-- hashed password. Do not insert a plaintext password here.
