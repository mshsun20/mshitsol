import testimonials from '@/data/testimonials'
import Testimonial from '@/components/blocs/TestimonialCard'

const TestimonialPage = () => {
  return <div className='testimonial-sec'>{testimonials?.map((elm, i) => <Testimonial item={elm} key={i} />)}</div>
}

export default TestimonialPage