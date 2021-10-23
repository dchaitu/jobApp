import {Component} from 'react'
import Cookies from 'js-cookie'
import JobCard from '../JobCard'
import './index.css'
// import {async} from 'rxjs'

class Profile extends Component {
  state = {
    profile: {},
    isLoading: true,
  }

  componentDidMount() {
    this.getProfile()
  }

  getProfile = async () => {
    const api = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      method: 'GET',
    }
    console.log('jwtToken', jwtToken)
    const response = await fetch(api, options)
    console.log(response)
    if (response.ok === true) {
      const fetchedData = await response.json()
      console.log('fetchedData: ', fetchedData.profile_details)
      this.setState({
        profile: fetchedData.profile_details,
        isLoading: false,
      })
    }
  }

  render() {
    const {profile, isLoading} = this.state
    return (
      //   {isLoading ?
      //     (
      //         <div className="loader-container" testid="loader">
      //         <Loader
      //             type="ThreeDots"
      //             color="#ffffff"
      //             height="50"
      //             width="50"
      //         />
      //         </div>):
      // (
      <div className="bg-profile">
        <div className="d-flex flex-column flex-wrap">
          <img className="icon" src={profile.profile_image_url} alt="profile" />
          <h4 className="font-color">{profile.name}</h4>
          <p>{profile.short_bio}</p>
        </div>
      </div>

      // )
      //   }
    )
  }
}

export default Profile
