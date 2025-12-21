import React from 'react'

interface Progress {
    name: string;
    level: number;
}

const Pregressbar = ({ name, level } : Progress ) => {
    const [value, setValue] = React.useState(0);
    const [width, setWidth] = React.useState('0%');

    React.useEffect(() => {
        const id = requestAnimationFrame(() => {
            setValue(level);
            setWidth(`${(level / 10) * 100}%`);
        });
        return () => cancelAnimationFrame(id);
    }, [level]);

  return (
    <>
        <li className="progress-list">
            <div className="flex justify-between text-sm font-medium">
                <span className='progress-label'>{name}</span>
                <span className="progress-val">{`${value}/10`}</span>
            </div>

            <div className="progress-container h-2 w-full rounded">
                <div
                    className="progressbar glow-bar h-full rounded transition-all duration-1000 ease-in-out"
                    style={{ width }}
                />
            </div>
        </li>
    </>
  )
}

export default Pregressbar