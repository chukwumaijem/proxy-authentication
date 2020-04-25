import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateAccountUser1587858272074 implements MigrationInterface {
    name = 'CreateAccountUser1587858272074'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "account_user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying, "last_name" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "last_login_date" TIMESTAMP, "email_verified" boolean NOT NULL DEFAULT false, "invite_accepted_on" TIMESTAMP, "invite_accepted" boolean NOT NULL DEFAULT false, "default_password_changed" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_5eabce4b153e1ced3b922e87397" UNIQUE ("email"), CONSTRAINT "PK_b084442999b27ff6a558471643d" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "account_user_entity"`, undefined);
    }

}
