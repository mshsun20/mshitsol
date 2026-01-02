import testimonials from '@/data/testimonials'
import Testimonial from '@/components/blocs/TestimonialCard'

const TestimonialPage = () => {
  return <div className='testimonial-sec'>
    <div className="testimonial-main">
      <div className="testimonial-hdr">Client Testimonials</div>
      <div className="testimonial-desc">What clients and collaborators say about working with me</div>
      <div className="testimonial-content">
        {testimonials?.map((elm, i) => <Testimonial item={elm} key={i} />)}
      </div>
    </div>
  </div>
}

export default TestimonialPage