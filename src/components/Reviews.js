import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Reviews = () => (
  <div className="container mx-auto p-6">
    <h2 className="text-2xl font-bold mb-4">Reviews</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5].map((review, index) => ({
        /* <Card key={index} className="shadow-md">
          <CardContent>
            <h3 className="font-bold">User {index + 1}</h3>
            <p className="text-gray-600">
              This platform is amazing! I found my ideal room within minutes.
              Highly recommend.
            </p>
            <p className="text-yellow-500">★★★★☆</p>
          </CardContent>
        </Card> */
      }))}
    </div>
  </div>
);

export default Reviews;
