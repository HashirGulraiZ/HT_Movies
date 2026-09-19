USE htmovie_db;

CREATE TABLE IF NOT EXISTS site_settings (
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
    ('featured_section_description', 'Curated for tonight')
ON DUPLICATE KEY UPDATE setting_key = VALUES(setting_key);
