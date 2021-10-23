import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import './index.css'

class JobDetails extends Component {
  state = {
    jobData: '',
    isLoading: true,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    // const {blogData} = this.state
    console.log(this.props)
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
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
    console.log('JobDetails', data)
    this.setState({jobData: dataToObj, isLoading: false})
  }

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
      <>
        <div className="box m-3">
          <div className="d-flex flex-column">
            <div className="icon d-flex flex-row">
              <img src={logo} alt="job details company logo" />

              <div className=" d-flex flex-column mar">
                <h4>{title}</h4>
                <p>{rating}</p>
              </div>
            </div>
            <div className="d-flex flex-row justify-content-between">
              <div className="d-flex flex-row">
                <p className="m-3">{location} </p>
                <p className="m-3"> {type}</p>
              </div>
              <p>{salary}</p>
            </div>
          </div>
          <hr />
          <div className="d-flex flex-row justify-content-between">
            <h1>Description</h1>

            <a href={link} alt={jobDescription}>
              Visit
            </a>
          </div>
          <p>{jobDescription}</p>
          <h3>Skills</h3>
          <div className="d-flex flex-row justify-content-around">
            {skills.map(skill => (
              <div className="d-flex flex-row m-3 p-3">
                <img src={skill.image_url} alt="skill" />
                <p>{skill.name}</p>
              </div>
            ))}
          </div>
          <div className="d-flex flex-row justify-content-between">
            <div className="life">
              <h3>Life at Company</h3>
              <p>{life.description}</p>
            </div>
            <img src={life.image_url} alt="company" />
          </div>
        </div>
        <div className="box m-3">
          <h1>Similar Jobs</h1>
          <div className="d-flex flex-row">
            {similarJobs.map(job => (
              <>
                <div className="d-flex flex-column">
                  <div className="icon d-flex flex-row">
                    <img
                      src={job.company_logo_url}
                      alt="job details company logo"
                    />
                    <h4 className=" d-flex flex-column mar">{job.title}</h4>
                  </div>
                  <div className="m-3">
                    <p>{job.job_description}</p>
                  </div>
                  <div className="d-flex flex-row justify-content-between">
                    <div className="d-flex flex-row">
                      <p className="m-3">{job.location} </p>
                      <p className="m-3"> {job.employment_type}</p>
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </>
    )
  }

  render() {
    const {isLoading} = this.state
    return (
      <div className="blog-container">
        {isLoading ? (
          <div className="loader-container" testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        ) : (
          this.renderJobDetails()
        )}
      </div>
    )
  }
}

export default JobDetails
