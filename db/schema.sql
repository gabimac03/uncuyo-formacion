-- Crear base
CREATE DATABASE IF NOT EXISTS portal_alerta
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE portal_alerta;

-- Usuarios
CREATE TABLE IF NOT EXISTS users (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username       VARCHAR(100)    NOT NULL,
  password_hash  VARCHAR(255)    NOT NULL,
  created_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username (username)
) ENGINE=InnoDB;

-- Auditoría de login
CREATE TABLE IF NOT EXISTS login_audit (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username    VARCHAR(100)    NOT NULL,
  success     TINYINT(1)      NOT NULL,
  ip          VARCHAR(64)     NULL,
  user_agent  VARCHAR(255)    NULL,
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX ix_login_audit_user_time (username, created_at)
) ENGINE=InnoDB;

-- Catálogo de módulos
CREATE TABLE IF NOT EXISTS modules (
  id          INT UNSIGNED    NOT NULL,
  title       VARCHAR(120)    NOT NULL,
  release_at  DATE            NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Historial de resultados (cada intento)
CREATE TABLE IF NOT EXISTS module_results (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id       BIGINT UNSIGNED NOT NULL,
  module_id     INT UNSIGNED    NOT NULL,
  score         INT             NOT NULL,
  total         INT             NOT NULL,
  passed        TINYINT(1)      NOT NULL,
  passed_pct    INT             NOT NULL,
  question_ids  TEXT            NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_results_user_module_time (user_id, module_id, created_at),
  CONSTRAINT fk_res_user   FOREIGN KEY (user_id)  REFERENCES users(id)   ON DELETE CASCADE,
  CONSTRAINT fk_res_module FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Estado “último resultado” por usuario/módulo
CREATE TABLE IF NOT EXISTS user_module_status (
  user_id        BIGINT UNSIGNED NOT NULL,
  module_id      INT UNSIGNED    NOT NULL,
  last_result_id BIGINT UNSIGNED NOT NULL,
  last_passed    TINYINT(1)      NOT NULL,
  last_score     INT             NOT NULL,
  last_total     INT             NOT NULL,
  last_pct       INT             NOT NULL,
  updated_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, module_id),
  CONSTRAINT fk_ums_user        FOREIGN KEY (user_id)        REFERENCES users(id)          ON DELETE CASCADE,
  CONSTRAINT fk_ums_module      FOREIGN KEY (module_id)      REFERENCES modules(id)        ON DELETE RESTRICT,
  CONSTRAINT fk_ums_last_result FOREIGN KEY (last_result_id) REFERENCES module_results(id) ON DELETE CASCADE
) ENGINE=InnoDB;

USE portal_alerta;


-- Crea tabla de certificados para solicitar -- 
CREATE TABLE IF NOT EXISTS certificate_requests (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id       BIGINT UNSIGNED NOT NULL,
  request_year  INT             NOT NULL,
  status        ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_year (user_id, request_year),
  CONSTRAINT fk_cert_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Crea tabla de restet password --

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id      BIGINT UNSIGNED NOT NULL,
  token_hash   CHAR(64)        NOT NULL,        -- SHA-256 del token
  expires_at   DATETIME        NOT NULL,        -- vence (ej. +30 min)
  used_at      DATETIME        NULL,            -- marcado cuando se usa
  created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_user (user_id),
  CONSTRAINT fk_prt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);