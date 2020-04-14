import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link as Rlink } from 'react-router-dom'
import axios from 'axios';
import Radio from '@material-ui/core/Radio';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import './signup.css'

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

export default function SignUp() {
    const classes = useStyles();
    const [name, newName] = useState('');
    const [email, newEmail] = useState('');
    const [password, newPassword] = useState('');
    const [cpassword, cnewPassword] = useState('');
    const [selectedValue, setSelectedValue] = useState('male');
    const [open, setOpen] = useState(false);
    const [alertText, updatedAlertText] = useState("");
    const [severity, newSeverity] = useState("")

    const handleClick = () => {
        setOpen(true);
    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    }
    let nameValidation = name.length < 3;
    let emailValidation = !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) || email.length < 6;
    let passwordValidation = !/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(password);
    let cpasswordValidation = password === cpassword;
    let disable = !nameValidation && !emailValidation && !passwordValidation && cpasswordValidation;

    const submitHandler = async () => {
        let isExists = await axios.post('http://localhost:3010/users/signup/find', { email });
        updatedAlertText(isExists.data ? "Email already Exists" : "Profile created Successfully..! You will be redirected to the login page.")
        newSeverity(isExists.data ? "error" : "success")
        if (isExists.data) {
            return handleClick();
        }
        let gender = selectedValue
        await axios.post('http://localhost:3010/users/signup', { name, email, password, gender });
        handleClick()
        setTimeout(() => window.location.href = "/login", 7000)

    }
    return (
        <Container component="main" maxWidth="xs" className='mt-3 pb-3 signup' >
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity}>
                    {alertText}
                </Alert>
            </Snackbar>
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
        </Typography>
                <form className={classes.form} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="name"
                                name="name"
                                variant="outlined"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                value={name}
                                onChange={(e) => newName(e.target.value)}
                                error={nameValidation && name.length !== 0}
                                helperText={nameValidation && name.length !== 0 ? "*Name must be of three or more characters" : null}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => newEmail(e.target.value)}
                                error={emailValidation && email.length !== 0}
                                helperText={emailValidation && email.length !== 0 ? "*Invalid Email" : null}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => newPassword(e.target.value)}
                                error={passwordValidation && password.length !== 0}
                                helperText={passwordValidation && password.length !== 0 ? "*Password must contain one uppercase, one lowercase and a special character and must be of minimum 6 characters" : null}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Confirm password"
                                type="password"
                                id="cpassword"
                                autoComplete="current-password"
                                value={cpassword}
                                onChange={(e) => cnewPassword(e.target.value)}
                                error={!cpasswordValidation}
                                helperText={!cpasswordValidation ? "*Password doesn't match" : null}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <span>Male</span>   <Radio
                                checked={selectedValue === 'male'}
                                onChange={(e) => setSelectedValue(e.target.value)}
                                value="male"
                                name="radio-button-demo"
                                inputProps={{ 'aria-label': 'A' }}
                            />
                            <span>Female</span> <Radio
                                checked={selectedValue === 'female'}
                                onChange={(e) => setSelectedValue(e.target.value)}
                                value="female"
                                name="radio-button-demo"
                                inputProps={{ 'aria-label': 'B' }}
                            />   </Grid>
                    </Grid>
                    <Button
                        type="button"
                        // fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={submitHandler}
                        disabled={!disable}
                    >
                        Sign Up
          </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Rlink to='/login' variant="body2">
                                Already have an account? Sign in
              </Rlink>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}