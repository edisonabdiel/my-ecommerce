import React from 'react';
import { AppBar, Toolbar, IconButton, Badge, MenuItem, Menu, Typography, Icon } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';

import useStyles from './styles'

import logo from '../../assets/pngkite-1432108.png'


const Navbar = ({ totalItems }) => {

    const classes = useStyles();

    return (
        <>
            <AppBar position="fixed" className={classes.appBar} color="inherit">
                <Toolbar>
                    <Typography varient="h6" className={classes.title} color="inherit">
                        <img src={logo} alt="DevilShop" height="25xp" className={classes.image} />
                        DevilShop
                    </Typography>
                    <div className={classes.grow} />
                        <div className={classes.button}>
                        <IconButton>
                            <Badge badgeContent={totalItems} color="secondary">
                                <ShoppingCart />
                            </Badge>
                        </IconButton>
                        </div>
                </Toolbar>
            </AppBar>
            
        </>
    )
}

export default Navbar;
