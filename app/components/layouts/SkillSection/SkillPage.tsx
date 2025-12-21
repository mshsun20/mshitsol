import React from 'react'
import skillSets from '@/data/skillSets';
import Pregressbar from '@/utilities/Pregressbar';

const SkillPage = () => {
  return (
    <div className='skill-sec'>
        <div className="hdr">
            <h1 className='hds'>Technical Skills & Expertise</h1>
            <span className='desc'>Here are some of my technical skills and expertise.</span>
        </div>
        <div className="content">
            <div className="skill-card"></div>
            <div className="skills-list">
                <ul>
                    {skillSets.map((skill, index) => <Pregressbar key={index} name={skill.name} level={skill.level} />)}
                </ul>
            </div>
        </div>
    </div>
  )
}

export default SkillPage