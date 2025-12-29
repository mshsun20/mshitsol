import React from 'react'

const CounterPage = () => {
  return (
    <>
        <div className='counter-sec'>
            <div className="counter-card">
                <div className="counter-icon"></div>
                <div className="counter-value"></div>
                <div className="counter-hds"></div>
                <div className="counter-details"></div>
            </div>
            {/* <div className="content">
                <div className="counter-card">
                    <div className="counter-icon"></div>
                    <div className="counter-value"></div>
                    <div className="counter-hds"></div>
                    <div className="counter-details"></div>
                </div>
                <div className="skills-list">
                    <ul>
                        {skills.map((skill, index) => <Pregressbar key={index} name={skill.name} level={skill.level} />)}
                    </ul>
                </div>
            </div> */}
        </div>
    </>
  )
}

export default CounterPage