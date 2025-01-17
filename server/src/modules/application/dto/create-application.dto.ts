import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { MessageStatusDto } from 'src/common/dto';
import { ApplicationEntity } from '../entities/application.entity';

@InputType()
export class CreateApplicationInput {
  @Field()
  name: string;

  @Field(() => [String], { nullable: 'items' })
  requestUrls: string[];
}

@ObjectType()
class ApplicationData {
  @Field(() => ApplicationEntity, { nullable: true })
  application: ApplicationEntity;
}

@ObjectType()
export class ApplicationResponseDto extends MessageStatusDto {
  @Field({ nullable: true })
  data: ApplicationData;
}
