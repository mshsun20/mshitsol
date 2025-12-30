import React from 'react'
import {
    CodeXml,
    Briefcase,
    Calendar,
    Layers,
} from 'lucide-react'
import projectData from '@/data/projects'
import skillSets from '@/data/skillSets'

const CounterPage = () => {
    const [livep, setLivep] = React.useState(0) 
    const [devp, setDevp] = React.useState(0)
    const [yrOfExp, setYrOfExp] = React.useState(0)
    const [skillCnt, setSkillCnt] = React.useState(0)

    const getProjectStat = React.useCallback(() => {
        setLivep(projectData.filter(p => p.status === 'Live').length)
        setDevp(projectData.filter(p => p.status === 'Development').length)
        setYrOfExp(skillSets.reduce((acc, elm) => Math.max(acc, elm.yearsOfExp), 0))
        setSkillCnt(skillSets.length)
    }, [])

    React.useEffect(() => getProjectStat(), [getProjectStat])

  return (
    <>
        <div className='counter-sec'>
            <div className="counter-card">
                <div className="counter-icon"><Briefcase className='icn' /></div>
                <div className="counter-value">{livep}</div>
                <div className="counter-hds">Projects Completed</div>
                <div className="counter-details">Several industrial software projects delivered</div>
            </div>
            <div className="counter-card">
                <div className="counter-icon"><CodeXml className='icn' /></div>
                <div className="counter-value">{devp}</div>
                <div className="counter-hds">In Development</div>
                <div className="counter-details">Active projects currently being built</div>
            </div>
            <div className="counter-card">
                <div className="counter-icon"><Calendar className='icn' /></div>
                <div className="counter-value">{yrOfExp}</div>
                <div className="counter-hds">Years Experience</div>
                <div className="counter-details">Professional development experience</div>
            </div>
            <div className="counter-card">
                <div className="counter-icon"><Layers className='icn' /></div>
                <div className="counter-value">{skillCnt}</div>
                <div className="counter-hds">Teck Stacks</div>
                <div className="counter-details">Several Technologies and frameworks mastered</div>
            </div>
        </div>
    </>
  )
}

export default CounterPage