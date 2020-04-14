import React, {useEffect, useState, useContext} from 'react'
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js'

import {CartContext} from '../context/CartContext'

import {formatPrice} from '../utils/format'

const Card_Styles = {
    style: {
        base: {
            padding: '24px 12px',
            fontSize: '16px'
        }
    }
}

export default () => {
    const stripe = useStripe()
    const elements = useElements()

    const {cart} = useContext(CartContext)

    const [token, setToken] = useState(null)
    const [total, setTotal] = useState('loading')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        console.log("HandleSubmit", event)
        const result = await stripe.confirmCardPayment(token, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        })

        console.log("handleSubmit result", result)
        setLoading(false)
    }

    useEffect(() => {
        const loadToken = async () => {
            setLoading(true)
            const response = await fetch('http://localhost:1337/orders/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cart: cart.map(product => (
                        {...product, ...{id: product.strapiId}}
                    ))
                })
            })

            const data = await response.json()

            console.log("loadToken data", data)
            setToken(data.client_secret)
            setTotal(data.amount)
            setLoading(false)
        }

        loadToken()
    }, [cart])

    return(
        <div
            style={{margin: '24px 0'}}
        >
            {!loading && <h3>Total: {formatPrice(total)}</h3>}
            {loading && <h3>Loading</h3>}
            <form 
                onSubmit={handleSubmit}
            >
                <CardElement options={Card_Styles}/>
                <button 
                    style={{marginTop: '12px'}}
                    disabled={!stripe}
                >
                    Buy it
                </button>
            </form>
        </div>
    )
}