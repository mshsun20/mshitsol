import { useState, useEffect } from 'react'
import '../../styles/Plans.css'

const Plans = () => {
    const getPlns = async () => {
        try {
            // const res = await axios.get(`${server}/pln/fetch`)
            // const data = await res.data
            // console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <>
        <div className="main">
            <div className="main-wrapper">
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
                                    Try the Basic Plan
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
                                    Try the Pro Plan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Plans