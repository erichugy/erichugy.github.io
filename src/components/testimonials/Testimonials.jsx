import React from 'react'
import './testimonials.css'
import AVRT1 from '../../assets/avatar1.jpg'
import AVRT2 from '../../assets/avatar2.jpg'
import AVRT3 from '../../assets/avatar3.jpg'
import AVRT4 from '../../assets/avatar4.jpg'


// import Swiper core and required modules
import { Navigation, Pagination } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';


const testimonialItems = [
  {
    avatar: AVRT1,
    name: "Kevin Wang",
    review: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor temporibus eos distinctio dolorum, exercitationem, officiis quisquam ratione saepe eveniet expedita quos libero adipisci reprehenderit modi. Amet at quas ullam earum."
  },
  {
    avatar: AVRT2,
    name: "Kevin Wang",
    review: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor temporibus eos distinctio dolorum, exercitationem, officiis quisquam ratione saepe eveniet expedita quos libero adipisci reprehenderit modi. Amet at quas ullam earum."
  },
  {
    avatar: AVRT3,
    name: "Kevin Wang",
    review: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor temporibus eos distinctio dolorum, exercitationem, officiis quisquam ratione saepe eveniet expedita quos libero adipisci reprehenderit modi. Amet at quas ullam earum."
  },
  {
    avatar: AVRT4,
    name: "Kevin Wang",
    review: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor temporibus eos distinctio dolorum, exercitationem, officiis quisquam ratione saepe eveniet expedita quos libero adipisci reprehenderit modi. Amet at quas ullam earum."
  }
]


const Testimonials = () => {
  return (
    <section id='testimonials'>
      <h5>Review from clients</h5>
      <h2>Testimonials</h2>

      <Swiper className="container testimonials__container"
       modules={[Navigation, Pagination]}
       spaceBetween={40}
       slidesPerView={1}
       navigation
       pagination={{ clickable: true }}
       >
        {
          testimonialItems.map(({avatar, name, review}, index) => {
            return(
            <SwiperSlide className="testimonial" key={index}>
              <div className="client__avatar">
                <img src={avatar} alt={name} />
              </div>
              <h5 className="client__name">{name}</h5>
              <small className="client__review">{review}</small>
            </SwiperSlide>
            );
          })
        }

      </Swiper>
    
    </section>
  )
  
}

export default Testimonials