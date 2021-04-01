import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {


    return this.repository
    .createQueryBuilder('games')
    .where('UPPER(games.title) like UPPER(:param)',{param:`%${param}%`})
    .getMany()
      // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(`
      SELECT COUNT(title)
      FROM games      
    `); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {

    interface IUserResponse{
      email:string;
      first_name:string;
      last_name:string
    }

    const users = await this.repository
    .createQueryBuilder('games')
    .leftJoin('games.users','users')
    .select('users')
    .where('games.id = :id',{id})
    .getRawMany()


    console.log(users)

    
    const userArray: IUserResponse[]=[]

    users.map(user =>{
      const userObject:IUserResponse={
        email:user.users_email,
        first_name:user.users_first_name,
        last_name:user.users_last_name
      }
      userArray.push(userObject)
      
    })

    console.log(userArray)
  

    return  userArray as User[]
      // Complete usando query builder
  }
}
