import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { EnvironmentService } from './environment.service';

describe('EnvironmentService', () => {
  let underTet: EnvironmentService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EnvironmentService, ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue(createMock<ConfigService>())
      .compile();

    underTet = module.get(EnvironmentService);
    configService = module.get(ConfigService);
  });

  describe('getEnvironmentValue', () => {
    it('should return the value of the given key', () => {
      const expectedKey = 'NODE_ENV';
      const expectedValue = 'value';

      const configServiceSpy = jest
        .spyOn(configService, 'getOrThrow')
        .mockReturnValueOnce(expectedValue);

      const actual = underTet.getEnvironmentValue(expectedKey);

      expect(configServiceSpy).toHaveBeenCalledWith(expectedKey);
      expect(actual).toBe(expectedValue);
    });

    it('should throw an error if the given key is not defined', () => {
      const expected = new Error('error');

      jest.spyOn(configService, 'getOrThrow').mockImplementationOnce(() => {
        throw expected;
      });

      expect(() => underTet.getEnvironmentValue('NODE_ENV')).toThrow(expected);
    });
  });

  describe('isProd', () => {
    it('should return true if NODE_ENV is production', () => {
      jest.spyOn(configService, 'getOrThrow').mockReturnValueOnce('production');
      expect(underTet.isProd).toBe(true);
    });

    it('should return false if NODE_ENV is not production', () => {
      jest
        .spyOn(configService, 'getOrThrow')
        .mockReturnValueOnce('non-production');
      expect(underTet.isProd).toBe(false);
    });
  });

  describe('isSwaggerEnabled', () => {
    it('should return true if ENABLE_SWAGGER is true', () => {
      jest.spyOn(configService, 'getOrThrow').mockReturnValueOnce(true);
      expect(underTet.isSwaggerEnabled).toBe(true);
    });

    it('should return false if ENABLE_SWAGGER is false', () => {
      jest.spyOn(configService, 'getOrThrow').mockReturnValueOnce(false);
      expect(underTet.isSwaggerEnabled).toBe(false);
    });
  });
});
