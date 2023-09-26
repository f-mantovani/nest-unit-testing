import { BadRequestException } from '@nestjs/common';
import { ParsePokemonIdPipe } from './parse-pokemon-id.pipe';

describe('ParsePokemonIdPipe', () => {
  let pipe: ParsePokemonIdPipe;

  beforeEach(() => {
    pipe = new ParsePokemonIdPipe();
  });

  it('should be defined', () => {
    expect(new ParsePokemonIdPipe()).toBeDefined();
  });

  it('should throw error for non numbers', () => {
    const value = () => pipe.transform(`hello`);
    expect(value).toThrowError(BadRequestException);
  });

  it('should throw error if number is less than 1', () => {
    const value = (numberString: string) => () => pipe.transform(numberString);

    expect(value('0')).toThrowError(BadRequestException);
    expect(value('-34')).toThrowError(BadRequestException);
  });

  it('should throw error if number is greater than 151', () => {
    const value = (numberString: string) => pipe.transform(numberString);
    expect(() => value('152')).toThrowError(BadRequestException);
    expect(() => value('200')).toThrowError(BadRequestException);
  });

  it('should return number if between 1 and 151', () => {
    const value = (numberString: string) => pipe.transform(numberString);

    expect(value('1')).toBe(1);
    expect(value('151')).toBe(151);
    expect(value('64')).toBe(64);
  });
});
