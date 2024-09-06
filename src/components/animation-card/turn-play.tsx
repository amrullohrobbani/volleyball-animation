'use client'
import { useEffect, forwardRef, useState, useImperativeHandle } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Text } from '@react-three/drei'


interface BallProps {
    position: [number, number, number];
}

const Ball: React.FC<BallProps> = ({ position}) => {
    return (
      <group position={position}>
        {/* Circle for player */}
        <mesh>
          <circleGeometry args={[0.2, 32]} /> {/* Circle with radius 0.5 */}
          <meshStandardMaterial color="white" />
        </mesh>
  
        {/* Outer white stroke */}
        <mesh>
          <ringGeometry args={[0.2, 0.25, 32]} /> {/* Slightly bigger white stroke */}
          <meshStandardMaterial color="black" />
        </mesh>
      </group>
    );
  };

// Player component
interface PlayerProps {
    position: [number, number, number];
    color: string;
    number: number;
}

// Player component
const Player: React.FC<PlayerProps> = ({ position, color, number }) => {
    return (
      <group position={position}>
        {/* Circle for player */}
        <mesh>
          <circleGeometry args={[0.3, 32]} /> {/* Circle with radius 0.5 */}
          <meshStandardMaterial color={color} />
        </mesh>
  
        {/* Outer white stroke */}
        <mesh>
          <ringGeometry args={[0.3, 0.35, 32]} /> {/* Slightly bigger white stroke */}
          <meshStandardMaterial color="white" />
        </mesh>
  
        {/* Player number */}
      <Text
        position={[0, 0, 0.1]} // Raise the text slightly above the circle
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {number.toString()}
      </Text>
      </group>
    );
  };

const lerp = (start: number, end: number, t: number): number => start + t * (end - start);

// Helper function to interpolate positions based on time
const interpolatePosition = (
  positions: { timestamp: number; position: [number, number, number] }[],
  currentTime: number
): [number, number, number] => {
  if (positions.length < 2) return positions[0].position;

  for (let i = 0; i < positions.length - 1; i++) {
    const currentPos = positions[i];
    const nextPos = positions[i + 1];

    if (currentTime >= currentPos.timestamp && currentTime <= nextPos.timestamp) {
      const t = (currentTime - currentPos.timestamp) / (nextPos.timestamp - currentPos.timestamp);

      return [
        lerp(currentPos.position[0], nextPos.position[0], t),
        lerp(currentPos.position[1], nextPos.position[1], t),
        lerp(currentPos.position[2], nextPos.position[2], t),
      ];
    }
  }

  // If we passed all positions, return the last one
  return positions[positions.length - 1].position;
};

