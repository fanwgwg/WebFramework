import {Component, createElement, connect} from '../framework';
import * as Actions from './action';
import * as blackcat from './assets/blackcat.png';
import * as userIcon from './assets/user.png';
import * as passwordIcon from './assets/password.png';
import * as API from './api';

class SignInPage extends Component {
    onSignIn() {
        console.log('signing in');

        let email = this.emailInput.value.trim();
        let password = this.passwordInput.value;

        console.log(`email: ${email}`);
        console.log(`password: ${password}`);

        API.authenticate(email, password, data => {
            console.log(data);
            if (data.status == 200) {
                console.log('sign in succeed');
                sessionStorage.setItem('token', data.accessToken);
                sessionStorage.setItem('userid', data.user.id);
                this.props.onSignInSucceed({
                    token: data.accessToken,
                    user: data.user,
                });
            } else {
                console.log('sign in fails');
            }
        });
    }

    render() {
        return (
            <div class='page sign-in-page'>
                <div class='sign-in-top'>
                    <div class='logo-container'>
                        <img src={blackcat.default} alt='BlackCat' />
                    </div>
                </div>
                <div class='sign-in-middle'>
                    <div class='input-container'>
                        <img src={userIcon} />
                        <input type='text' placeholder='Email' ref={input => this.emailInput = input} />
                    </div>
                    <div class='input-container'>
                        <img src={passwordIcon} />
                        <input type='password' placeholder='Password' ref={input => this.passwordInput = input} />
                    </div>
                </div>
                <button class='sign-in-button' onclick={this.onSignIn.bind(this)}>SIGN IN</button>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSignInSucceed: data => dispatch({
            type: Actions.SIGN_IN_SUCCEED,
            data,
        }),
    };
};

export default connect(null, mapDispatchToProps)(SignInPage);
