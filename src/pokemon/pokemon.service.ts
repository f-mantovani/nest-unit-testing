import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class PokemonService {
  baseUrl: string;
  constructor(private httpService: HttpService) {
    this.baseUrl = `https://pokeapi.co/api/v2/pokemon`;
  }

  async getPokemon(id: number) {
    if (id < 1 || id > 151) throw new BadRequestException(`Ivalid Pokemon ID`);

    const { data } = await this.httpService.axiosRef({
      url: `${this.baseUrl}/${id}`,
      method: `get`,
    });

    if (!data || !data.species || !data.species.name) {
      throw new InternalServerErrorException();
    }

    return data.species.name;
  }
}
