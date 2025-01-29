import { Search } from "lucide-react";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
const Home = () => (
  <div className="container text-center py-5">
    <h1 className="display-4 mb-4">Find Your Perfect Stay</h1>
    <p className="text-muted mb-4">
      Search hostels or PGs in your preferred location or near you.
    </p>
    <div className="input-group mb-4">
      <input
        type="text"
        placeholder="Search by location"
        className="form-control"
      />
      <button className="btn btn-primary">
        <Search className="me-2" />
        Search
      </button>
    </div>
    <div className="card shadow-lg mx-auto" style={{ maxWidth: "600px" }}>
      <div className="card-body">
        <h5 className="card-title">Hostel Details</h5>
        <p className="card-text">
          Example Hostel | Rating: 4.5 ⭐ | Reviews: "Great place to stay!"
        </p>
        <button className="btn btn-success">View Route</button>
      </div>
    </div>
  </div>
);

export default Home;
