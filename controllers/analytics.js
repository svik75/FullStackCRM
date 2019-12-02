const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')
const moment = require('moment')

module.exports.overview = async function (req, res) {
    try {
        const allOrders = await Order.find({ user: req.user.id }).sort({date:1})
        const ordersMap = getOrdersMap(allOrders)
        const yesterdayOrders = ordersMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || []
        // количество заказов вчера
        yesterdayOrdersNumber = yesterdayOrders.length
        // количество заказов
        const totalOrdersNumber = allOrders.length
        // колчество дней всего
        const daysNumber = Object.keys(ordersMap).length
        // заказов в день
        const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0)
        // процент для количества заказов - конверсия?
        const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2)
        // общая выручка
        const totalGain = calculatePrice(allOrders)
        // выручка в день
        const gainPerDay = totalGain / daysNumber
        // выручка за вчера
        const yesterdayGain = calculatePrice(yesterdayOrders)
        // процент выручки
        const gainPercent = (((yesterdayGain / gainPerDay) - 1) * 100).toFixed(2)
        // сравнение выручки
        const compareGain = (yesterdayGain - gainPerDay).toFixed(2)
        // сравнение количества заказов
        const compareNumber = (yesterdayOrdersNumber - ordersPerDay).toFixed(2)

        res.status(200).json({
            gain: {
                percent: Math.abs(+gainPercent),
                compare: Math.abs(+compareGain),
                yesterday: +yesterdayGain,
                isHigher: +gainPercent > 0
            },
            orders: {
                percent: Math.abs(+ordersPercent),
                compare: Math.abs(+compareNumber),
                yesterday: +yesterdayOrdersNumber,
                isHigher: +ordersPercent > 0
            }
        })
    } catch (error) {
        errorHandler(res, error)
    }
}
// ------------------------------------------
function getOrdersMap(orders = []) {
    const daysOrders = {}
    orders.forEach(order => {
        const date = moment(order.date).format('DD.MM.YYYY')

        if (date === moment().format('DD.MM.YYYY')) { return; }
        if (!daysOrders[date]) {
            daysOrders[date] = [];
        }
        daysOrders[date].push(order)
    })
    return daysOrders
}
// ----------------------------------------------------
function calculatePrice(orders = []) {
    return orders.reduce((total, order) => {
        const orderPrice = order.list.reduce((orderTotal, item) => {
            return orderTotal += item.cost * item.quantity
        }, 0)
        return total += orderPrice
    }, 0)
}
// ----------------------------------------------------

module.exports.analytics = async function (req, res) {
    try {
        const allOrders = await Order.find({user: req.user.id}).sort({date: 1})
        const ordersMap = getOrdersMap(allOrders)
    
        const average = calculatePrice(allOrders) / Object.keys(ordersMap).length
    
        const chart = Object.keys(ordersMap).map(label => {
          const gain = calculatePrice(ordersMap[label])
          const order = ordersMap[label].length
          return {
            label, gain, order
          }
        })
    
        res.status(200).json({
          chart,
          average: +average.toFixed(2)
        })
      } catch (e) {
        errorHandler(res, e)
      }
}