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

interface CourtProps {
    startAnimation: boolean;
}

const generateRandomPosition = (initialPosition: [number, number, number], direction: 'left' | 'right', isBall: boolean): [number, number, number] => {
    let [x, y, z] = initialPosition;

    // Randomly add or subtract 0.1 from x and y
    const deltaX = (Math.random() > 0.5 ? 0.1 : -0.1);
    const deltaY = (Math.random() > 0.5 ? 0.1 : -0.1);

    // Modify x and y
    y += deltaY;

    if (isBall) {
        // For a ball, x can be either positive or negative
        x += deltaX;
    } else {
        // If not a ball, adjust x based on the direction
        if (direction === 'left') {
            x -= Math.abs(deltaX); // Ensure x decreases
        } else if (direction === 'right') {
            x += Math.abs(deltaX); // Ensure x increases
        }
    }

    // z is always constant at 7
    z = 7;

    return [x, y, z];
  };

const generatePositionsForMinute = () => {
  const playerPositions: [number, number, number][][] = [];
  const ballPositions: [number, number, number][] = [];
  
  // Generate positions for each of the 3600 frames
  for (let i = 0; i < 3600; i++) {
    // Generate 6 player positions for each frame
    const framePlayerPositions: [number, number, number][] = [];
    for (let j = 0; j < 6; j++) {
        if (playerPositions[i]?.[j] === undefined) {
            framePlayerPositions.push(generateRandomPosition([]));
        }
    }
    playerPositions.push(framePlayerPositions);

    // Generate ball position for each frame
    ballPositions.push(generateRandomPosition([0, 0, 0], 'left', true));
  }

  return { playerPositions, ballPositions };
};  

const Court: React.FC<CourtProps> = ({ startAnimation }) => {
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const { playerPositions, ballPositions } = generatePositionsForMinute(); // Generate 1-minute positions

    // When the startAnimation prop changes, start or stop the animation
    useEffect(() => {
        if (startAnimation) {
        setIsAnimating(true);
        setCurrentFrame(0); // Reset to the beginning when the animation starts
        }
    }, [startAnimation]);

    // Use `useFrame` to animate each frame
    useFrame(() => {
        if (isAnimating && currentFrame < playerPositions.length) {
        setCurrentFrame((prev) => prev + 1); // Advance frame by frame
        } else if (currentFrame >= playerPositions.length) {
        setIsAnimating(false); // Stop animation when the sequence is complete
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
            <planeGeometry args={[16, 0.05]} /> {/* Middle line */}
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[-8, 0.02, 0]}>
            <planeGeometry args={[0.05, 8]} /> {/* Left boundary line */}
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[8, 0.02, 0]}>
            <planeGeometry args={[0.05, 8]} /> {/* Right boundary line */}
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

            {/* Players for Team 1 (Left Side) */}
            <Player position={playerPositions[currentFrame % playerPositions.length][0]} color="red" number={1} />
            <Player position={playerPositions[currentFrame % playerPositions.length][1]} color="red" number={2} />
            <Player position={playerPositions[currentFrame % playerPositions.length][2]} color="red" number={3} />
            <Player position={playerPositions[currentFrame % playerPositions.length][3]} color="red" number={4} />
            <Player position={playerPositions[currentFrame % playerPositions.length][4]} color="red" number={5} />
            <Player position={playerPositions[currentFrame % playerPositions.length][5]} color="red" number={6} />

            {/* Players for Team 2 (Right Side) */}
            <Player  position={playerPositions[currentFrame % playerPositions.length][6]} color="blue" number={1} />
            <Player  position={playerPositions[currentFrame % playerPositions.length][7]} color="blue" number={2} />
            <Player  position={playerPositions[currentFrame % playerPositions.length][8]} color="blue" number={3} />
            <Player  position={playerPositions[currentFrame % playerPositions.length][9]} color="blue" number={4} />
            <Player  position={playerPositions[currentFrame % playerPositions.length][10]} color="blue" number={5} />
            <Player  position={playerPositions[currentFrame % playerPositions.length][11]} color="blue" number={6} />

            <Ball position={ballPositions[currentFrame % ballPositions.length]} />
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