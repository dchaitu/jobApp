import {Link} from 'react-router-dom'
import {GoLocation} from 'react-icons/go'
import {BsBriefcaseFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'

import './index.css'

const JobCard = props => {
  const {jobData} = props
  const {
    title,
    company,
    type,
    id,
    description,
    salary,
    location,
    rating,
  } = jobData
  return (
    <div className="signin-box">
      <div className="d-flex flex-row">
        <img src={company} className="icon" alt="company" />
        <div className=" d-flex flex-column ">
          <div className="title-size pt-3">
            <h4>{title}</h4>
            <p>
              <AiFillStar color="yellow" /> {rating}
            </p>
          </div>
        </div>
      </div>

      <div className="d-flex flex-row justify-content-between">
        <div className="d-flex flex-row">
          <div className="d-flex flex-row ">
            <GoLocation style={{color: '#FFFFFF'}} />{' '}
            <p className="title size">{location} </p>
          </div>
          <BsBriefcaseFill /> <p className="title"> {type}</p>
        </div>
        <p>{salary}</p>
      </div>
      <hr />
      <h1>Description</h1>
      <p>{description}</p>
    </div>
  )
}

export default JobCard
