import React from 'react'
import Rating from '@mui/material/Rating'


interface testimonial {
    user: { username: string, fullname: string, company: string, role: string },
    feedbacks: string,
    rating: number,
    scale: number
}

const Testimonial = ({ item }: { item: testimonial}) => {
    return <div className="testimonial-card">
        <div className="testimonial-rating">
            <Rating name="precision-rating-read" defaultValue={item.rating} max={item.scale} precision={0.5} readOnly />
        </div>
        <div className="testimonial-feedback">{item.feedbacks}</div>
        <div className="testimonial-client">{item.user.fullname}</div>
    </div>
}

export default Testimonial