const Court: React.FC<{ startAnimation: boolean }> = ({ startAnimation }) => {
    const [startTime, setStartTime] = useState<number | null>(null);
    const [currentTime, setCurrentTime] = useState(0);

    type BallPositionData = {
        timestamp: number;
        position: [number, number, number];
    }[]
    type PlayerPositionData = {
        timestamp: number;
        position: [number, number, number];
    }[][]

    const ballPositions: BallPositionData = [
        { "timestamp": 0, "position": [-3.87, 1, 8] },
        { "timestamp": 10000, "position": [2.15, 1.5, 8] },
        { "timestamp": 20000, "position": [-4.25, 1.2, 8] },
        { "timestamp": 30000, "position": [0.95, 1.6, 8] },
        { "timestamp": 40000, "position": [3.85, 1.1, 8] },
        { "timestamp": 50000, "position": [-2.15, 1.4, 8] },
        { "timestamp": 60000, "position": [1.75, 1.7, 8] }
    ]

    const playerPositions: PlayerPositionData = [
    [
      { "timestamp": 0, "position": [-5, -1.65, 7] },
      { "timestamp": 10000, "position": [-4.53, 2.85, 7] },
      { "timestamp": 20000, "position": [-2.91, -1.23, 7] },
      { "timestamp": 30000, "position": [-0.93, -0.98, 7] },
      { "timestamp": 40000, "position": [-1.77, 0.76, 7] },
      { "timestamp": 50000, "position": [-0.98, -2.12, 7] },
      { "timestamp": 60000, "position": [-1.15, 2.01, 7] }
    ],
    [
      { "timestamp": 0, "position": [-4, 1.34, 7] },
      { "timestamp": 10000, "position": [-3.78, 1.65, 7] },
      { "timestamp": 20000, "position": [-1.35, -2.54, 7] },
      { "timestamp": 30000, "position": [-3.27, 0.45, 7] },
      { "timestamp": 40000, "position": [-3.89, -2.12, 7] },
      { "timestamp": 50000, "position": [-1.65, 1.23, 7] },
      { "timestamp": 60000, "position": [-3.54, -0.87, 7] }
    ],
    [
      { "timestamp": 0, "position": [-7, -2.78, 7] },
      { "timestamp": 10000, "position": [-4.87, 0.67, 7] },
      { "timestamp": 20000, "position": [-4.43, -1.54, 7] },
      { "timestamp": 30000, "position": [-1.23, 2.11, 7] },
      { "timestamp": 40000, "position": [-4.03, 1.98, 7] },
      { "timestamp": 50000, "position": [-3.76, 0.78, 7] },
      { "timestamp": 60000, "position": [-4.23, -1.45, 7] }
    ],
    [
      { "timestamp": 0, "position": [-1, -0.67, 7] },
      { "timestamp": 10000, "position": [-1.12, -1.43, 7] },
      { "timestamp": 20000, "position": [-2.15, 1.24, 7] },
      { "timestamp": 30000, "position": [-4.12, -2.01, 7] },
      { "timestamp": 40000, "position": [-1.34, 1.12, 7] },
      { "timestamp": 50000, "position": [-4.78, 2.45, 7] },
      { "timestamp": 60000, "position": [-1.98, -1.76, 7] }
    ],
    [
      { "timestamp": 0, "position": [-2, 2.23, 7] },
      { "timestamp": 10000, "position": [-0.65, -0.89, 7] },
      { "timestamp": 20000, "position": [-1.89, 0.76, 7] },
      { "timestamp": 30000, "position": [-2.45, -2.31, 7] },
      { "timestamp": 40000, "position": [-4.65, 1.98, 7] },
      { "timestamp": 50000, "position": [-2.54, -1.76, 7] },
      { "timestamp": 60000, "position": [-0.89, 2.65, 7] }
    ],
    [
      { "timestamp": 0, "position": [-3, -2.11, 7] },
      { "timestamp": 10000, "position": [-3.27, 0.76, 7] },
      { "timestamp": 20000, "position": [-4.78, -0.34, 7] },
      { "timestamp": 30000, "position": [-3.92, 1.45, 7] },
      { "timestamp": 40000, "position": [-2.11, -2.56, 7] },
      { "timestamp": 50000, "position": [-3.14, 0.56, 7] },
      { "timestamp": 60000, "position": [-2.32, -1.12, 7] }
    ],
    [
      { "timestamp": 0, "position": [5, 0.56, 7] },
      { "timestamp": 10000, "position": [2.98, -1.23, 7] },
      { "timestamp": 20000, "position": [1.98, 1.45, 7] },
      { "timestamp": 30000, "position": [4.12, -0.98, 7] },
      { "timestamp": 40000, "position": [0.56, 2.45, 7] },
      { "timestamp": 50000, "position": [3.23, -1.12, 7] },
      { "timestamp": 60000, "position": [1.89, 1.23, 7] }
    ],
    [
      { "timestamp": 0, "position": [4, -0.98, 7] },
      { "timestamp": 10000, "position": [4.23, 1.34, 7] },
      { "timestamp": 20000, "position": [3.12, -2.65, 7] },
      { "timestamp": 30000, "position": [1.45, 2.45, 7] },
      { "timestamp": 40000, "position": [1.87, -1.23, 7] },
      { "timestamp": 50000, "position": [0.98, 1.12, 7] },
      { "timestamp": 60000, "position": [3.12, -0.76, 7] }
    ],
    [
      { "timestamp": 0, "position": [7, 2.76, 7] },
      { "timestamp": 10000, "position": [0.54, 1.56, 7] },
      { "timestamp": 20000, "position": [4.45, -2.01, 7] },
      { "timestamp": 30000, "position": [3.23, 1.12, 7] },
      { "timestamp": 40000, "position": [2.98, -1.67, 7] },
      { "timestamp": 50000, "position": [4.78, 2.12, 7] },
      { "timestamp": 60000, "position": [4.45, 1.56, 7] }
    ],
    [
      { "timestamp": 0, "position": [1, -1.45, 7] },
      { "timestamp": 10000, "position": [3.89, 0.98, 7] },
      { "timestamp": 20000, "position": [2.65, 2.12, 7] },
      { "timestamp": 30000, "position": [2.34, -1.76, 7] },
      { "timestamp": 40000, "position": [4.11, 1.54, 7] },
      { "timestamp": 50000, "position": [1.12, -2.43, 7] },
      { "timestamp": 60000, "position": [2.34, 0.67, 7] }
    ],
    [
      { "timestamp": 0, "position": [2, 1.32, 7] },
      { "timestamp": 10000, "position": [1.12, -2.87, 7] },
      { "timestamp": 20000, "position": [4.23, 1.65, 7] },
      { "timestamp": 30000, "position": [4.78, -1.76, 7] },
      { "timestamp": 40000, "position": [0.98, 0.23, 7] },
      { "timestamp": 50000, "position": [2.54, 1.76, 7] },
      { "timestamp": 60000, "position": [4.12, -0.45, 7] }
    ],
    [
      { "timestamp": 0, "position": [3, -1.23, 7] },
      { "timestamp": 10000, "position": [2.45, 1.54, 7] },
      { "timestamp": 20000, "position": [0.87, -0.12, 7] },
      { "timestamp": 30000, "position": [3.65, 2.34, 7] },
      { "timestamp": 40000, "position": [4.56, -2.23, 7] },
      { "timestamp": 50000, "position": [3.76, 1.45, 7] },
      { "timestamp": 60000, "position": [0.54, 0.98, 7] }
    ]
  ]
  
    // Start animation when the prop changes
    useEffect(() => {
      if (startAnimation) {
        setStartTime(performance.now()); // Record the start time
        setCurrentTime(0); // Reset current time
      }
    }, [startAnimation]);
  
    // Use `useFrame` to update the current time and interpolate positions
    useFrame(() => {
      if (startAnimation && startTime !== null) {
        const elapsedTime = performance.now() - startTime;
        setCurrentTime(elapsedTime);
      }
    });
  
    return (
        <>
          {/* Outer boundary for the court */}
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[22, 12]} /> {/* Full court size 18m x 9m */}
            <meshStandardMaterial color="#1E90FF" />
          </mesh>
    
          {/* Blue playable area */}
          <mesh position={[0, 0.01, 0]}>
            <planeGeometry args={[16, 8]} /> {/* Inner playable area */}
            <meshStandardMaterial color="#D2691E" />
          </mesh>
    
          {/* White boundary lines */}
          <mesh position={[0, 0.02, -4]}>
            <planeGeometry args={[16, 0.1]} /> {/* Middle line */}
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[-8, 0.02, 0]}>
            <planeGeometry args={[0.1, 8]} /> {/* Left boundary line */}
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[8, 0.02, 0]}>
            <planeGeometry args={[0.1, 8]} /> {/* Right boundary line */}
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[0, 4, 0]}>
            <planeGeometry args={[16, 0.1]} /> {/* Top boundary line */}
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[0, -4, 0]}>
            <planeGeometry args={[16, 0.1]} /> {/* Top boundary line */}
            <meshStandardMaterial color="white" />
          </mesh>
    
          {/* Attack lines at 3m from the net */}
          <mesh position={[-3, 0.02, 0]}>
            <planeGeometry args={[0.05, 8]} /> {/* Left attack line */}
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[3, 0.02, 0]}>
            <planeGeometry args={[0.05, 8]} /> {/* Right attack line */}
            <meshStandardMaterial color="white" />
          </mesh>
    
          {/* Volleyball net */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.05, 7, 9]} /> {/* Net is 2.43m high for men's volleyball */}
            <meshStandardMaterial color="black" wireframe={true} />
          </mesh>
          
        {/* Players */}
        {playerPositions.map((player, index) => (
            <Player
                key={index}
                position={interpolatePosition(player, currentTime)}
                color={index < 6 ? 'red': 'blue'}
                number={index + 1}
            />
        ))}

        {/* Volleyball (ball) */}
        <Ball position={interpolatePosition(ballPositions, currentTime)} />
        </>
    );
  };
  
const CameraSetup = () => {
    const { camera } = useThree();
    camera.position.set(0, 0, 30); // Camera position (x, y, z)
    camera.lookAt(0, 0, 0); // Look at the center of the court
    return null;
};

const TurnPlay = forwardRef((_, ref) => {
    const [startAnimation, setStartAnimation] = useState(false);

    const handleStartAnimation = () => {
        // Toggle animation on button press
        setStartAnimation(!startAnimation)
    }

    useImperativeHandle(ref, () => ({
        handleStartAnimation,
    }))

    return (
        <div className='w-full h-[50vh]'>
            <Canvas>
                {/* Camera */}
                <PerspectiveCamera makeDefault fov={25} position={[0, 0, 30]} />
                
                {/* Add some lighting */}
                <ambientLight intensity={0.1} />
                <directionalLight color="white" position={[0, 0, 5]} />

                {/* Court */}
                <Court startAnimation={startAnimation} />

                {/* Custom camera setup */}
                <CameraSetup />
            </Canvas>
        </div>
    )
})

TurnPlay.displayName = 'TurnPlay'

export default TurnPlay