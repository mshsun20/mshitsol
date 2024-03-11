import '../styles/Home.css'

const Home = () => {
  return (
    <>
      <div className="main">
        <div className="home-hero">
          <div className="heroContainer home-hero1">
            <div className="home-container01">
              <h1 className="home-hero-heading heading1">
                Web Development Services
              </h1>
              <span className="home-hero-sub-heading bodyLarge">
                <span>
                  <span>
                    <span>Creating stunning websites for your business</span>
                    <span></span>
                  </span>
                  <span>
                    <span></span>
                    <span></span>
                  </span>
                </span>
                <span>
                  <span>
                    <span></span>
                    <span></span>
                  </span>
                  <span>
                    <span></span>
                    <span></span>
                  </span>
                </span>
              </span>
              <div className="home-btn-group">
                <button className="buttonFilled">Get Started</button>
                <button className="buttonFlat">Learn More&nbsp;→</button>
              </div>
            </div>
          </div>
        </div>

        <div className="home-features">
          <div className="featuresContainer">
            <div className="home-features1">
              <div className="home-container02">
                <span className="overline">
                  <span className='hdng'>Features</span>
                  <br />
                </span>
                <h2 className="home-features-heading heading2">Our Key Features</h2>
                <span className="home-features-sub-heading bodyLarge">
                  <span>
                    <span>
                      <span>
                        Unlock the full potential of your website with our
                        powerful features
                      </span>
                      <span></span>
                    </span>
                    <span>
                      <span></span>
                      <span></span>
                    </span>
                  </span>
                  <span>
                    <span>
                      <span></span>
                      <span></span>
                    </span>
                    <span>
                      <span></span>
                      <span></span>
                    </span>
                  </span>
                </span>
              </div>
              <div className="home-container03">
                <div className="featuresCard feature-card-feature-card">
                  <svg viewBox="0 0 1024 1024" className="featuresIcon">
                    <path
                      d="M809.003 291.328l-297.003 171.819-297.003-171.819 275.456-157.397c4.779-2.731 9.899-4.48 15.147-5.333 9.301-1.451 18.987 0.128 27.904 5.291zM491.776 979.669c6.016 3.243 12.928 5.077 20.224 5.077 7.381 0 14.336-1.877 20.395-5.163 15.189-2.475 29.909-7.68 43.392-15.36l298.709-170.709c26.368-15.232 45.269-38.315 55.424-64.597 5.675-14.592 8.619-30.165 8.747-46.251v-341.333c0-20.395-4.821-39.723-13.397-56.917-0.939-3.029-2.219-5.973-3.883-8.832-1.963-3.371-4.267-6.357-6.912-8.96-1.323-1.835-2.731-3.669-4.139-5.419-9.813-12.203-21.845-22.528-35.456-30.507l-299.051-170.88c-26.027-15.019-55.467-19.84-83.328-15.531-15.531 2.432-30.507 7.637-44.288 15.488l-298.709 170.709c-16.341 9.429-29.824 21.888-40.149 36.267-2.56 2.56-4.864 5.547-6.784 8.832-1.664 2.901-2.987 5.888-3.925 8.96-1.707 3.456-3.243 6.955-4.608 10.496-5.632 14.635-8.576 30.208-8.704 45.995v341.632c0.043 30.293 10.581 58.197 28.331 80.128 9.813 12.203 21.845 22.528 35.456 30.507l299.051 170.88c13.824 7.979 28.587 13.099 43.605 15.445zM469.333 537.045v340.949l-277.12-158.336c-4.736-2.773-8.832-6.315-12.16-10.411-5.931-7.381-9.387-16.512-9.387-26.581v-318.379zM554.667 877.995v-340.949l298.667-172.757v318.379c-0.043 5.163-1.067 10.496-2.987 15.445-3.413 8.789-9.6 16.384-18.176 21.333z"
                    ></path>
                  </svg>
                  <div className="feature-card-container">
                    <h3 className="feature-card-text heading3">
                      <span>Responsive Design</span>
                    </h3>
                    <span className="bodySmall">
                      <span>Create websites that look great on any device</span>
                    </span>
                  </div>
                </div>
                <div className="featuresCard feature-card-feature-card">
                  <svg viewBox="0 0 1024 1024" className="featuresIcon">
                    <path
                      d="M809.003 291.328l-297.003 171.819-297.003-171.819 275.456-157.397c4.779-2.731 9.899-4.48 15.147-5.333 9.301-1.451 18.987 0.128 27.904 5.291zM491.776 979.669c6.016 3.243 12.928 5.077 20.224 5.077 7.381 0 14.336-1.877 20.395-5.163 15.189-2.475 29.909-7.68 43.392-15.36l298.709-170.709c26.368-15.232 45.269-38.315 55.424-64.597 5.675-14.592 8.619-30.165 8.747-46.251v-341.333c0-20.395-4.821-39.723-13.397-56.917-0.939-3.029-2.219-5.973-3.883-8.832-1.963-3.371-4.267-6.357-6.912-8.96-1.323-1.835-2.731-3.669-4.139-5.419-9.813-12.203-21.845-22.528-35.456-30.507l-299.051-170.88c-26.027-15.019-55.467-19.84-83.328-15.531-15.531 2.432-30.507 7.637-44.288 15.488l-298.709 170.709c-16.341 9.429-29.824 21.888-40.149 36.267-2.56 2.56-4.864 5.547-6.784 8.832-1.664 2.901-2.987 5.888-3.925 8.96-1.707 3.456-3.243 6.955-4.608 10.496-5.632 14.635-8.576 30.208-8.704 45.995v341.632c0.043 30.293 10.581 58.197 28.331 80.128 9.813 12.203 21.845 22.528 35.456 30.507l299.051 170.88c13.824 7.979 28.587 13.099 43.605 15.445zM469.333 537.045v340.949l-277.12-158.336c-4.736-2.773-8.832-6.315-12.16-10.411-5.931-7.381-9.387-16.512-9.387-26.581v-318.379zM554.667 877.995v-340.949l298.667-172.757v318.379c-0.043 5.163-1.067 10.496-2.987 15.445-3.413 8.789-9.6 16.384-18.176 21.333z"
                    ></path>
                  </svg>
                  <div className="feature-card-container">
                    <h3 className="feature-card-text heading3">
                      <span>Customizable Templates</span>
                    </h3>
                    <span className="bodySmall">
                      <span>
                        Choose from a variety of pre-designed templates or
                        create your own
                      </span>
                    </span>
                  </div>
                </div>
                <div className="featuresCard feature-card-feature-card">
                  <svg viewBox="0 0 1024 1024" className="featuresIcon">
                    <path
                      d="M809.003 291.328l-297.003 171.819-297.003-171.819 275.456-157.397c4.779-2.731 9.899-4.48 15.147-5.333 9.301-1.451 18.987 0.128 27.904 5.291zM491.776 979.669c6.016 3.243 12.928 5.077 20.224 5.077 7.381 0 14.336-1.877 20.395-5.163 15.189-2.475 29.909-7.68 43.392-15.36l298.709-170.709c26.368-15.232 45.269-38.315 55.424-64.597 5.675-14.592 8.619-30.165 8.747-46.251v-341.333c0-20.395-4.821-39.723-13.397-56.917-0.939-3.029-2.219-5.973-3.883-8.832-1.963-3.371-4.267-6.357-6.912-8.96-1.323-1.835-2.731-3.669-4.139-5.419-9.813-12.203-21.845-22.528-35.456-30.507l-299.051-170.88c-26.027-15.019-55.467-19.84-83.328-15.531-15.531 2.432-30.507 7.637-44.288 15.488l-298.709 170.709c-16.341 9.429-29.824 21.888-40.149 36.267-2.56 2.56-4.864 5.547-6.784 8.832-1.664 2.901-2.987 5.888-3.925 8.96-1.707 3.456-3.243 6.955-4.608 10.496-5.632 14.635-8.576 30.208-8.704 45.995v341.632c0.043 30.293 10.581 58.197 28.331 80.128 9.813 12.203 21.845 22.528 35.456 30.507l299.051 170.88c13.824 7.979 28.587 13.099 43.605 15.445zM469.333 537.045v340.949l-277.12-158.336c-4.736-2.773-8.832-6.315-12.16-10.411-5.931-7.381-9.387-16.512-9.387-26.581v-318.379zM554.667 877.995v-340.949l298.667-172.757v318.379c-0.043 5.163-1.067 10.496-2.987 15.445-3.413 8.789-9.6 16.384-18.176 21.333z"
                    ></path>
                  </svg>
                  <div className="feature-card-container">
                    <h3 className="feature-card-text heading3">
                      <span>E-commerce Integration</span>
                    </h3>
                    <span className="bodySmall">
                      <span>
                        Sell products or services directly from your website
                      </span>
                    </span>
                  </div>
                </div>
                <div className="featuresCard feature-card-feature-card">
                  <svg viewBox="0 0 1024 1024" className="featuresIcon">
                    <path
                      d="M809.003 291.328l-297.003 171.819-297.003-171.819 275.456-157.397c4.779-2.731 9.899-4.48 15.147-5.333 9.301-1.451 18.987 0.128 27.904 5.291zM491.776 979.669c6.016 3.243 12.928 5.077 20.224 5.077 7.381 0 14.336-1.877 20.395-5.163 15.189-2.475 29.909-7.68 43.392-15.36l298.709-170.709c26.368-15.232 45.269-38.315 55.424-64.597 5.675-14.592 8.619-30.165 8.747-46.251v-341.333c0-20.395-4.821-39.723-13.397-56.917-0.939-3.029-2.219-5.973-3.883-8.832-1.963-3.371-4.267-6.357-6.912-8.96-1.323-1.835-2.731-3.669-4.139-5.419-9.813-12.203-21.845-22.528-35.456-30.507l-299.051-170.88c-26.027-15.019-55.467-19.84-83.328-15.531-15.531 2.432-30.507 7.637-44.288 15.488l-298.709 170.709c-16.341 9.429-29.824 21.888-40.149 36.267-2.56 2.56-4.864 5.547-6.784 8.832-1.664 2.901-2.987 5.888-3.925 8.96-1.707 3.456-3.243 6.955-4.608 10.496-5.632 14.635-8.576 30.208-8.704 45.995v341.632c0.043 30.293 10.581 58.197 28.331 80.128 9.813 12.203 21.845 22.528 35.456 30.507l299.051 170.88c13.824 7.979 28.587 13.099 43.605 15.445zM469.333 537.045v340.949l-277.12-158.336c-4.736-2.773-8.832-6.315-12.16-10.411-5.931-7.381-9.387-16.512-9.387-26.581v-318.379zM554.667 877.995v-340.949l298.667-172.757v318.379c-0.043 5.163-1.067 10.496-2.987 15.445-3.413 8.789-9.6 16.384-18.176 21.333z"
                    ></path>
                  </svg>
                  <div className="feature-card-container">
                    <h3 className="feature-card-text heading3">
                      <span>SEO Optimization</span>
                    </h3>
                    <span className="bodySmall">
                      <span>
                        Improve your website's visibility on search engines
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="home-pricing">
          <div className="pricingContainer">
            <div className="home-container04">
              <span className="overline">
                <span className='hdng'>Pricing</span>
                <br />
              </span>
              <h2 className="heading2">Choose a Plan that Fits Your Needs</h2>
              <span className="home-pricing-sub-heading bodyLarge">
                Take your website to the next level with our flexible
                pricing options.
              </span>
            </div>
            <div className="home-container05">
              <div className="freePricingCard home-pricing-card">
                <div className="dtl">
                  <div className="home-container06">
                    <span className="home-text36 heading3">Free</span>
                    <span className="bodySmall">
                      A short description for the Free plan
                    </span>
                  </div>
                  <div className="home-container07">
                    <span className="home-text37">
                      <span>$</span>
                      <span></span>
                    </span>
                    <span className="home-free-plan-price">0</span>
                  </div>
                  <div className="home-container08">
                    <div className="home-container09">
                      <span className="home-text40">✔</span>
                      <span className="bodySmall">Feature 1 of the Free plan</span>
                    </div>
                    <div className="home-container10">
                      <span className="home-text41">✔</span>
                      <span className="bodySmall">Feature 2 of the Free plan</span>
                    </div>
                    <div className="home-container11">
                      <span className="home-text42">✔</span>
                      <span className="bodySmall">Feature 3 of the Free plan</span>
                    </div>
                    <div className="home-container12">
                      <span className="home-text43">✔</span>
                      <span className="bodySmall">Feature 4 of the Free plan</span>
                    </div>
                  </div>
                </div>
                <button className="home-button buttonOutline">
                  Continue with Free
                </button>
              </div>
              <div className="basicPricingCard home-pricing-card1">
                <div className="dtl">
                  <div className="home-container13">
                    <span className="home-text44 heading3">BASIC</span>
                    <span className="bodySmall">
                      A short description for the Basic plan
                    </span>
                  </div>
                  <div className="home-container14">
                    <span className="home-text45">
                      <span>$</span>
                      <span></span>
                    </span>
                    <span className="home-basic-plan-pricing">25</span>
                    <span className="home-text48">/ month</span>
                  </div>
                  <div className="home-container15">
                    <div className="home-container16">
                      <span className="home-text49">✔</span>
                      <span className="bodySmall">All features of FREE plan</span>
                    </div>
                    <div className="home-container17">
                      <span className="home-text51">✔</span>
                      <span className="bodySmall">Feature 1 of the Basic plan</span>
                    </div>
                    <div className="home-container18">
                      <span className="home-text52">✔</span>
                      <span className="bodySmall">Feature 2 of the Basic plan</span>
                    </div>
                    <div className="home-container19">
                      <span className="home-text53">✔</span>
                      <span className="bodySmall">Feature 3 of the Basic plan</span>
                    </div>
                    <div className="home-container20">
                      <span className="home-text54">✔</span>
                      <span className="bodySmall">Feature 4 of the Basic plan</span>
                    </div>
                  </div>
                </div>
                <button className="home-button1 buttonFilledSecondary">
                  Try the Basic plan
                </button>
              </div>
              <div className="proPricingCard home-pricing-card2">
                <div className="dtl">
                  <div className="home-container21">
                    <span className="home-text55 heading3">PRO</span>
                    <span className="bodySmall">
                      A short description for the Pro plan
                    </span>
                  </div>
                  <div className="home-container22">
                    <span className="home-text58">
                      <span>$</span>
                      <span></span>
                    </span>
                    <span className="home-pro-plan-pricing">40</span>
                    <span className="home-text61">/ month</span>
                  </div>
                  <div className="home-container23">
                    <div className="home-container24">
                      <span className="home-text62">✔</span>
                      <span className="bodySmall">
                        &nbsp;All features of BASIC plan
                      </span>
                    </div>
                    <div className="home-container25">
                      <span className="home-text64">✔</span>
                      <span className="bodySmall">Feature 1 of the Pro plan</span>
                    </div>
                    <div className="home-container26">
                      <span className="home-text65">✔</span>
                      <span className="bodySmall">Feature 2 of the Pro plan</span>
                    </div>
                    <div className="home-container27">
                      <span className="home-text66">✔</span>
                      <span className="bodySmall">Feature 3 of the Pro plan</span>
                    </div>
                    <div className="home-container28">
                      <span className="home-text67">✔</span>
                      <span className="bodySmall">Feature 4 of the Pro plan</span>
                    </div>
                  </div>
                </div>
                <button className="home-button2 buttonFilledSecondary">
                  Try the PRO plan
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="home-banner">
          <div className="bannerContainer home-banner1">
            <h1 className="home-banner-heading heading2">
              Transform Your Online Presence
            </h1>
            <span className="home-banner-sub-heading bodySmall">
              <span>
                <span>
                  At our web development service, we specialize in creating
                  visually appealing and highly functional websites that help
                  businesses succeed in the digital world. With our team of
                  experienced developers, we can bring your ideas to life and
                  provide you with a website that not only looks great but
                  also drives results.
                </span>
                <span>
                  <span></span>
                  <span></span>
                </span>
              </span>
              <span>
                <span>
                  <span></span>
                  <span></span>
                </span>
                <span>
                  <span></span>
                  <span></span>
                </span>
              </span>
            </span>
            <button className="buttonFilled">Learn More</button>
          </div>
        </div>

        <div className="home-faq">
          <div className="faqContainer">
            <div className="home-faq1">
              <div className="home-container29">
                <span className="overline">
                  <span className='hdng'>FAQ</span>
                  <br />
                </span>
                <h2 className="home-text85 heading2">Common questions</h2>
                <span className="home-text86 bodyLarge">
                  <span>
                    Here are some of the most common questions that we get.
                  </span>
                  <br />
                </span>
              </div>
              <div className="home-container30">
                <div className="question1-container">
                  <span className="question1-text heading3">
                    <span>What services do you offer?</span>
                  </span>
                  <span className="bodySmall">
                    <span>
                      We offer a wide range of web development services
                      including website design, front-end development, back-end
                      development, e-commerce development, and website
                      maintenance.
                    </span>
                  </span>
                </div>
                <div className="question1-container">
                  <span className="question1-text heading3">
                    <span>How long does it take to build a website?</span>
                  </span>
                  <span className="bodySmall">
                    <span>
                      The time required to build a website depends on various
                      factors such as the complexity of the project, the number
                      of pages, and the features required. We will provide you
                      with an estimated timeline after discussing your specific
                      requirements.
                    </span>
                  </span>
                </div>
                <div className="question1-container">
                  <span className="question1-text heading3">
                    <span>Do you provide website hosting?</span>
                  </span>
                  <span className="bodySmall">
                    <span>
                      We do not provide website hosting services. However, we
                      can recommend reliable hosting providers and assist you in
                      setting up your website on the hosting platform of your
                      choice.
                    </span>
                  </span>
                </div>
                <div className="question1-container">
                  <span className="question1-text heading3">
                    <span>
                      Can you help with website maintenance and updates?
                    </span>
                  </span>
                  <span className="bodySmall">
                    <span>
                      Yes, we offer website maintenance services to ensure that
                      your website remains up-to-date and secure. We can help
                      with content updates, bug fixes, performance optimization,
                      and regular backups.
                    </span>
                  </span>
                </div>
                <div className="question1-container">
                  <span className="question1-text heading3">
                    <span>What technologies do you work with?</span>
                  </span>
                  <span className="bodySmall">
                    <span>
                      We are proficient in a wide range of web development
                      technologies including HTML5, CSS3, JavaScript, PHP,
                      Python, Ruby on Rails, and various content management
                      systems (CMS) such as WordPress and Drupal.
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home