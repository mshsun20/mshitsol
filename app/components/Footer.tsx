import React from 'react'
import moment from 'moment'

const Footer = () => {
  const [currentTime, setCurrentTime] = React.useState(moment().format('DD-MM-YYYY HH:mm:ss'));

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment().format('DD-MM-YYYY HH:mm:ss'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='footer'>
      <div className="disclaimer">
        <span className='timesec'>{currentTime}</span>
        <span className='descsec'></span>
      </div>
      <div className="social"></div>
    </div>
  )
}

export default Footer