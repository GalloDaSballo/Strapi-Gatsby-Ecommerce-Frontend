
//Credits to: https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-string
/**
 * Formats a integer price into a price with decimals with a preceding $ sign
 * @parmas {string} - priceWithDecimals representation of price
 */
export const formatPrice = (priceWithDecimals) => {
    const realPrice = parseInt(priceWithDecimals) / 100
    return realPrice.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    })
}


