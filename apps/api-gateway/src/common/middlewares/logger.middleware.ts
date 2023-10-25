import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  /**
   * Create Log instance
   * @private
   */
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    /**
     * Log every request with its details
     */
    this.logger.log({
      headers: req.headers,
      body: req.body,
      originalUrl: req.originalUrl,
    });
    /**
     * Move on
     */
    if (next) next();
  }
}
