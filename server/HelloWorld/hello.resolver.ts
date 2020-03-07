import { Resolver, Arg, Query } from 'type-graphql';

@Resolver()
export class HelloResolver {
  @Query()
  hello(@Arg('name') name: string): string {
    return `Hello, ${name}`;
  }
}
