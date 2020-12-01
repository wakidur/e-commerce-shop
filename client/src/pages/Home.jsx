import React from 'react';
import sample from '../assests/images/sample.jpeg';

const Home = () => {
  return (
    <div className="home-contain vh-100">
      <div className="container product pt-4">
        <div className="row row-cols-1 row-cols-sm-3 row-cols-md-4">
          <div className="col ">
            <div className="card border-0 ">
              <div className="card-body px-3 py-3">
                <img src={sample} className="card-img mb-3" alt="ad" />
                <h5 className="card-title mb-4">Card title</h5>
                <div class="d-flex justify-content-between price-discount">
                  <p className="price m-0"> BDT. 7,850 </p>
                  <p className="discount m-0"> 15% </p>
                </div>
              </div>
              <div className="overlay">
                <button type="button" className="btn btn-primary add-to-cart">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
          <div className="col ">
            <div className="card border-0 ">
              <div className="card-body px-3 py-3">
                <img src={sample} className="card-img mb-3" alt="ad" />
                <h5 className="card-title mb-4">Card title</h5>
                <div class="d-flex justify-content-between price-discount">
                  <p className="price m-0"> BDT. 7,850 </p>
                  <p className="discount m-0"> 15% </p>
                </div>
              </div>
              <div className="overlay">
                <button type="button" className="btn btn-primary add-to-cart">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
          <div className="col ">
            <div className="card border-0 ">
              <div className="card-body px-3 py-3">
                <img src={sample} className="card-img mb-3" alt="ad" />
                <h5 className="card-title mb-4">Card title</h5>
                <div class="d-flex justify-content-between price-discount">
                  <p className="price m-0"> BDT. 7,850 </p>
                  <p className="discount m-0"> 15% </p>
                </div>
              </div>
              <div className="overlay">
                <button type="button" className="btn btn-primary add-to-cart">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
          <div className="col ">
            <div className="card border-0 ">
              <div className="card-body px-3 py-3">
                <img src={sample} className="card-img mb-3" alt="ad" />
                <h5 className="card-title mb-4">Card title</h5>
                <div class="d-flex justify-content-between price-discount">
                  <p className="price m-0"> BDT. 7,850 </p>
                  <p className="discount m-0"> 15% </p>
                </div>
              </div>
              <div className="overlay">
                <button type="button" className="btn btn-primary add-to-cart">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
          <div className="col ">
            <div className="card border-0 ">
              <div className="card-body px-3 py-3">
                <img src={sample} className="card-img mb-3" alt="ad" />
                <h5 className="card-title mb-4">Card title</h5>
                <div class="d-flex justify-content-between price-discount">
                  <p className="price m-0"> BDT. 7,850 </p>
                  <p className="discount m-0"> 15% </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col ">
            <div className="card border-0 ">
              <div className="card-body px-3 py-3">
                <img src={sample} className="card-img mb-3" alt="ad" />
                <h5 className="card-title mb-4">Card title</h5>
                <div class="d-flex justify-content-between price-discount">
                  <p className="price m-0"> BDT. 7,850 </p>
                  <p className="discount m-0"> 15% </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col ">
            <div className="card border-0 ">
              <div className="card-body px-3 py-3">
                <img src={sample} className="card-img mb-3" alt="ad" />
                <h5 className="card-title mb-4">Card title</h5>
                <div class="d-flex justify-content-between price-discount">
                  <p className="price m-0"> BDT. 7,850 </p>
                  <p className="discount m-0"> 15% </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col ">
            <div className="card border-0 ">
              <div className="card-body px-3 py-3">
                <img src={sample} className="card-img mb-3" alt="ad" />
                <h5 className="card-title mb-4">Card title</h5>
                <div class="d-flex justify-content-between price-discount">
                  <p className="price m-0"> BDT. 7,850 </p>
                  <p className="discount m-0"> </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
