USE htmovie_db;

CREATE TABLE IF NOT EXISTS content_sections (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    page_key VARCHAR(100) NOT NULL,
    section_type ENUM('hero', 'media_row', 'rich_text', 'spacer') NOT NULL DEFAULT 'rich_text',
    title VARCHAR(255) NOT NULL DEFAULT '',
    content TEXT NOT NULL,
    display_order INT UNSIGNED NOT NULL DEFAULT 0,
    enabled TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_sections_page_order (page_key, display_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS homepage_banners (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(280) NOT NULL UNIQUE,
    description TEXT NULL,
    image_url VARCHAR(2000) NOT NULL,
    cta_label VARCHAR(80) NOT NULL DEFAULT 'Watch now',
    display_order INT UNSIGNED NOT NULL DEFAULT 0,
    status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
    movie_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_banners_status_order (status, display_order),
    CONSTRAINT fk_banner_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;
