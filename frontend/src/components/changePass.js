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
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import "./signup.css";
import { Redirect } from 'react-router-dom'
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
        marginTop: theme.spacing(3),
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

export default function ChangePassword(props) {
    const classes = useStyles();
    const [password, newPassword] = useState("");
    const [cpassword, cnewPassword] = useState("");
    const [open, setOpen] = useState(false);
    const [alertText, updatedAlertText] = useState("");
    const [severity, newSeverity] = useState("");
    const handleClick = () => {
        setOpen(true);
    };
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };
    let passwordValidation = !/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(
        password
    );
    let cpasswordValidation = password === cpassword;
    let disable =
        !passwordValidation &&
        cpasswordValidation;

    const submitHandler = async () => {
        try {
            await axios.post("/users/changepassword", {
                token: props.match.params.id,
                password
            });
            updatedAlertText("Password reset successfull");
            newSeverity("success");
            handleClick();
            return setTimeout(() => (window.location.href = "/login"), 2000);
        } catch (error) {
            updatedAlertText("token expired");
            newSeverity("error");
            handleClick();
            return setTimeout(() => (window.location.href = "/login"), 2000);

        }
    };
    if (localStorage.getItem('token')) {
        return <Redirect to='/home' />
    }
    return (
        <Container component="main" maxWidth="xs" className="mt-3 pb-3 signup">
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
                    Reset Password
        </Typography>
                <form className={classes.form} noValidate>
                    <Grid container spacing={2}>
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
                                helperText={
                                    passwordValidation && password.length !== 0
                                        ? "*Password must contain one uppercase, one lowercase and a special character and must be of minimum 6 characters"
                                        : null
                                }
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
                                helperText={
                                    !cpasswordValidation ? "*Password doesn't match" : null
                                }
                            />
                        </Grid>
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
                        Reset
          </Button>
                </form>
            </div>
        </Container>
    );
}
