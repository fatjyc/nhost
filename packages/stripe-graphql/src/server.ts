import { createServer, YogaInitialContext } from '@graphql-yoga/node'

import { schema } from './schema'
import { Context, CreateServerProps } from './types'
import { getUserId } from './utils'

const createStripeGraphQLServer = (params?: CreateServerProps) => {
  const cors = params?.cors
  const isAllowed = params?.isAllowed

  const context = (context: YogaInitialContext): Context => {
    const { request } = context

    // user id
    const userId = getUserId(request)

    // check if using correct `x-hasura-admin-secret` header
    const adminSecretFromHeader = request.headers.get('x-hasura-admin-secret')
    const adminSecret = process.env.NHOST_ADMIN_SECRET

    // check if the request is from Hasura
    const nhostWebhookSecretFromHeader = request.headers.get('x-nhost-webhook-secret')
    const nhostWebhookSecret = process.env.NHOST_WEBHOOK_SECRET
    const role = request.headers.get('x-hasura-role')

    // variables
    const isAdmin =
      adminSecretFromHeader === adminSecret ||
      (role === 'admin' && nhostWebhookSecretFromHeader === nhostWebhookSecret)

    // if no isAllowed function is provided, we will allow admin requests
    const isAllowedFunction =
      isAllowed ||
      ((_stripeCustomerId: string, context: Context) => {
        return context.isAdmin
      })

    // return
    return {
      ...context,
      isAllowed: isAllowedFunction,
      userId,
      isAdmin
    }
  }

  return createServer({
    cors,
    context,
    schema
  })
}

export { createStripeGraphQLServer, schema }
