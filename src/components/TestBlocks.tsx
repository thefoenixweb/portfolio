"use client";

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';
import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';
import { useThree } from '@react-three/fiber';

// Font files should be in public folder and referenced as absolute paths
const FontJSON = "/Roboto-msdf.json";
const FontImage = "/Roboto-msdf.png";

// Test blocks for debugging
export const directTestBlock = (
  <Box args={[0.5, 0.5, 0.5]} position={[5, 5, 0]} material-color="green" />
);

export const testSceneBlock = (
  <Box args={[0.5, 0.5, 0.5]} position={[5, 4, 0]} material-color="yellow" />
);

export const testBlock1 = (
  <Box args={[0.5, 0.5, 0.5]} position={[5, 3, 0]} material-color="red" />
);

export const testBlock2 = (
  <Box args={[0.5, 0.5, 0.5]} position={[5, 2, 0]} material-color="blue" />
);

export const testTextBlock = (
  <Box args={[0.5, 0.5, 0.5]} position={[5, 1, 0]} material-color="yellow" />
);

export const testFloatingText = (
  <Box args={[0.5, 0.5, 0.5]} position={[5, 0, 0]} material-color="red" />
);

// Debug functions moved from PortfolioUI.tsx
export const useSceneDebugger = () => {
  const { scene } = useThree();

  // Test function to count models in scene
  useEffect(() => {
    const testScene = () => {
      console.log('=== SCENE TEST ===');
      console.log('Total objects in scene:', scene.children.length);
      
      // Count GLB models
      let glbCount = 0;
      let jsCount = 0;
      let tsCount = 0;
      
      scene.traverse((child) => {
        if (child.type === 'Group' && child.children.length > 0) {
          // Check if this looks like a GLB model
          const hasMeshes = child.children.some(grandChild => grandChild.type === 'Mesh');
          if (hasMeshes) {
            console.log(`Found GLB model: ${child.uuid} at position:`, child.position);
            console.log(`  Instance ID:`, child.userData?.instanceId || 'No ID');
            console.log(`  Children count:`, child.children.length);
            console.log(`  Parent:`, child.parent?.name || 'No parent');
            
            // Check if this is a JS model by looking for specific characteristics
            const hasJSLogo = child.children.some(grandChild => 
              grandChild.name && grandChild.name.includes('LOGO')
            );
            
            // Also check for JS model characteristics
            const hasJSBack = child.children.some(grandChild => 
              grandChild.name && grandChild.name.includes('back')
            );
            
            if (hasJSLogo || hasJSBack) {
              jsCount++;
              console.log(`  *** This is a JS model ***`);
              console.log(`  *** JS Model Details ***`);
              console.log(`    Position:`, child.position);
              console.log(`    Scale:`, child.scale);
              console.log(`    Rotation:`, child.rotation);
              console.log(`    Children names:`, child.children.map(c => c.name));
            } else {
              glbCount++;
            }
            
            // DEEPER SCAN: Check inside this group for JS models
            child.traverse((grandChild) => {
              if (grandChild.type === 'Group' && grandChild.children.length > 0) {
                const hasJSLogoDeep = grandChild.children.some(greatGrandChild => 
                  greatGrandChild.name && greatGrandChild.name.includes('LOGO')
                );
                const hasJSBackDeep = grandChild.children.some(greatGrandChild => 
                  greatGrandChild.name && greatGrandChild.name.includes('back')
                );
                
                if (hasJSLogoDeep || hasJSBackDeep) {
                  jsCount++;
                  console.log(`  *** Found JS model INSIDE another model ***`);
                  console.log(`    Nested JS Model UUID:`, grandChild.uuid);
                  console.log(`    Nested JS Model Position:`, grandChild.position);
                  console.log(`    Nested JS Model Parent:`, grandChild.parent?.name || 'No parent');
                  console.log(`    Nested JS Model Children:`, grandChild.children.map(c => c.name));
                }
              }
            });
          }
        }
      });
      
      console.log('GLB models found:', glbCount);
      console.log('JS models found:', jsCount);
      console.log('TS models found:', tsCount);
      console.log('=== END TEST ===');
    };
    
    // Run test after a delay to ensure models are loaded
    const timer = setTimeout(testScene, 2000);
    return () => clearTimeout(timer);
  }, [scene]);
};

// GLB Analysis Function
export const analyzeGLB = (scene: THREE.Group, modelName: string) => {
  console.log(`=== ${modelName} GLB ANALYSIS ===`);
  console.log('Scene children count:', scene.children.length);
  console.log('Scene name:', scene.name);
  console.log('Scene UUID:', scene.uuid);
  
  let meshCount = 0;
  let geometryCount = 0;
  let materialCount = 0;
  const geometries = new Set();
  const materials = new Set();
  
  scene.traverse((child) => {
    console.log(`Child: ${child.name} (${child.type}) - UUID: ${child.uuid}`);
    
    if (child.type === 'Mesh') {
      meshCount++;
      const mesh = child as THREE.Mesh;
      console.log(`  Mesh geometry: ${mesh.geometry.uuid}`);
      console.log(`  Mesh material: ${Array.isArray(mesh.material) ? mesh.material.length : 1} materials`);
      
      geometries.add(mesh.geometry.uuid);
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(mat => materials.add(mat.uuid));
      } else {
        materials.add(mesh.material.uuid);
      }
    }
  });
  
  console.log(`Mesh count: ${meshCount}`);
  console.log(`Unique geometries: ${geometries.size}`);
  console.log(`Unique materials: ${materials.size}`);
  console.log(`=== END ${modelName} ANALYSIS ===`);
};

