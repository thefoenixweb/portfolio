"use client";

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';
import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';

// Font files should be in public folder and referenced as absolute paths
const FontJSON = "/Roboto-msdf.json";
const FontImage = "/Roboto-msdf.png";

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