import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateAccountUser1587929314326 implements MigrationInterface {
    name = 'CreateAccountUser1587929314326'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "account_user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying, "lastName" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "lastLoginDate" TIMESTAMP, "emailVerified" boolean NOT NULL DEFAULT false, "inviteAcceptedOn" TIMESTAMP, "inviteAccepted" boolean NOT NULL DEFAULT false, "defaultPasswordChanged" boolean NOT NULL DEFAULT false, "invitedBy" character varying NOT NULL, CONSTRAINT "UQ_5eabce4b153e1ced3b922e87397" UNIQUE ("email"), CONSTRAINT "PK_b084442999b27ff6a558471643d" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "account_user_entity"`, undefined);
    }

}
