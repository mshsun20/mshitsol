import React from 'react'
import skillSets from '@/data/skillSets';

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
                    {skillSets.map((skill, index) => (
                        <li key={index}>
                            <span className="skill-name">{skill.name}</span>
                            <div className="skill-level">{skill.level}%</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
  )
}

export default SkillPage