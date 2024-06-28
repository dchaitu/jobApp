import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect, withRouter} from 'react-router-dom'

import './index.css'

class LoginRoute extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMessage: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  onSubmitFailure = errorMessage => {
    console.log(errorMessage)
    this.setState({
      showSubmitError: true,
      errorMessage: "Username and Password didn't match",
    })
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderUsernameField = () => {
    const {username} = this.state

    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <br />
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={username}
          onChange={this.onChangeUsername}
          placeholder="Username"
        />
      </>
    )
  }

  renderPasswordField = () => {
    const {password} = this.state

    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <br />
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={this.onChangePassword}
          placeholder="Password"
        />
      </>
    )
  }

  render() {
    const {showSubmitError, errorMessage} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <>
        <div className="backgroundImg">
          <div className="box align-items-center p-5">
            <div className="d-flex justify-content-center signIn">
              <div>
                <form
                  className="d-flex flex-column form-container"
                  onSubmit={this.submitForm}
                >
                  <img
                    className="logo"
                    src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                    alt="website logo"
                  />
                  <div className="m-3">
                    <div className="input-container">
                      {this.renderUsernameField()}
                    </div>
                    <div className="input-container">
                      {this.renderPasswordField()}
                    </div>

                    <div className="d-flex flex-column justify-content-center">
                      <button type="submit" className="login-button">
                        Login
                      </button>
                      {showSubmitError && (
                        <p className="error-message">*{errorMessage}</p>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default LoginRoute
