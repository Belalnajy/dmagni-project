import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/user.entity";
import { Subscription } from "./entities/subscription.entity";
import { GenerationHistory } from "./entities/generation-history.entity";
import { ContactMessage } from "./entities/contact-message.entity";

let dataSource: DataSource | null = null;

export async function getDB(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  let dbUrl = process.env.DATABASE_URL || process.env.DATABASE_POSTGRES_URL || "";
  const isLocal = dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1");

  // pg v8.20+ treats sslmode=require as verify-full which fails with Supabase pooler.
  // Remove sslmode from URL and handle SSL via TypeORM config instead.
  if (!isLocal) {
    try {
      const url = new URL(dbUrl);
      url.searchParams.delete("sslmode");
      dbUrl = url.toString();
    } catch {}
  }

  dataSource = new DataSource({
    type: "postgres",
    url: dbUrl,
    entities: [User, Subscription, GenerationHistory, ContactMessage],
    synchronize: true,
    ...(!isLocal && {
      ssl: { rejectUnauthorized: false },
    }),
  });

  await dataSource.initialize();
  return dataSource;
}
