import {Component} from 'react'

import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {GoLocation} from 'react-icons/go'
import {BsBriefcaseFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {BiLinkExternal} from 'react-icons/bi'
import './index.css'
import Header from '../Header'
import NotFound from '../NotFound'

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class JobItemDetails extends Component {
  state = {
    jobData: '',
    isLoading: true,
    jobApiStatus: apiStatus.initial,
  }

  componentDidMount() {
    this.getJobDetails()
    // this.returnJobDetailsPage()
  }

  getErrorPage = () => {
    console.log('Got Error')
  }

  getJobDetails = async () => {
    // const {blogData} = this.state
    console.log(this.props)
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log('id ', id)
    const jwtToken = Cookies.get('jwt_token')
    const jobDetailsApiUrl = `https://apis.ccbp.in/jobs/${id}/`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      method: 'GET',
    }
    const resp = await fetch(jobDetailsApiUrl, options)
    const data = await resp.json()
    console.log(resp.ok)
    if (resp.ok === true) {
      const dataToObj = {
        id: data.job_details.id,
        title: data.job_details.title,
        logo: data.job_details.company_logo_url,
        link: data.job_details.company_website_url,
        location: data.job_details.location,
        salary: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        similarJobs: data.similar_jobs,
        life: data.job_details.life_at_company,
        type: data.job_details.employment_type,
        skills: data.job_details.skills,
        jobDescription: data.job_details.job_description,
      }
      // allJobIds.push(data.job_details.id)
      console.log('JobDetails', data)
      this.setState({
        jobData: dataToObj,
        isLoading: false,
        jobApiStatus: apiStatus.success,
      })
    }

    this.setState({jobApiStatus: apiStatus.failure})
  }

  returnLoadingDetails = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetails = () => {
    const {jobData} = this.state
    const {
      title,
      logo,
      link,
      type,
      salary,
      rating,
      similarJobs,
      life,
      imageUrl,
      topic,
      avatarUrl,
      location,
      skills,
      jobDescription,
    } = jobData
    return (
      <div className="bg-color">
        <div className="details-box">
          <div className="d-flex flex-column">
            <div className="d-flex flex-row">
              <img className="icon" src={logo} alt="job details company logo" />

              <div className=" d-flex flex-column mar">
                <h4>{title}</h4>

                <p>
                  <AiFillStar color="yellow" />
                  {rating}
                </p>
              </div>
            </div>
            <div className="d-flex flex-row justify-content-between">
              <div className="d-flex flex-row">
                <p className="m-3">
                  <GoLocation style={{color: '#FFFFFF'}} />
                  {location}{' '}
                </p>
                <p className="m-3">
                  <BsBriefcaseFill /> {type}
                </p>
              </div>
              <p>{salary}</p>
            </div>
          </div>
          <hr />
          <div className="d-flex flex-row justify-content-between">
            <h1>Description</h1>

            <a href={link}>
              Visit <BiLinkExternal />
            </a>
          </div>
          <p>{jobDescription}</p>
          <h3>Skills</h3>
          {/* <div className="d-flex flex-row justify-content-around"> */}
          <div className="container">
            <div className="row">
              {skills.map(skill => (
                <div className="col-3 m-3 p-3">
                  <div className="d-flex flex-row">
                    <img src={skill.image_url} alt="skill" />
                    <p>{skill.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="d-flex flex-row justify-content-between">
            <div className="life">
              <h3>Life at Company</h3>
              <p>{life.description}</p>
            </div>
            <img src={life.image_url} alt="company" />
          </div>
        </div>
        <div className="similar-box m-3">
          <h1>Similar Jobs</h1>
          <div className="d-flex flex-row">
            {similarJobs.map(job => (
              <div className="boxs">
                <div className="d-flex flex-column">
                  <div className="icon d-flex flex-row">
                    <img
                      className="icon"
                      src={job.company_logo_url}
                      alt="similar job company logo"
                    />
                    <h4 className=" d-flex flex-column mar">{job.title}</h4>
                  </div>
                  <div className="m-3">
                    <p>{job.job_description}</p>
                  </div>
                  <div className="d-flex flex-row justify-content-between">
                    <div className="d-flex flex-row">
                      <p className="m-3">
                        <GoLocation style={{color: '#FFFFFF'}} />
                        {job.location}{' '}
                      </p>
                      <p className="m-3">
                        <BsBriefcaseFill /> {job.employment_type}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  returnApiFailure = () => (
    <div className="not-found">
      <div className="center">
        <h1 className="heading"> Oops! Something Went Wrong</h1>
        <img
          className="imgs"
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <p>We cannot seem to find the page you are looking for.</p>
        <button
          type="button"
          className="retry-button"
          onClick={() => this.getJobDetails()}
        >
          Retry
        </button>
      </div>
    </div>
  )

  returnJobDetailsPage = () => {
    const {jobApiStatus} = this.state
    if (jobApiStatus === apiStatus.failure) {
      console.log('failed')
      return this.returnApiFailure()
    }
    if (jobApiStatus === apiStatus.success) {
      return this.renderJobDetails()
    }
    if (jobApiStatus === apiStatus.inProgress) {
      return this.returnLoadingDetails
    }
    return null
  }

  render() {
    // const {isLoading, gotError} = this.state
    // let code = ''
    // console.log('gotError ', gotError)
    // if (isLoading) {
    //   code = (
    //
    //   )
    //   if (gotError) {
    //     code = <NotFound />
    //   } else {
    //     code = this.renderJobDetails()
    //   }
    // }
    return (
      <div className="blog-container">
        <Header />
        {this.returnJobDetailsPage}
      </div>
    )
  }
}

export default JobItemDetails
