export class Logger {
  static info(message: string): void {
    console.log(`[INFO] [${new Date().toISOString()}] ${message}`);
  }

  static warn(message: string): void {
    console.warn(`\x1b[33m[WARN] [${new Date().toISOString()}] ${message}\x1b[0m`);
  }

  static error(message: string, error?: any): void {
    console.error(`\x1b[31m[ERROR] [${new Date().toISOString()}] ${message}\x1b[0m`, error || '');
  }
}