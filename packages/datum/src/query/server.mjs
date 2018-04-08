import ramda from 'ramda'
import executeEndpoint from './endpoint.mjs'
import executeConnection from './connection.mjs'
import { CLIENT, EXECUTABLE } from '../database/constants.mjs'

const { compose, cond, curry, T, when } = ramda

const getKey = curry((key, obj) => obj[key])
const execute = cond([
  [getKey('connection'), executeConnection],
  [getKey('endpoint'), executeEndpoint],
  [T, () => { throw new Error('must specify endpoint or connection for client') }]
])

const makeEvented = i => i

/**
 * query
 *
 * Execute the given query with a client
 *
 * @curried
 * @params {Client} client
 * @params {ExecutableQuery} query
 * @returns {Promise}
 */
export default curry(
  async function (client, query) {
    if (!client[CLIENT]) {
      throw new TypeError('query: invalid client')
    }
    if (!query[EXECUTABLE]) {
      throw new TypeError('query: invalid executable')
    }

    try {
      return compose(
        when(getKey('evented'), makeEvented),
        execute
      )(client, query)
    } catch (e) {
      console.error(e)
    }
  }
)
