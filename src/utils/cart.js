export const TAX_RATE = process.env.TAX_RATE || 0.1
export const FREE_SHIPPING_THRESHOLD = process.env.FREE_SHIPPING_THRESHOLD || 10000
export const SHIPPING_RATE = process.env.SHIPPING_RATE || 500

export const saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart))
}
export const getCart = () => {
    try{
        const cart = JSON.parse(localStorage.getItem('cart'))
        if(cart){
            return cart
        }
        
    } catch(err){

    }   

    return []
}


export const cartSubtotal = (cart) => {
    //Sum up all of the individual product costs
    const subTotal = cart.reduce((counter, product) => {
        return counter + product.price_in_cent * product.qty
    }, 0)

    return subTotal
}

export const shouldPayShipping = (cart) => {
    const subTotal = cartSubtotal(cart)
    
    return subTotal < FREE_SHIPPING_THRESHOLD
}

export const cartTotal = (cart) => {
    const subTotal = cartSubtotal(cart)

    const shipping = shouldPayShipping(cart) ? SHIPPING_RATE : 0

    const total = subTotal + subTotal * TAX_RATE + shipping

    return Math.round(total)
}