import React, { useState, useEffect } from 'react';
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

import { commerce } from '../../../lib/commerce';
import AdressForm from '../AdressForm';
import PaymentForm from '../PaymentForm';

import useStyles from './styles'


const steps = ['Shipping adress', 'Payment details'];

const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});
    const classes = useStyles();

    useEffect(() => {
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });
                console.log(token)
                setCheckoutToken(token);
            } catch (error) {

            }
        }

        generateToken();
    }, [cart]);

    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1)
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1)

    const next = (data) => {
        setShippingData(data);

        nextStep();
    }


    let Confirmation = () => order.costumer ? (
        <>
            <div>
                <Typography variant="h5" >Thank you for your order, {order.costumer.firstname}{order.costumer.lastname}</Typography>
                <Divider className={classes.divider} />
                <Typography variant="subtitle">Order ref: ref</Typography>
            </div>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button">Home</Button>
        </>
    ) : (
            <div className={classes.spinner}>
                <CircularProgress />
            </div>
        )
    
    if (error) {
        <>
            <Typography variant="h5">Error: {error}</Typography>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button">Home</Button>
        </>
    }


    const Form = () => activeStep === 0
        ? <AdressForm checkoutToken={checkoutToken} next={next} />
        : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} onCaptureCheckout={onCaptureCheckout} />

    return (
        <>
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" align="center">Checkout</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((step) => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
                </Paper>
            </main>
        </>
    )
}

export default Checkout
