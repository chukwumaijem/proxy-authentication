import { Container } from 'typedi';

import { User } from './User';

Container.set({ id: 'UserEntity', factory: () => User });

export { User, Container };
