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
        <li className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
                <span>{name}</span>
                <span className="text-foreground/60">{value}</span>
            </div>

            <div className="h-2 w-full rounded bg-default-200 overflow-hidden">
                <div
                    className="progressbar glow-bar h-full rounded transition-all duration-700 ease-out"
                    style={{ width }}
                />
            </div>
        </li>
    </>
  )
}

export default Pregressbar