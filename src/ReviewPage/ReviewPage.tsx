import axios from "axios";
import { useEffect, useState } from "react";


function ReviewPage(){

    type review={
        id: String;
        message: String;
        guestId: String;
        name: String;
        date: String;
        roomNumber: Number;
        types: String;
    };
    const[reviews, setReviews] = useState<review[]>([]);

    useEffect(()=> {
     axios.get("http://localhost:5000/Reviews",
        {withCredentials: true}
     ).then((res) => {
        setReviews(res.data);
     }).catch((err) => {
        console.log(err);
     })
    },[])

    return(
     <div className="container-fluid rounded-4 my-1 mx-4 px-lg-5 px-1 py-2 col-12 bg-light mx-auto shadow-lg">
        <p className='h5 my-3'>Reviews:</p>
        <div className="text-center text-secondary">
            {reviews.length ? (
                reviews.map((items, index) => (
                    <div key={index}>
                     {items.types === "Review" ? (
                       <div className="border border-1 bg-secondary bg-opacity-25 m-3 p-3 rounded-3">
                        <div className="d-flex justify-content-between text-dark">
                            <p className="fw-bold">{items.name}</p>
                            <p className="float-end">{items.date}</p>
                            <p className="fw-bold">{`Room No: ${items.roomNumber}`}</p>
                        </div>
                        <div className="bg-light bg-opacity-50 rounded-3 py-3 text-dark">"{items.message}"</div>
                    </div>
                     ):(
                       <div className="border border-1 border-danger bg-danger m-3 p-3 rounded-3">
                        <div className="d-flex justify-content-between text-light">
                            <p className="fw-bold">{items.name}</p>
                            <p className="float-end">{items.date}</p>
                            <p className="fw-bold">{`Room No: ${items.roomNumber}`}</p>
                        </div>
                        <div className="bg-light bg-opacity-25 rounded-3 py-3 text-light">"{items.message}"</div>
                    </div>
                     )}   
                </div> 
                ))
            ) : (
             <p>No reviews</p>
            )} 
        </div>
     </div>
    );
}
export default ReviewPage;