"use client"; 

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Box, useGLTF, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import ThreeMeshUI from 'three-mesh-ui';
import gsap from 'gsap';

import Project1Image from '../assets/project1.png';
import Project2Image from '../assets/project2.png';
// HTML overlay removed - keeping only 3D scene content

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
  const { scene, camera } = useThree();
  const scroll = useScroll();
  const tl = useRef<gsap.core.Timeline | null>(null);

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
    block.position.set(0, 1, 0); // Header moved down one more unit

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
  }, []); // Remove formData dependency since it's not used in the header

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
    block.position.set(0, 0, 0); // Description block moved down one more unit

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
    block.position.set(2.1, 0, 0); // Avatar aligned with description block

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
    block.position.set(0, -1.5, 0); // Tech stack title moved down one more unit

    return block;
  }, []);

  // Create nested project container (similar to the example code structure)
  const projectContainer = useMemo(() => {
    const container = new ThreeMeshUI.Block({
      ref: "project-container",
      width: 4,
      height: 1.5,
      padding: 0.025,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0xffffff),
      backgroundOpacity: 0,
    });

    container.position.set(0, -3, 0.1); // Project container moved down one more unit
    container.rotation.x = -0.55; // Add tilt for 3D feel like the viper example

    // Project title block
    const title = new ThreeMeshUI.Block({
      height: 0.2,
      width: 1.5,
      margin: 0.025,
      justifyContent: "center",
      fontSize: 0.09,
    });

    title.add(
      new ThreeMeshUI.Text({
        content: "Portfolio Website",
      })
    );

    container.add(title);

    // Left sub-block for project image
    const leftSubBlock = new ThreeMeshUI.Block({
      height: 0.95,
      width: 1.0,
      margin: 0.025,
      padding: 0.025,
      textAlign: "left",
      justifyContent: "end",
    });

    const caption = new ThreeMeshUI.Block({
      height: 0.07,
      width: 0.37,
      textAlign: "center",
      justifyContent: "center",
    });

    caption.add(
      new ThreeMeshUI.Text({
        content: "3D Interactive Portfolio",
        fontSize: 0.04,
      })
    );

    leftSubBlock.add(caption);

    // Right sub-block for project description
    const rightSubBlock = new ThreeMeshUI.Block({
      width: 2.5,
      height: 0.95,
      margin: 0.025,
    });

    const subSubBlock1 = new ThreeMeshUI.Block({
      height: 0.35,
      width: 0.5,
      margin: 0.025,
      padding: 0.02,
      fontSize: 0.04,
      justifyContent: "center",
      backgroundOpacity: 0,
    }).add(
      new ThreeMeshUI.Text({
        content: "Built  React Three Fiber and ",
      }),

      new ThreeMeshUI.Text({
        content: "ThreeMeshUI",
        fontColor: new THREE.Color(0x92e66c),
      }),

      new ThreeMeshUI.Text({
        content: " for immersive 3D experience.",
      })
    );

    const subSubBlock2 = new ThreeMeshUI.Block({
      height: 0.53,
      width: 0.5,
      margin: 0.01,
      padding: 0.02,
      fontSize: 0.025,
      alignItems: "start",
      textAlign: 'justify',
      backgroundOpacity: 0,
    }).add(
      new ThreeMeshUI.Text({
        content:
          "This portfolio showcases my skills in modern web development, 3D graphics, and interactive design. Features include dynamic UI elements, 3D models, and responsive design principles. The project demonstrates proficiency in React, Three.js, and TypeScript.",
      })
    );

    rightSubBlock.add(subSubBlock1, subSubBlock2);

    // Content container to hold left and right sub-blocks
    const contentContainer = new ThreeMeshUI.Block({
      width: 4,
      height: 1,
      contentDirection: "row",
      padding: 0.02,
      margin: 0.025,
      backgroundOpacity: 0,
    });

    contentContainer.add(leftSubBlock, rightSubBlock);
    container.add(contentContainer);

    // Load project image texture
    new THREE.TextureLoader().load(Project1Image, (texture) => {
      // @ts-ignore - ThreeMeshUI set method
      leftSubBlock.set({
        backgroundTexture: texture,
      });
    });

    return container;
  }, []); // Remove formData dependency since it's not used in the container

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
    block.position.set(0, -4.5, 0); // Contact block moved down one more unit

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
  }, []); // Remove formData dependency since it's not used in the contact block

  // Grid configuration - positioned under tech stack title
  const gridConfig = {
    spacing: 1, // Space between models
    scale: [2,2,2], // Uniform scale for all models (reduced for better alignment)
    startPosition: [-1.5,-0.4,3], // Positioned under the tech stack title
  };

  // Scroll-based animations
  useEffect(() => {
    if (!tl.current) {
      tl.current = gsap.timeline();
    }

    // Camera movement based on scroll - CORRECT direction
    if (tl.current) {
      tl.current.to(
        camera.position,
        {
          duration: 2,
          y: -3, // Move camera down as we scroll down (natural)
          z: 6, // Move camera closer as we scroll down
        },
        0
      );
    }

    // UI group movement - CORRECT direction
    if (uiGroupRef.current) {
      tl.current.to(
        uiGroupRef.current.position,
        {
          duration: 2,
          y: 6, // Move UI up as we scroll down (natural)
        },
        0
      );
    }

    // Tech stack models animation - REMOVED to keep models in fixed position
    // if (tl.current) {
    //   tl.current.to(
    //     gridConfig,
    //     {
    //       duration: 1,
    //       startPosition: [-1.5, -2, 3], // Move models down
    //     },
    //     0.5
    //   );
    // }

  }, []);

  // Apply scroll-based animations
  useFrame(() => {
    if (tl.current) {
      tl.current.seek(scroll.offset * tl.current.duration());
    }
  });

  // After the UI is created, add it to the r3f scene's group
  useEffect(() => {
    console.log("useEffect running, adding blocks to scene");
    if (uiGroupRef.current) {
      console.log("Adding blocks to scene");
      // Clear any existing blocks to prevent duplicates
      uiGroupRef.current.clear();
      
      // Add each portfolio section directly to the scene
      uiGroupRef.current.add(headerBlock);
      uiGroupRef.current.add(descriptionBlock);
      uiGroupRef.current.add(avatarBlock);
      uiGroupRef.current.add(techStackTitle);
      // uiGroupRef.current.add(heroBlock);
      // uiGroupRef.current.add(aboutBlock);
      uiGroupRef.current.add(projectContainer);
      // uiGroupRef.current.add(project1ImageBlock);
      // uiGroupRef.current.add(project1DescBlock);
      // uiGroupRef.current.add(project2ImageBlock);
      // uiGroupRef.current.add(project2DescBlock);
      uiGroupRef.current.add(contactBlock);
      
      // Add 3D models to the scene programmatically (not as JSX)
      console.log("Attempting to add 3D models to scene...");
      const modelsGroup = new THREE.Group();
      modelsGroup.position.set(0, -2, 0);
      console.log("Created models group at position:", modelsGroup.position);
      
      try {
        // Create and add GLB models to the group
        console.log("Loading GLB models...");
        
        // Load GLB models using GLTFLoader
        const loader = new GLTFLoader();
        
        // Load React model (1661753280.glb)
        loader.load('/1661753280.glb', (gltf: any) => {
          const glbScene = gltf.scene.clone();
          glbScene.position.set(-1.5, 0, 0);
          glbScene.scale.set(0.7, 0.7, 0.7);
          modelsGroup.add(glbScene);
          console.log("Added React model at position:", glbScene.position);
        });
        
        // Load JavaScript model
        loader.load('/JS.glb', (gltf: any) => {
          const jsScene = gltf.scene.clone();
          jsScene.position.set(-0.5, 0, 0);
          jsScene.scale.set(2, 2, 2);
          modelsGroup.add(jsScene);
          console.log("Added JS model at position:", jsScene.position);
        });
        
        // Load TypeScript model
        loader.load('/TS.glb', (gltf: any) => {
          const tsScene = gltf.scene.clone();
          tsScene.position.set(0.5, 0, 0);
          tsScene.scale.set(2, 2, 2);
          modelsGroup.add(tsScene);
          console.log("Added TS model at position:", tsScene.position);
        });
        
        // Load C# model
        loader.load('/CS.glb', (gltf: any) => {
          const csScene = gltf.scene.clone();
          csScene.position.set(1.5, 0, 0);
          csScene.scale.set(2, 2, 2);
          modelsGroup.add(csScene);
          console.log("Added CS model at position:", csScene.position);
        });
        
        uiGroupRef.current.add(modelsGroup);
        console.log("Successfully added models group to uiGroupRef");
        console.log("uiGroupRef children count:", uiGroupRef.current.children.length);
        
      } catch (error) {
        console.error("Error adding 3D models:", error);
      }
      
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
  }, [headerBlock, descriptionBlock, avatarBlock, techStackTitle, projectContainer, contactBlock]);

  // Update three-mesh-ui on every frame
  useFrame(() => {
    ThreeMeshUI.update();
  });

  // GLB Model Component
  function GLBModel() {
    const { scene } = useGLTF('/1661753280.glb');
    
    const memoizedScene = useMemo(() => {
      return scene.clone();
    }, [scene]);
    
    const position = [-1.5, 0, 0]; // Position relative to group
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
    
    const position = [-0.5, 0, 0]; // Position relative to group
    
    return (
      <primitive 
        object={memoizedScene} 
        position={position} 
        scale={[2,2,2]} 
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
    
    const position = [0.5, 0, 0]; // Position relative to group
    
    return (
      <primitive 
        object={memoizedScene} 
        position={position} 
        scale={[2,2,2]} 
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
    
    const position = [1.5, 0, 0]; // Position relative to group
    
    return (
      <primitive 
        object={memoizedScene} 
        position={position} 
        scale={[2,2,2]} 
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

      {/* 3D Models are now added programmatically to uiGroupRef */}

      {/* Enhanced lighting for GLB models */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />

      {/* OrbitControls handled in App.tsx */}
    </>
  );
}

export default PortfolioUI;