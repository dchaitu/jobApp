import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {BsSearch} from 'react-icons/bs'
import JobCard from '../JobCard'
import Profile from '../Profile'
import Header from '../Header'
import FiltersGroup from '../FiltersGroup'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    jobsList: [],
    isLoading: true,
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    salary: '',
    employment: '',
    value: '',
    emp: [],
  }

  componentDidMount() {
    const {emp} = this.state
    this.getJobs()
    console.log(emp)
  }

  clearFilters = () => {
    this.setState(
      {
        searchInput: '',
        salary: '',
        employment: '',
      },
      this.getProducts,
    )
  }

  renderRadioLists = () =>
    salaryRangesList.map(emp => (
      <>
        <input
          type="radio"
          name="salary"
          value={emp.salaryRangeId}
          onChange={this.handleChange}
        />
        <span htmlFor={emp.employmentTypeId}>{emp.label} </span>
        <br />
      </>
    ))

  renderCheckboxLists = () =>
    employmentTypesList.map(emp => (
      <>
        <input
          type="checkbox"
          name={emp.employmentTypeId}
          value={emp.employmentTypeId}
          onChange={this.onSelectBox}
        />
        <span htmlFor={emp.employmentTypeId}>{emp.label} </span>
        <br />
      </>
    ))

  getJobs = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {searchInput, salary, employment} = this.state

    const jwtToken = Cookies.get('jwt_token')
    const api = `https://apis.ccbp.in/jobs?employment_type=${employment}&minimum_package=${salary}&search=${searchInput}`
    // st apiUrl = 'https://apis.ccbp.in/jobs?employment_type=FULLTIME,PARTTIME&minimum_package=${salary}&search='
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
      console.log('fetchedData: ', fetchedData.jobs)
      const updatedData = fetchedData.jobs.map(job => ({
        title: job.title,
        company: job.company_logo_url,
        type: job.employment_type,
        id: job.id,
        description: job.job_description,
        salary: job.package_per_annum,
        location: job.location,
        rating: job.rating,
      }))
      this.setState({
        jobsList: updatedData,

        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  changeSearchInput = searchInput => {
    this.setState({searchInput})
  }

  enterSearchInput = () => {
    this.getJobs()
  }

  onEnterSearchInput = event => {
    const {enterSearchInput} = this.props
    if (event.key === 'Enter') {
      enterSearchInput()
    }
  }

  onSelectBox = event => {
    console.log(event.target.value)
    const {emp, employment} = this.state
    const input = event.target.value
    this.setState(
      {
        emp: emp.includes(input)
          ? emp.filter(item => item !== input)
          : [...emp, input],
      },
      () => {
        console.log(emp)
      },
    )
    const employ = emp.join(',')
    // console.log(employ)
    this.setState({employment: employ}, this.getJobs)
  }

  //   onChangeSearchInput = event => {
  //     const {changeSearchInput} = this.props
  //     changeSearchInput(event.target.value)
  //   }

  //   renderSearchInput = () => {
  //     const {searchInput} = this.props
  //     return (
  //       <div className="search-input-container">
  //         <input
  //           value={searchInput}
  //           type="search"
  //           className="search-input"
  //           placeholder="Search"
  //           onChange={this.onChangeSearchInput}
  //           onKeyDown={this.onEnterSearchInput}
  //         />
  //         <BsSearch className="search-icon" />
  //       </div>
  //     )
  //   }
  renderProductsListView = () => {
    const {jobsList, activeOptionId} = this.state
    const shouldShowProductsList = jobsList.length > 0

    return shouldShowProductsList ? (
      <div className="all-products-container">
        {jobsList.map(job => (
          <Link to={`/jobs/${job.id}`}>
            <JobCard jobData={job} key={job.id} />
          </Link>
        ))}
      </div>
    ) : (
      <div className="no-products-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          className="no-products-img"
          alt="no products"
        />
        <h1 className="no-products-heading">No Products Found</h1>
        <p className="no-products-description">
          We could not find any products. Try other filters.
        </p>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="all-products-error"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We cannot seem to find the page you are looking for. Please try again.
      </p>
      <button type="button" className="retry-button" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderAllProducts = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  handleChange = event => {
    console.log(event.target.value)
    this.setState(
      {
        salary: event.target.value,
      },
      this.getJobs,
    )
  }

  render() {
    const {jobsList, isLoading, searchInput, salary, employment} = this.state
    console.log(employment)
    return (
      <>
        <Header />
        <div className="d-flex flex-row background">
          <div className="d-flex flex-column dashboard m-3">
            <Profile />
            <hr className="white" />
            <div className="white">
              <h4>Types of Employment</h4>
              {this.renderCheckboxLists()}
            </div>
            <hr className="white" />
            <div className="white">
              <h4>Salary Range</h4>
              {this.renderRadioLists()}
            </div>
          </div>
          <div className="list">
            <FiltersGroup
              searchInput={searchInput}
              changeSearchInput={this.changeSearchInput}
              enterSearchInput={this.enterSearchInput}
            />
            {this.renderAllProducts()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
