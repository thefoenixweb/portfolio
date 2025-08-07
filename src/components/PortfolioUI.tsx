"use client"; 

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Box, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';


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

  
  const FontJSON = "/Roboto-msdf.json";
  const FontImage = "/Roboto-msdf.png";
  
    // Create actual portfolio sections
  const headerBlock = useMemo(() => {
    const block = new ThreeMeshUI.Block({
      width: 6,
      height: 0.6,
      padding: 0.05,
      backgroundColor: new THREE.Color(0x2c3e50), // dark blue-gray
      contentDirection: "row",
      justifyContent: "start",
      alignItems: "center",
    });
    // Set position after creation
    block.position.set(0, 3.5, 0); // moved up to align with top of scene

    // Add name
    const nameText = new ThreeMeshUI.Text({
      content: "Tshepiso Molefi",
      fontSize: 0.12,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0xffffff),
    });
    block.add(nameText);

    // Add navigation items (simplified to avoid text rendering issues)
    const navText = new ThreeMeshUI.Text({
      content: "About | Projects | Skills | Contact",
      fontSize: 0.08,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0xecf0f1),
      margin: [0, 0.05, 0, 0],
    });
    block.add(navText);

    return block;
  }, [formData]);

  // const heroBlock = useMemo(() => {
  //   const block = new ThreeMeshUI.Block({
  //     width: 5,
  //     height: 1.2,
  //     padding: 0.1,
  //     backgroundColor: new THREE.Color(0x3498db), // blue
  //     contentDirection: "column",
  //     justifyContent: "center",
  //     alignItems: "center",
  //   });
  //   // Set position after creation
  //   block.position.set(0, 2.5, 0); // moved up to follow header

  //   const heroTitle = new ThreeMeshUI.Text({
  //     content: "Web Developer & Security Analyst",
  //     fontSize: 0.12,
  //     fontFamily: FontJSON,
  //     fontTexture: FontImage,
  //     fontColor: new THREE.Color(0xffffff),
  //   });
  //   block.add(heroTitle);

  //   return block;
  // }, [formData]);

  // const aboutBlock = useMemo(() => {
  //   const block = new ThreeMeshUI.Block({
  //     width: 4.5,
  //     height: 1.0,
  //     padding: 0.08,
  //     backgroundColor: new THREE.Color(0xe74c3c), // red
  //     contentDirection: "column",
  //     justifyContent: "center",
  //     alignItems: "center",
  //   });
  //   // Set position after creation
  //   block.position.set(0, 1.5, 0); // moved up to follow hero

  //   const aboutTitle = new ThreeMeshUI.Text({
  //     content: "About Me",
  //     fontSize: 0.12,
  //     fontFamily: FontJSON,
  //     fontTexture: FontImage,
  //     fontColor: new THREE.Color(0xffffff),
  //   });
  //   block.add(aboutTitle);

  //   return block;
  // }, [formData]);

  // Create individual project blocks (flattened approach)
  const project1ImageBlock = useMemo(() => {
    // Create the image mesh directly without a background block
    const texture = new THREE.TextureLoader().load(Project1Image);
    const geometry = new THREE.PlaneGeometry(1.5, 0.8);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const projectImage = new THREE.Mesh(geometry, material);
    projectImage.position.set(-1.5, 0.5, 0.1); // left side of project area
    
    return projectImage;
  }, [formData]);

  const project1DescBlock = useMemo(() => {
    const block = new ThreeMeshUI.Block({
      width: 2.5,
      height: 0.8,
      backgroundColor: new THREE.Color(0x2ecc71), // lighter green
    });
    // Set position after creation
    block.position.set(1.0, 0.5, 0.1); // right side of project area

    const projectTitle = new ThreeMeshUI.Text({
      content: "Portfolio Website",
      fontSize: 0.1,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0xffffff),
    });
    block.add(projectTitle);

    const projectDesc = new ThreeMeshUI.Text({
      content: "3D Interactive Portfolio built with React Three Fiber and ThreeMeshUI",
      fontSize: 0.07,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0xecf0f1),
    });
    block.add(projectDesc);

    return block;
  }, [formData]);

  const project2ImageBlock = useMemo(() => {
    // Create the image mesh directly without a background block
    const texture = new THREE.TextureLoader().load(Project2Image);
    const geometry = new THREE.PlaneGeometry(1.5, 0.8);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const projectImage = new THREE.Mesh(geometry, material);
    projectImage.position.set(-1.5, -0.5, 0.1); // left side of project area
    
    return projectImage;
  }, [formData]);

  const project2DescBlock = useMemo(() => {
    const block = new ThreeMeshUI.Block({
      width: 2.5,
      height: 0.8,
      backgroundColor: new THREE.Color(0x2ecc71), // lighter green
    });
    // Set position after creation
    block.position.set(1.0, -0.5, 0.1); // right side of project area

    const projectTitle = new ThreeMeshUI.Text({
      content: "Web Application",
      fontSize: 0.1,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0xffffff),
    });
    block.add(projectTitle);

    const projectDesc = new ThreeMeshUI.Text({
      content: "Full-stack web application with modern UI/UX design",
      fontSize: 0.07,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0xecf0f1),
    });
    block.add(projectDesc);

    return block;
  }, [formData]);

  const contactBlock = useMemo(() => {
    const block = new ThreeMeshUI.Block({
      width: 6,
      height: 0.8,
      padding: 0.1,
      backgroundColor: new THREE.Color(0x2c3e50), // dark blue-gray to match header
      contentDirection: "row",
      justifyContent: "start",
      alignItems: "center",
    });
    // Set position after creation
    block.position.set(0, -2.5, 0); // positioned at bottom as footer

    // Email section
    const emailText = new ThreeMeshUI.Text({
      content: "tshepiso.molefi@yahoo.com",
      fontSize: 0.08,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0xecf0f1),
    });
    // Position email text to the left within footer bounds
    emailText.position.set(-1.5, 0, 0);
    block.add(emailText);

    // GitHub section
    const githubText = new ThreeMeshUI.Text({
      content: "GitHub: @thefoenixweb",
      fontSize: 0.08,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0xecf0f1),
    });
    // Position GitHub text to the right within footer bounds
    githubText.position.set(1.5, 0, 0);
    block.add(githubText);

    return block;
  }, [formData]);

  // Description block
  const descriptionBlock = useMemo(() => {
    const block = new ThreeMeshUI.Block({
      width: 4,
      height: 1,
      backgroundColor: new THREE.Color(0x34495e),
      padding: 0.1,
      margin: [0, 0.1, 0, 0],
    });

    const descriptionText = new ThreeMeshUI.Text({
      content: "I am a web developer who enjoys creating fintech apps and 3d web apps. I know, C#, javascript and typescript. The libraries I use to build these apps are react, asp core and threejs.",
      fontSize: 0.06,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0xecf0f1),
    });
    block.add(descriptionText);

    // Set position after creation
    block.position.set(-0.8, 2.5, 0);

    return block;
  }, []);

  // Helper function to create circular blocks
  const createCircularBlock = (size: number, backgroundColor: THREE.Color) => {
    return new ThreeMeshUI.Block({
      width: size,
      height: size,
      backgroundColor,
      borderRadius: size / 2, // Automatically makes it circular
      padding: 0.05,
      margin: [0, 0.1, 0, 0],
    });
  };

  // Avatar placeholder block
  const avatarBlock = useMemo(() => {
    const block = createCircularBlock(1.2, new THREE.Color(0x95a5a6));

    const avatarText = new ThreeMeshUI.Text({
      content: "TM",
      fontSize: 0.3,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0x2c3e50),
    });
    block.add(avatarText);

    // Set position after creation - to the right of description block
    block.position.set(2.1, 2.5, 0);

    return block;
  }, []);

  // Tech stack title text (floating)
  const techStackTitle = useMemo(() => {
    const block = new ThreeMeshUI.Block({
      width: 3,
      height: 0.0001, // Very thin background
      backgroundColor: new THREE.Color(0x000000),
      padding: 0,
      margin: [0, 0, 0, 0],
    });

    const text = new ThreeMeshUI.Text({
      content: "MY TECH STACK",
      fontSize: 0.12,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0xecf0f1),
    });

    block.add(text);
    block.position.set(0, 1.8, 0);

    return block;
  }, []);



  // After the UI is created, add it to the r3f scene's group
  useEffect(() => {
    console.log("useEffect running, adding blocks to scene");
    if (uiGroupRef.current) {
      console.log("Adding blocks to scene");
      uiGroupRef.current.clear();
      
      // Add each portfolio section directly to the scene
      uiGroupRef.current.add(headerBlock);
      uiGroupRef.current.add(descriptionBlock);
      uiGroupRef.current.add(avatarBlock);
      uiGroupRef.current.add(techStackTitle);
      // uiGroupRef.current.add(heroBlock);
      // uiGroupRef.current.add(aboutBlock);
      uiGroupRef.current.add(project1ImageBlock);
      uiGroupRef.current.add(project1DescBlock);
      uiGroupRef.current.add(project2ImageBlock);
      uiGroupRef.current.add(project2DescBlock);
      uiGroupRef.current.add(contactBlock);
      
      console.log("Portfolio sections added to scene, uiGroupRef children:", uiGroupRef.current.children);
    } else {
      console.log("uiGroupRef not available");
    }
    // Cleanup function: remove all children from the group
    return () => {
      if (uiGroupRef.current) {
        uiGroupRef.current.clear();
      }
    };
  }, [headerBlock, descriptionBlock, avatarBlock, techStackTitle, project1ImageBlock, project1DescBlock, project2ImageBlock, project2DescBlock, contactBlock]);

  // Update three-mesh-ui on every frame
  useFrame(() => {
    ThreeMeshUI.update();
  });



  // Grid configuration
  const gridConfig = {
    spacing: 1, // Space between models
    scale: [2,2,2], // Uniform scale for all models (reduced for better alignment)
    startPosition: [-1.5, 3, 3], // Starting position for the grid
  };



  // GLB Model Component
  function GLBModel() {
    const { scene } = useGLTF('/1661753280.glb');
    
    const memoizedScene = useMemo(() => {
      return scene.clone();
    }, [scene]);
    
    const position = [gridConfig.startPosition[0] + (gridConfig.spacing * 0), gridConfig.startPosition[1], gridConfig.startPosition[2]];
    const glbScale = [0.7,0.7,0.7]; // Smaller scale for GLB model to match others
    
    return (
      <primitive 
        object={memoizedScene} 
        position={position} 
        scale={glbScale} 
        rotation={[0, 0, 0]} 
      />
    );
  }

  // JavaScript GLB Model Component
  function JSModel() {
    const { scene } = useGLTF('/JS.glb');
    
    const memoizedScene = useMemo(() => {
      return scene.clone();
    }, [scene]);
    
    const position = [gridConfig.startPosition[0] + (gridConfig.spacing * 1), gridConfig.startPosition[1], gridConfig.startPosition[2]];
    
    return (
      <primitive 
        object={memoizedScene} 
        position={position} 
        scale={gridConfig.scale} 
        rotation={[0, 0, 0]} 
      />
    );
  }

  // TypeScript GLB Model Component
  function TSModel() {
    const { scene } = useGLTF('/TS.glb');
    
    const memoizedScene = useMemo(() => {
      // Clone the scene to prevent multiple references
      const clonedScene = scene.clone();
      
      // Filter out duplicate scenes - Keep only Scene_1
      const filteredChildren = clonedScene.children.filter(child => {
        return child.name === 'Scene_1' || 
               child.name === 'Lighting' || 
               child.name === 'Cameras';
      });
      
      // Replace children with filtered version
      clonedScene.children.length = 0;
      filteredChildren.forEach(child => {
        clonedScene.add(child);
      });
      
      return clonedScene;
    }, [scene]);
    
    const position = [gridConfig.startPosition[0] + (gridConfig.spacing * 2), gridConfig.startPosition[1], gridConfig.startPosition[2]];
    
    return (
      <primitive 
        object={memoizedScene} 
        position={position} 
        scale={gridConfig.scale} 
        rotation={[0, 0, 0]} 
      />
    );
  }

  // C# GLB Model Component
  function CSModel() {
    const { scene } = useGLTF('/CS.glb');
    
    const memoizedScene = useMemo(() => {
      return scene.clone();
    }, [scene]);
    
    const position = [gridConfig.startPosition[0] + (gridConfig.spacing * 3), gridConfig.startPosition[1], gridConfig.startPosition[2]];
    
    return (
      <primitive 
        object={memoizedScene} 
        position={position} 
        scale={gridConfig.scale} 
        rotation={[0, 0, 0]} 
      />
    );
  }

  return (
    <>
      {/* This group holds your entire three-mesh-ui structure */}
      <group ref={uiGroupRef} position={[0, 1.5, 3]} rotation={[0, 0, 0]}>
        {/* The actual ThreeMeshUI objects are added to uiGroupRef.current programmatically */}
      </group>

            {/* GLB Models */}
      <GLBModel key="glb-model-1" />
      <JSModel key="js-model-2" />
      <TSModel key="ts-model-3" />
      <CSModel key="cs-model-4" />

      {/* Enhanced lighting for GLB models */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />

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