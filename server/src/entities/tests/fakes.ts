import type { User } from '@server/entities/user'
import { Album } from '../album'
import { Band } from '../band'
import { Review } from '../review'
import { Artist } from '../artist'
import { random } from './random'

const randomId = () => random.integer({ min: 1, max: 2147483647 })

/**
 * Generates a fake user with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeUser = <T extends Partial<User>>(overrides: T = {} as T) => ({
  id: randomId(),
  username: 'User Name',
  email: random.email(),
  password: 'Password.123!',
  ...overrides,
})

export const fakeAlbum = <T extends Partial<Album>>(
  overrides: T = {} as T
) => ({
  id: randomId(),
  title: random.string(),
  ...overrides,
})

export const fakeBand = <T extends Partial<Band>>(overrides: T = {} as T) => ({
  id: randomId(),
  name: random.string(),
  description: 'Description text',
  ...overrides,
})

export const fakeReview = <T extends Partial<Review>>(
  overrides: T = {} as T
) => ({
  id: randomId(),
  title: random.string(),
  body: random.string(),
  score: random.integer({ min: 1, max: 100 }),
  ...overrides,
})

export const fakeArtist = <T extends Partial<Artist>>(
  overrides: T = {} as T
) => ({
  id: randomId(),
  name: random.string(),
  birth: random.date(),
  ...overrides,
})
