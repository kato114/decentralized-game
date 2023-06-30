import { MigrationInterface, QueryRunner } from "typeorm";

export class ListingsNulleables1651751185666 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`market_listing\` CHANGE \`thumbnailUrl\` \`thumbnailUrl\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`market_listing\` CHANGE \`description\` \`description\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`market_listing\` CHANGE \`symbol\` \`symbol\` varchar(255) NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`market_listing\` CHANGE \`thumbnailUrl\` \`thumbnailUrl\` varchar(255) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`market_listing\` CHANGE \`description\` \`description\` varchar(255) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`market_listing\` CHANGE \`symbol\` \`symbol\` varchar(255) NOT NULL`
    );
  }
}
