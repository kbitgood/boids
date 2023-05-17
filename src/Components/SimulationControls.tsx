import React, { ChangeEventHandler, useState } from 'react'
import type { Simulation } from '../Simulation/Simulation'

interface SimulationControlsProps {
  simulation: Simulation
}

type ControlName = keyof Simulation['params']

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  simulation,
}) => {
  return (
    <div className="absolute top-4 right-4 text-black p-4 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-60">
      <h2 className="text-2xl mb-4">Boids Simulation Controls</h2>
      <div className="space-y-4">
        <Control
          name="numBoids"
          min={0}
          max={1000}
          step={5}
          label="Number of Boids"
          simulation={simulation}
        />
        <Control
          name="alignWeight"
          min={0}
          max={1}
          step={0.01}
          label="Align Weight"
          simulation={simulation}
        />
        <Control
          name="cohereWeight"
          min={0}
          max={1}
          step={0.01}
          label="Cohere Weight"
          simulation={simulation}
        />
        <Control
          name="separateWeight"
          min={0}
          max={1}
          step={0.01}
          label="Separate Weight"
          simulation={simulation}
        />
        <Control
          name="viewDistance"
          min={0}
          max={500}
          step={10}
          label="View Distance"
          simulation={simulation}
        />
        <Control
          name="maxSpeed"
          min={0}
          max={10}
          step={0.01}
          label="Max Speed"
          simulation={simulation}
        />
        <Control
          name="mouseDistance"
          min={0}
          max={500}
          step={10}
          label="Mouse Distance"
          simulation={simulation}
        />
        <Control
          name="mouseStrength"
          min={0}
          max={10}
          step={0.01}
          label="Mouse Strength"
          simulation={simulation}
        />
      </div>
    </div>
  )
}

interface ControlProps {
  label: string
  name: ControlName
  min: number
  max: number
  step: number
  simulation: Simulation
}

function Control({ name, min, max, step, label, simulation }: ControlProps) {
  const [value, setValue] = useState(simulation.params[name])

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = parseFloat(event.target.value)
    simulation.params[name] = value
    setValue(value)
  }

  return (
    <div>
      <label htmlFor={name} className="block mb-2">
        {label}: {value.toFixed(2)}
      </label>
      <input
        id={name}
        name={name}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleInputChange}
        className="w-full px-3 py-2 bg-gray-300 rounded"
      />
    </div>
  )
}
