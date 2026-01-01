import React from 'react'
import Pregressbar from '@/utilities/Pregressbar';
import Image from 'next/image';

interface Skill {
    name: string;
    level: number;
    yearsOfExp: number;
}

const SkillPage = ({ skills }: { skills: Skill[] }) => {
  return (
    <div className='skill-sec'>
        <div className="hdr">
            <h1 className='hds'>Technical Skills & Expertise</h1>
            <span className='desc'>Here are some of my technical skills and expertise.</span>
        </div>
        <div className="content">
            <div className="skill-card">
                <div className="skill-wrap"></div>
                <Image src="/contents/skills/skill.webp" alt="Skills Illustration" className='skill-img' width={500} height={500} />
            </div>
            <div className="skills-list">
                <ul>
                    {skills.map((skill, index) => <Pregressbar key={index} name={skill.name} level={skill.level} />)}
                </ul>
            </div>
        </div>
    </div>
  )
}

export default SkillPage