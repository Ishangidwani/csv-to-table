import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class UserDao {
  private readonly logger = new Logger(UserDao.name);
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async start() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return queryRunner;
  }

  async insert(
    name: string,
    address: object,
    additional_info: object,
    age: number,
  ) {
    //firstname and last name would be merged into single string with space
    // auto generate id
    //address would be splitted into 2 parts if the address size is greater than x characters
    const newUser = this.userRepository.create({
      name: name,
      address: address,
      additional_info: additional_info,
      age: age,
    });
    // save the record in database
    return await this.userRepository.save(newUser);
  }

  async ageWiseDistribution() {
    const query = `WITH c AS (
      SELECT
       CASE
        WHEN (age < 20) then '< 20'
        WHEN (age >= 20 and age < 40) then  '20 to 40'
        WHEN (age >= 40 and age < 60) then '40 to 60'
        WHEN (age >= 60) then '> 60'
       END AS "Age-Group",
        count(*) AS cnt
      FROM users
      GROUP BY "Age-Group"
      )
      SELECT
        "Age-Group",
        round(100.0 * cnt / (SELECT sum(cnt) FROM c), 2) AS "% Distribution"
      FROM c`;
    const data = await this.dataSource.query(query);
    return data;
  }
}
