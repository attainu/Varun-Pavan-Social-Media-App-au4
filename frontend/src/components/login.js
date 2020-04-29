import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link } from "react-router-dom";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import "./login.css";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom'
let mapStateToProps = (state) => {
    return {
        state: state.profile,
    };
};


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    root: {
        width: "100%",
        "& > * + *": {
            marginTop: theme.spacing(2),
        },
    },
}));

function SignIn(props) {
    const classes = useStyles();
    const [email, newEmail] = useState("");
    const [password, newPassword] = useState("");
    const [open, setOpen] = useState(false);

    let emailValidation =
        !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            email
        ) || email.length < 6;
    let passwordValidation = !/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(
        password
    );
    let disable = !emailValidation && !passwordValidation;

    const handleClick = () => {
        setOpen(true);
    };
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    const submitHandler = async () => {
        let user = await axios.post("/users/login", {
            email,
            password,
        });
        // console.log(user.data);
        // console.log(user.data.token);
        if (!user.data.status) {
            return handleClick();
        }
        localStorage.setItem("token", user.data.token);
        localStorage.setItem('userId', user.data.data._id)
        return window.location.href = "/home";

    };
    if (localStorage.getItem('token')) {
        return <Redirect to='/home' />
    }
    return (
        <>
            <Container component="main" maxWidth="xs" className="mt-5 pb-5 login">
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error">
                        Incorrect email or password!
          </Alert>
                </Snackbar>
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
          </Typography>
                    <form className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => newEmail(e.target.value)}
                            error={emailValidation && email.length !== 0}
                            helperText={
                                emailValidation && email.length !== 0 ? "*Invalid Email" : null
                            }
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
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
                            helperText={
                                passwordValidation && password.length !== 0
                                    ? "*Password must contain one uppercase, one lowercase and a special character and must be of minimum 6 characters"
                                    : null
                            }
                        />
                        {/* <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    /> */}
                        <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={submitHandler}
                            disabled={!disable}
                        >
                            <Link to='/home'> Sign In</Link>
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link to='/reset' variant="body2">
                                    Forgot/Reset password?
                </Link>
                            </Grid>
                            <Grid item>
                                <Link to="/signup" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        </>
    );
}

export default connect(mapStateToProps)(SignIn);
