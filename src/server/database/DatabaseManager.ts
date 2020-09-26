import * as MariaDb from 'mariadb';

export class DatabaseManager {
  private readonly config: MariaDb.PoolConfig;
  private connection: MariaDb.PoolConnection | undefined = null;

  constructor(config: MariaDb.PoolConfig) {
    this.config = config;
  }

  public open(callback: (connection: MariaDb.PoolConnection, error: Error) => void): void {
    const pool = MariaDb.createPool(this.config);
    pool
      .getConnection()
      .then((connection) => {
        this.connection = connection;
        callback(this.connection, null);
      })
      .catch((error) => {
        callback(null, error);
      });
  }

  public isOpen(): boolean {
    return this.connection != null ? this.connection.isValid() : false;
  }

  public query(query: string, values?: any): Promise<any> {
    return this.connection != null && this.connection.isValid
      ? this.connection.query(query, values)
      : new Promise((resolve, reject) => reject('No database connection!'));
  }

  public getConfig(): MariaDb.PoolConfig {
    return this.config;
  }

  public getConnection(): MariaDb.PoolConnection | undefined {
    return this.connection;
  }
}
