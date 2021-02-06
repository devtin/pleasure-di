<div><h1>pleasure-di</h1></div>

<p>
    <a href="https://www.npmjs.com/package/pleasure-di" target="_blank"><img src="https://img.shields.io/npm/v/pleasure-di.svg" alt="Version"></a>
<a href="http://opensource.org/licenses" target="_blank"><img src="http://img.shields.io/badge/License-MIT-brightgreen.svg"></a>
</p>

<p>
    a simple dependency injection module
</p>

## Installation

```sh
$ npm i pleasure-di --save
# or
$ yarn add pleasure-di
```

## Features

- [register containers](#register-containers)
- [injects dependencies](#injects-dependencies)
- [provides an interface to customize the container resolution](#provides-an-interface-to-customize-the-container-resolution)


<a name="register-containers"></a>

## register containers


```js
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
```

<a name="injects-dependencies"></a>

## injects dependencies


```js
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
```

<a name="provides-an-interface-to-customize-the-container-resolution"></a>

## provides an interface to customize the container resolution


```js
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
```


<br><a name="pleasureDi"></a>

### pleasureDi(resolvers) ⇒ <code>Object</code> \| <code>\*</code>

| Param | Type | Description |
| --- | --- | --- |
| resolvers | <code>Object</code> | resolvers map |


<br><a name="Resolved"></a>

### Resolved ⇒ <code>Object</code>

| Param | Type |
| --- | --- |
| container | <code>Object</code> | 


<br><a name="Resolver"></a>

### Resolver ⇒ [<code>Resolved</code>](#Resolved)

| Param | Type |
| --- | --- |
| containerName | <code>String</code> | 


* * *

### License

[MIT](https://opensource.org/licenses/MIT)

&copy; 2020-present Martin Rafael Gonzalez <tin@devtin.io>
