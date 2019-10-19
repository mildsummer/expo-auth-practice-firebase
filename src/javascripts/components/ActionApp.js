import React, { Component } from 'react';
import queryString from 'query-string';
import { auth, functions } from '../utils/firebase';

const query = queryString.parse(window.location.search);
if (query.mode !== 'verifyEmail') {
  window.location.href = `https://${process.env.FIREBASE_AUTH_DOMAIN}/__/auth/action${window.location.search}`;
}

export default class ActionApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completed: false
    };
  }

  componentDidMount() {
    const { oobCode, continueUrl } = query;
    let email = null;
    auth.checkActionCode(oobCode)
      .then((actionCodeInfo) => {
        email = actionCodeInfo.data.email;
        return auth.applyActionCode(oobCode)
      })
      .then(() => (functions.httpsCallable('verifyEmail')({ email })))
      .then(() => {
        if (continueUrl) {
          window.location.href = continueUrl;
        }
        this.setState({
          completed: true
        });
        })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { completed } = this.state;
    const { continueUrl } = query;
    return (
      <div className='app-container'>
        ActionApp
        <button
          type='button'
          onClick={continueUrl ? () => {
            window.open(continueUrl, '_blank');
          } : null}
          style={{
            display: completed ? 'block' : 'none'
          }}
        >
          Continue to app
        </button>
      </div>
    );
  }
}
