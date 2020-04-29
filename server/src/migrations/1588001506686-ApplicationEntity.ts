import {MigrationInterface, QueryRunner} from "typeorm";

export class ApplicationEntity1588001506686 implements MigrationInterface {
    name = 'ApplicationEntity1588001506686'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "request_url_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "applicationId" uuid, CONSTRAINT "PK_bbd69731062dcd431783dfa83bb" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "application_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "publicKey" character varying NOT NULL, "secretKey" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_c999b2d40dd9ad46b17b47fb842" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "request_url_entity" ADD CONSTRAINT "FK_9053d5c38c77355f9c0295e30bb" FOREIGN KEY ("applicationId") REFERENCES "application_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_url_entity" DROP CONSTRAINT "FK_9053d5c38c77355f9c0295e30bb"`, undefined);
        await queryRunner.query(`DROP TABLE "application_entity"`, undefined);
        await queryRunner.query(`DROP TABLE "request_url_entity"`, undefined);
    }

}
