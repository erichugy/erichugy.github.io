import React from "react";
import "./contact.css";
import { MdOutlineEmail } from "react-icons/md";
import { RiMessengerFill } from "react-icons/ri"

const email = "fireshot2002@gmail.com";

const Contact = () => {
  return (
    <section id="contact">
      <h5>Get in Touch</h5>
      <h2>Contact Me</h2>

      <div className="container contact__container">
        <div className="contact__options">
          <article className="contact__option">
            <MdOutlineEmail className="contact__option-icon" />
            <h4>Email</h4>
            {/* <h5>{email}</h5> */}
            <a href={`mailto:${email}`} target='_blank'>Send a message</a>
          </article>

          <article className="contact__option">
            <RiMessengerFill className="contact__option-icon"/>
            <h4>Messenger</h4>
            {/* <h5>Eric Huang</h5> */}
            <a href="https://m.me/ewic.hugy" target='_blank'>Send a message</a>
          </article>

          {/* <article className="contact__option">
            <MdOutlineEmail />
            <h4>Email</h4>
            <h5>{email}</h5>
            <a href="www.linkedin.com/in/erichugy">Send a message</a>
          </article> */}
        </div>
          <form action="">
            <input type="text" name='lastname' placeholder='Last Name' required/>
            <input type="text" name='firstname' placeholder='First Name' required/>
            <input type="email" name='email' placeholder='Your Email' required />
            <textarea name="message" rows="7" placeholder="Your Message" required></textarea>
            <button type='submit' className='btn btn-primary'>Send Message</button>
          </form>

      </div>
    </section>
  );
};

export default Contact;
