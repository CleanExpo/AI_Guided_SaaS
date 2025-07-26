import winston from 'winston';
import chalk from 'chalk';

export class Logger {
  private logger: winston.Logger;

  constructor(component: string) {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.printf(({ level, message, timestamp, component }) => {
          const coloredLevel = this.colorizeLevel(level);
          return `${chalk.gray(timestamp)} [${coloredLevel}] ${chalk.cyan(component)}: ${message}`;
        })
      ),
      defaultMeta: { component },
      transports: [new winston.transports.Console()],
    });
  }

  private colorizeLevel(level: string): string {
    switch (level) {
      case 'error':
        return chalk.red(level.toUpperCase());
      case 'warn':
        return chalk.yellow(level.toUpperCase());
      case 'info':
        return chalk.blue(level.toUpperCase());
      case 'debug':
        return chalk.gray(level.toUpperCase());
      default:
        return level.toUpperCase();
    }
  }

  info(message: string, ...args: any[]): void {
    this.logger.info(message, ...args);
  }

  error(message: string, error?: any): void {
    this.logger.error(message, error);
  }

  warn(message: string, ...args: any[]): void {
    this.logger.warn(message, ...args);
  }

  debug(message: string, ...args: any[]): void {
    this.logger.debug(message, ...args);
  }

  success(message: string): void {
    console.log(chalk.green('✓'), message);
  }

  fix(file: string, description: string): void {
    console.log(chalk.yellow('🔧'), `${chalk.cyan(file)}: ${description}`);
  }
}
