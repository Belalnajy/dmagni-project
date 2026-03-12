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

  dataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL || process.env.DATABASE_POSTGRES_URL,
    entities: [User, Subscription, GenerationHistory, ContactMessage],
    synchronize: true,
    ssl: process.env.DATABASE_URL?.includes("localhost")
      ? false
      : { rejectUnauthorized: false },
  });

  await dataSource.initialize();
  return dataSource;
}
