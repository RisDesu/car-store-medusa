import { Migration } from '@mikro-orm/migrations';

export class Migration20250625172420 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "brand" drop constraint if exists "brand_handle_unique";`);
    this.addSql(`create table if not exists "brand" ("id" text not null, "name" text not null, "image" text null, "handle" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "brand_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_brand_handle_unique" ON "brand" (handle) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_brand_deleted_at" ON "brand" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "brand" cascade;`);
  }

}
