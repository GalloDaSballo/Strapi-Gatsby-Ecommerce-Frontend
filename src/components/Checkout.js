import React from 'react'

import {loadStripe} from '@stripe/stripe-js'
import {Elements} from '@stripe/react-stripe-js'

import CheckoutForm from './CheckoutForm'

const stripe = loadStripe('pk_test_5MFyZttmCMrqTn9ZZrJyDHei00vQ0qPH5n')

export default () => (
    <div>
        <Elements stripe={stripe}>
            <CheckoutForm />
        </Elements>
    </div>
)