// Debug box component for testing
export const DebugBox = () => {
  const { scene } = useThree();

  return (
    <Box 
      args={[0.5, 0.5, 0.5]} 
      position={[20, 20, 0]} 
      material-color="purple"
      onClick={() => {
        console.log('=== GHOST MODEL INVESTIGATION ===');
        
        // Inspect the entire scene
        console.log('Total scene children:', scene.children.length);
        
        scene.children.forEach((child, index) => {
          console.log(`Child ${index}:`, child.name, child.type, child.position);
          if (child.children.length > 0) {
            console.log(`  - Has ${child.children.length} children`);
          }
        });
      }}
    />
  );
};

// Clear scene debug box
export const ClearSceneBox = () => {
  const { scene } = useThree();

  return (
    <Box 
      args={[1, 1, 1]} 
      position={[10, 10, 0]} 
      material-color="yellow"
      onClick={() => {
        console.log('=== CLEARING SCENE ===');
        scene.traverse((child) => {
          if (child.type === 'Group' && child.children.length > 0) {
            const hasJSLogo = child.children.some(grandChild => 
              grandChild.name && grandChild.name.includes('LOGO')
            );
            if (hasJSLogo) {
              console.log('Removing JS model:', child.uuid);
              scene.remove(child);
            }
          }
        });
      }}
    />
  );
};

function TestBlocks() {
  const uiGroupRef = useRef<THREE.Group>(null);

  // After the UI is created, add it to the r3f scene's group
  useEffect(() => {
    console.log("TestBlocks useEffect running");
    if (uiGroupRef.current) {
      console.log("Adding test blocks to scene");
      uiGroupRef.current.clear();
      
      // Test: Add ThreeMeshUI content directly to the scene
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
      
      // Test: Add simple colored blocks to see if they render
      const testBlock1 = new ThreeMeshUI.Block({
        width: 1,
        height: 0.5,
        backgroundColor: new THREE.Color(0xff0000), // bright red
      });
      testBlock1.position.set(2, 0.5, 0.2); // position next to project1, in front
      uiGroupRef.current.add(testBlock1);
      console.log("testBlock1 added to scene");
      
      const testBlock2 = new ThreeMeshUI.Block({
        width: 1,
        height: 0.5,
        backgroundColor: new THREE.Color(0x0000ff), // bright blue
      });
      testBlock2.position.set(2, -0.5, 0.2); // position next to project2, in front
      uiGroupRef.current.add(testBlock2);
      console.log("testBlock2 added to scene");
      
      // Test: Add a simple text block
      const testTextBlock = new ThreeMeshUI.Block({
        width: 2,
        height: 0.5,
        backgroundColor: new THREE.Color(0xffff00), // bright yellow
      });
      testTextBlock.position.set(-2, 0, 0.2); // position to the left, in front
      testTextBlock.add(new ThreeMeshUI.Text({
        content: "TEST TEXT",
        fontSize: 0.1,
        fontFamily: FontJSON,
        fontTexture: FontImage,
        fontColor: new THREE.Color(0x000000),
      }));
      uiGroupRef.current.add(testTextBlock);
      console.log("testTextBlock added to scene");
      
      // Test: Add floating text block
      const testFloatingText = new ThreeMeshUI.Block({
        width: 3,
        height: 0.001, // Very thin background
        backgroundColor: new THREE.Color(0x000000),
        padding: 0,
        margin: [0, 0, 0, 0],
      });

      const floatingText = new ThreeMeshUI.Text({
        content: "TEST FLOATING TEXT",
        fontSize: 0.15,
        fontFamily: FontJSON,
        fontTexture: FontImage,
        fontColor: new THREE.Color(0xff0000), // Red for visibility
      });

      testFloatingText.add(floatingText);
      testFloatingText.position.set(0, 0, 0);
      uiGroupRef.current.add(testFloatingText);
      console.log("testFloatingText added to scene");
    } else {
      console.log("uiGroupRef not available");
    }
    // Cleanup function: remove all children from the group
    return () => {
      if (uiGroupRef.current) {
        uiGroupRef.current.clear();
      }
    };
  }, []);

  // Update three-mesh-ui on every frame
  useFrame(() => {
    ThreeMeshUI.update();
  });

  return (
    <>
      {/* This group holds your test blocks */}
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

export default TestBlocks; 