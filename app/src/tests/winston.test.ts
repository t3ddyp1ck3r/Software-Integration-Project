import { logger } from '../middleware/winston';

describe('Winston Logger', () => {
  it('should log info messages', () => {
    const logSpy = jest.spyOn(logger, 'info');
    logger.info('Test info message');
    expect(logSpy).toHaveBeenCalledWith('Test info message');
  });

  it('should log error messages', () => {
    const logSpy = jest.spyOn(logger, 'error');
    logger.error('Test error message');
    expect(logSpy).toHaveBeenCalledWith('Test error message');
  });
});
