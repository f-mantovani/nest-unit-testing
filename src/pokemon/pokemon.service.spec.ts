import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DeepMocked, createMock } from '@golevelup/ts-jest';

describe('PokemonService', () => {
  let pokemonService: PokemonService;
  let httpService: DeepMocked<HttpService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonService],
    })
      .useMocker(createMock)
      .compile();

    pokemonService = module.get<PokemonService>(PokemonService);
    httpService = module.get(HttpService);
  });

  it('should be defined', () => {
    expect(pokemonService).toBeDefined();
  });

  describe('Get pokemon', () => {
    it('should prevent get pokemon with id less than 1', async () => {
      const getPokemon = pokemonService.getPokemon(0);

      await expect(getPokemon).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should prevent get pokemon with id greater than 152', async () => {
      const getPokemon = pokemonService.getPokemon(152);

      await expect(getPokemon).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should get pokemon with id between 1 and 151', async () => {
      httpService.axiosRef.mockResolvedValueOnce({
        data: {
          species: {
            name: `bulbasaur`,
          },
        },
        headers: {},
        config: { url: '' },
        status: 200,
        statusText: '',
      });

      const getPokemon = pokemonService.getPokemon(1);

      await expect(getPokemon).resolves.toBe('bulbasaur');
    });

    it('should throw an error if Pokemon API response unexpectedly changes', async () => {
      httpService.axiosRef.mockResolvedValueOnce({
        data: 'Unexpected data',
        headers: {},
        config: { url: '' },
        status: 200,
        statusText: '',
      });

      const getPokemon = pokemonService.getPokemon(1);

      await expect(getPokemon).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });
});
