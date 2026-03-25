import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index';

const connectionString = process.env.DATABASE_URL!;

// 用于查询的连接
const queryClient = postgres(connectionString);

// 用于迁移的连接
const migrationClient = postgres(connectionString, { max: 1 });

export const db = drizzle(queryClient, { schema });
export const migrate = () => drizzle(migrationClient, { schema });
