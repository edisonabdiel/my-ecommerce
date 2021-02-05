import React, { useState, useEffect } from 'react';
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';

import { commerce } from '../../../lib/commerce';
import AdressForm from '../AdressForm';
import PaymentForm from '../PaymentForm';

import useStyles from './styles'


const steps = ['Shipping adress', 'Payment details'];

const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});
    const [isFinished, setIsFinished] = useState(false);
    const classes = useStyles();
    const history = useHistory();

    useEffect(() => {
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });
                console.log(token, order)
                setCheckoutToken(token);
            } catch (error) {
                if (activeStep !== steps.length) history.push('/');
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

    const timeout = () => {
        setTimeout(() => {
            setIsFinished(true)
        }, 3000)
    }


    let Confirmation = () => order.costumer ? (
        <>
            <div>
                <Typography variant="h5" >Thank you for your order, {order.costumer.firstname}{order.costumer.lastname}</Typography>
                <Divider className={classes.divider} />
                <Typography variant="subtitle">Order ref:{order.costumer_reference}</Typography>
            </div>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button">Home</Button>
        </>
    ) : isFinished ? (
        <>
        <div>
            <Typography variant="h5" >Thank you for your order, {order.costumer.firstname}{order.costumer.lastname}</Typography>
            <Divider className={classes.divider} />
            <Typography variant="subtitle">Order ref:{order.costumer_reference}</Typography>
        </div>
        <br />
        <Button component={Link} to="/" variant="outlined" type="button">Home</Button>
    </>
    ) : (
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    );
    if (error) {
        <>
            <Typography variant="h5">Error: {error}</Typography>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button">Home</Button>
        </>
    }


    const Form = () => activeStep === 0
        ? <AdressForm checkoutToken={checkoutToken} next={next} />
        : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} onCaptureCheckout={onCaptureCheckout} order={order} timeout={timeout}/>

    return (
        <>
            <CssBaseline />
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
