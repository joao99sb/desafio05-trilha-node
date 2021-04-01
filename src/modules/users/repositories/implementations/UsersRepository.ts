import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOne({
      relations:['games'],
      where:{id:user_id}
    })
    if(!user){
      throw new Error('message')
    }
    
    return user
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {    
    return this.repository.query(`
    SELECT * 
    FROM users
    ORDER BY first_name
    `);// Complete usando raw query
    
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query(`
    SELECT * 
    FROM users
    WHERE UPPER(first_name) LIKE UPPER('%${first_name}%') and UPPER(last_name) LIKE UPPER('%${last_name.toLowerCase()}%')
  `); // Complete usando raw query
  }
}
