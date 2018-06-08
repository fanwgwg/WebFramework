import {Component, createElement, connect} from '../framework';
import * as Actions from './action';
import * as blackcat from './assets/blackcat.png';
import * as userIcon from './assets/user.png';
import * as passwordIcon from './assets/password.png';
import * as API from './api';

class SignInPage extends Component {
    onSignIn() {
        console.log('signing in');
        history.pushState({}, null, '/events');

        API.getUserById('Henry', data => {
            this.props.onSignInSucceed(data);
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
                        <input type='text' placeholder='Email' />
                    </div>
                    <div class='input-container'>
                        <img src={passwordIcon} />
                        <input type='password' placeholder='Password' />
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
