import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <div>
    <Header />
    <div className="bg-home">
      <div className="title">
        <h1 className="p-3">Find The Job That Fits Your Life</h1>
        <p className="p-3">
          Millions of people are searching for jobs,salary information company
        </p>
        <Link to="/jobs">
          <button className="btn m-3" type="button">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  </div>
)

export default Home
