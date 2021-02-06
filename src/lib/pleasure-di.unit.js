import test from 'ava'
import path from 'path'
import { pleasureDi } from './pleasure-di.js'

test('register containers', (t) => {
  const container = pleasureDi({
    Gateway (name) {
      if (name === 'NotFoundGateway') {
        return
      }

      return () => {}
    }
  })

  t.throws(() => container.SomeService, {
    message: 'No suffixed container name registered matching SomeService'
  })

  t.throws(() => container.NotFoundGateway, {
    message: 'Resource NotFoundGateway not found'
  })
  t.notThrows(() => container.SomeGateway)
})

test('injects dependencies', (t) => {
  const container = pleasureDi({
    Gateway (gatewayName) {
      // holds the logic that resolves given gatewayName
      // returns a function that will come with the container
      return (/* container */) => {
        return {
          methodA (caller) {
            return `methodA from ${gatewayName} called by ${caller}`
          },
          methodB (caller) {
            return `methodB from ${gatewayName} called by ${caller}`
          }
        }
      }
    },
    Service (serviceName) {
      // holds the logic that resolves given serviceName
      // returns a function that will come with the container
      return ({ FreakingGateway }) => {
        return {
          methodC () {
            return FreakingGateway.methodA(serviceName)
          },
          methodD () {
            return FreakingGateway.methodB(serviceName)
          }
        }
      }
    }
  })

  const { PaymentService } = container

  t.is(PaymentService.methodC(), 'methodA from FreakingGateway called by PaymentService')
  t.is(PaymentService.methodD(), 'methodB from FreakingGateway called by PaymentService')
})

test('provides an interface to customize the container resolution', (t) => {
  const resolveFixture = (...fixturePath) => {
    return path.join(__dirname, '__tests__/fixtures', ...fixturePath)
  }
  const container = pleasureDi({
    Gateway (gatewayName) {
      return require(resolveFixture('gateways', gatewayName) + '.js')
    },
    Repository (respositoryName) {
      return require(resolveFixture('repositories', respositoryName) + '.js')
    },
    Service (serviceName) {
      return require(resolveFixture('services', serviceName) + '.js')
    }
  })

  const { OrderService } = container

  t.deepEqual(OrderService.findByUserId(123), {
    id: 123
  })
  t.is(OrderService.pay(1111), 'amount 1111 paid')
  t.throws(() => container.SomeService, {
    code: 'MODULE_NOT_FOUND'
  })
})
