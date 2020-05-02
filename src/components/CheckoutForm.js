import React, {useEffect, useState, useContext} from 'react'
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js'

import {CartContext} from '../context/CartContext'

import {formatPrice} from '../utils/format'

import {API_URL} from '../utils/url'

const Card_Styles = {
    style: {
        base: {
            padding: '24px 12px',
            fontSize: '16px'
        }
    }
}

const generateInput = (label, value, setOnChange, inline = false) => {
    return(
        <div 
            style={{display: inline ? 'inline' : 'block'}}
        >
            <div
                style={{display: inline ? 'inline' : 'block'}}
            >
                <label htmlFor={label}>{label}</label>
            </div>
            
            <input id={label}
                value={value}
                onChange={(event) => setOnChange(event.target.value)} 
            />
        </div>
    )
}



export default () => {
    const stripe = useStripe()
    const elements = useElements()

    const {cart, clearCart} = useContext(CartContext)

    const [shipping_name, setShipping_name] = useState('')
    const [shipping_address, setShipping_address] = useState('')
    const [shipping_state, setShipping_state] = useState('')
    const [shipping_country, setShipping_country] = useState('')
    const [shipping_zip, setShipping_zip] = useState('')

    const [token, setToken] = useState(null)
    const [total, setTotal] = useState('loading')

    console.log("CheckoutForm.render total", total)

    const [loading, setLoading] = useState(false)

    const [success, setSuccess] = useState(null) 

    const valid = () => {
        if(!shipping_name || !shipping_address || !shipping_state || !shipping_country || !shipping_zip){
            return false
        }
        
        return true
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        console.log("HandleSubmit", event)
        const result = await stripe.confirmCardPayment(token, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        })

        const data = {
            paymentIntent: result.paymentIntent,
            shipping_name,
            shipping_address,
            shipping_state,
            shipping_country,
            shipping_zip,
            cart
        }
        
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const order = await response.json()

        setSuccess(true)

        setLoading(false)

        clearCart()
    }

    useEffect(() => {
        const loadToken = async () => {
            setLoading(true)
            const response = await fetch(`${API_URL}/orders/payment`, {
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

            {!success &&
                 <form 
                    style={{
                        padding: '24px 12px',
                        border: '1px solid #eee',
                        margin: '20px 0'
                    }}
                    onSubmit={handleSubmit}
                >
    
                    {generateInput('Shipping Recipient', shipping_name, setShipping_name)}
                    {generateInput('Shipping Address', shipping_address, setShipping_address)}
                    {generateInput('State', shipping_state, setShipping_state)}
                    {generateInput('Country', shipping_country, setShipping_country)}
                    {generateInput('Zip', shipping_zip, setShipping_zip)}
    
                    <CardElement options={Card_Styles}/>
                    <button 
                        style={{marginTop: '12px'}}
                        disabled={!stripe || !valid()}
                    >
                        Buy it
                    </button>
                </form>
            }
            {success &&
                <h2>Your order was successfully processed!</h2>
            }
           
        </div>
    )
}