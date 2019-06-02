import React, { Component } from 'react';
import './Login.css';
import Header from '../../common/header/Header';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';

class Login extends Component {
   

    constructor(){
        super();
        this.state = {
            username: '',
            usernameRequired: 'dispNone',
            password: '',
            passwordRequired: 'dispNone',
            incorrectCredentials: 'dispNone',
            loggedIn: sessionStorage.getItem('access-token') == null ? false : true,
            credentials : {
                username : 'admin',
                password : 'admin'
            },
            accessToken : '8661035776.d0fcd39.39f63ab2f88d4f9c92b0862729ee2784',
        };
    }

    //Login in click handlers to authenticate and display error accordingly.
    loginClickHandler = () => {
        this.state.username === '' ? this.setState({ usernameRequired: 'dispBlock' }) : this.setState({ usernameRequired: 'dispNone' });
        this.state.password === "" ? this.setState({ passwordRequired: 'dispBlock' }) : this.setState({ passwordRequired: 'dispNone' });

        if (this.state.username === "" || this.state.password === "") { 
            this.setState({
                incorrectCredentials : 'dispNone'
             });
            return;
         }

        if(this.state.username === this.state.credentials.username && this.state.password === this.state.credentials.password){
            this.setState({
                incorrectCredentials : 'dispNone'
             });
            sessionStorage.setItem('access-token', this.state.accessToken);
            this.setState({ loggedIn: true });
            this.redirectToHome();
        }else {
             this.setState({
                incorrectCredentials : 'dispBlock'
             });
        }
    }

    //Redirect on to home page on successful authentication.
    redirectToHome = () => {
        this.props.history.push("/home");
    }
    
    // Set USERNAME on input.
    inputUserNameChangeHandler = (e) => {
        this.setState({ username: e.target.value });
    }
    
    // Set PASSWORD on input.
    inputPasswordChangeHandler = (e) => {
        this.setState({ password: e.target.value });
    }

    render(){
        return(
            <div>
                <Header />
                <Card className="cardStyle">
                    <CardContent>
                        <Typography variant="h5" component="h5">
                            LOGIN
                        </Typography><br />
                        <FormControl required className="formControl">
                            <InputLabel htmlFor="username">Username </InputLabel>
                            <Input id="username" type="text"
                                onChange={this.inputUserNameChangeHandler} />
                            <FormHelperText className={this.state.usernameRequired}>
                                <span className="red">Required</span>
                            </FormHelperText>
                        </FormControl><br /><br />
                        <FormControl required className="formControl">
                            <InputLabel htmlFor="password">Password </InputLabel>
                            <Input id="password" type="password" onChange={this.inputPasswordChangeHandler} />
                            <FormHelperText className={this.state.passwordRequired}>
                                <span className="red">Required</span>
                            </FormHelperText>
                        </FormControl><br /><br />
                        <FormHelperText className={this.state.incorrectCredentials} >
                                <span className="red">Incorrect username and/or password</span>
                                <br /><br />
                        </FormHelperText>
                        <Button variant="contained" color="primary" style={{width: 10}} onClick={this.loginClickHandler}>LOGIN</Button>
                    </CardContent>
                </Card>               
            </div>
        )
    }

}

export default Login;