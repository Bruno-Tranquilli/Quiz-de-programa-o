CREATE SCHEMA IF NOT EXISTS `quiz_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `quiz_db` ;

-- -----------------------------------------------------
-- Table `quiz_db`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quiz_db`.`usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username` (`username` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `quiz_db`.`pontuacoes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quiz_db`.`pontuacoes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NOT NULL,
  `pontos` INT NOT NULL,
  `data` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `apelido` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `usuario_id` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `pontuacoes_ibfk_1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `quiz_db`.`usuarios` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 12
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;