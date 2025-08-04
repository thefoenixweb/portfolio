"use client"; // If using Next.js App Router

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';
import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';

// Import your assets
// Ensure these paths are correct relative to your public folder or build system
import Project1Image from '../assets/project1.png';
import Project2Image from '../assets/project2.png';

// Define types for your form data
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Define types for the props of PortfolioUI (if it were to accept any)
interface PortfolioUIProps {
  // No specific props needed for this example, but you could add them here
}

function PortfolioUI(props: PortfolioUIProps) {
  // Specify the type for useRef: THREE.Group is a common parent for objects in Three.js
  const uiGroupRef = useRef<THREE.Group>(null);
  const { scene } = useThree();

  // State for form data (for demonstration, actual input requires more)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Helper to handle interactive states for buttons/links
  // Explicitly type the parameters
  const setupInteractiveBlock = (
    block: any, // three-mesh-ui Block type (use 'any' to avoid type error, or extend types if available)
    idleColor: THREE.Color,
    hoverColor: THREE.Color,
    activeColor: THREE.Color,
    onClickAction: () => void // A function that returns nothing
  ): void => {
    block.states = [
      {
        state: "idle",
        attributes: {
          backgroundColor: idleColor,
        },
      },
      {
        state: "hovered",
        attributes: {
          backgroundColor: hoverColor,
        },
      },
      {
        state: "selected",
        attributes: {
          backgroundColor: activeColor,
        },
        onSet: onClickAction,
      },
    ];
    block.setState("idle");
  };

  // Font files should be in public folder and referenced as absolute paths
  const FontJSON = "/Roboto-msdf.json";
  const FontImage = "/Roboto-msdf.png";
  
    // Create UI sections as separate blocks (not nested)
  const headerBlock = useMemo(() => {
    const block = new ThreeMeshUI.Block({
      width: 5,
      height: 0.5,
      padding: 0.05,
      backgroundColor: new THREE.Color(0xff0000), // bright red
      contentDirection: "row",
      justifyContent: "start",
      alignItems: "center",
    });
    // Set position after creation
    block.position.set(0, 2, 0);

    // Add name
    const nameText = new ThreeMeshUI.Text({
      content: "Tshepiso Molefi",
      fontSize: 0.15,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0xffffff),
    });
    block.add(nameText);

    // Add navigation items
    const navItems: string[] = ["About", "Projects", "Contact"];
    navItems.forEach((item: string) => {
      const navText = new ThreeMeshUI.Text({
        content: item,
        fontSize: 0.1,
        fontFamily: FontJSON,
        fontTexture: FontImage,
        fontColor: new THREE.Color(0xffffff),
        margin: [0, 0.05, 0, 0],
      });
      block.add(navText);
    });

    return block;
  }, [formData]);

  const heroBlock = useMemo(() => {
    const block = new ThreeMeshUI.Block({
      width: 4,
      height: 0.8,
      padding: 0.1,
      backgroundColor: new THREE.Color(0x00ff00), // bright green
      contentDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    });
    // Set position after creation
    block.position.set(0, 1, 0);

    const heroTitle = new ThreeMeshUI.Text({
      content: "Web Developer, Security Analyst, Tech Support",
      fontSize: 0.15,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0x000000),
    });
    block.add(heroTitle);

    const heroSubtitle = new ThreeMeshUI.Text({
      content: "Crafting secure and robust web solutions.",
      fontSize: 0.1,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0x000000),
    });
    block.add(heroSubtitle);

    return block;
  }, [formData]);

  const testBlock = useMemo(() => {
    const block = new ThreeMeshUI.Block({
      width: 1,
      height: 0.3,
      backgroundColor: new THREE.Color(0x0000ff), // bright blue
    });
    // Set position after creation
    block.position.set(0, 0, 0);
    return block;
  }, [formData]);

  // After the UI is created, add it to the r3f scene's group
  useEffect(() => {
    console.log("useEffect running, adding blocks to scene");
    if (uiGroupRef.current) {
      console.log("Adding blocks to scene");
      uiGroupRef.current.clear();
      
      // Add each block directly to the scene
      uiGroupRef.current.add(headerBlock);
      uiGroupRef.current.add(heroBlock);
      uiGroupRef.current.add(testBlock);
      
      console.log("Blocks added to scene, uiGroupRef children:", uiGroupRef.current.children);

      // Test: Add ThreeMeshUI content directly to the scene (not inside mainContainer)
      const directTestBlock = new ThreeMeshUI.Block({ 
      width: 1,
        height: 0.5, 
        backgroundColor: new THREE.Color(0x00ff00) // bright green
      });
      directTestBlock.position.set(2, 0, 0); // position it to the right
      directTestBlock.add(new ThreeMeshUI.Text({
        content: "DIRECT TEST",
        fontSize: 0.2,
        fontFamily: FontJSON,
        fontTexture: FontImage,
        fontColor: new THREE.Color(0x000000), // black text
      }));
      uiGroupRef.current.add(directTestBlock);
      console.log("directTestBlock added to scene");

      // Test: Add a simple visible block to verify the scene is working
      const testSceneBlock = new ThreeMeshUI.Block({ 
      width: 1,
        height: 0.5, 
        backgroundColor: new THREE.Color(0xffff00) // bright yellow
      });
      testSceneBlock.position.set(-2, 0, 0); // position it to the left
      uiGroupRef.current.add(testSceneBlock);
      console.log("testSceneBlock added to scene, total children:", uiGroupRef.current.children.length);
    } else {
      console.log("uiGroupRef not available");
    }
    // Cleanup function: remove all children from the group
    return () => {
      if (uiGroupRef.current) {
        uiGroupRef.current.clear();
      }
    };
  }, [headerBlock, heroBlock, testBlock]);

  // Update three-mesh-ui on every frame
  useFrame(() => {
    ThreeMeshUI.update();
  });

  return (
    <>
      {/* This group holds your entire three-mesh-ui structure */}
      <group ref={uiGroupRef} position={[0, 1.5, 3]} rotation={[0, 0, 0]}>
        {/* The actual ThreeMeshUI objects are added to uiGroupRef.current programmatically */}
      </group>

      {/* Basic scene setup for demonstration */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {/* A simple room for context */}
      <Box args={[6, 6, 6]} position={[0, 3, 0]} material-wireframe material-color="gray" />

      {/* OrbitControls to navigate the scene */}
      <OrbitControls makeDefault />
    </>
  );
}

// Main App component to render the Canvas
// export default function AppCanvas() {
//     return (
//         <div style={{ width: '100vw', height: '100vh', background: '#505050' }}> {/* Add background for clarity */}
//             <Canvas camera={{ position: [0, 1.6, 0], fov: 60 }}>
//                 {/* No need for color attach="background" if you set it on the div */}
//                 <PortfolioUI />
//             </Canvas>
//         </div>
//     );
// }

export default PortfolioUI;