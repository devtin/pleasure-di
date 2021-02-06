module.exports = ({ PayPalGateway, OrderRepository }) => {
  return {
    pay (amount) {
      return PayPalGateway.pay(amount)
    },
    findByUserId (userId) {
      return OrderRepository.findByUserId(userId)
    }
  }
}
