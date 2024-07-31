import { logger, stream } from '../middleware/winston';
import winston from 'winston';

describe('Winston Logger', () => {
  it('should create a logger instance', () => {
    expect(logger).toBeDefined();
    expect(logger).toBeInstanceOf(winston.Logger);
  });

  it('should log messages to the file and console', () => {
    const infoSpy = jest.spyOn(logger, 'info');
    logger.info('Test log message');
    expect(infoSpy).toHaveBeenCalledWith('Test log message');
  });

  it('should stream log messages', () => {
    const infoSpy = jest.spyOn(logger, 'info');
    stream.write('Stream log message');
    expect(infoSpy).toHaveBeenCalledWith('Stream log message');
  });
});
