"use client"; 

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import ThreeMeshUI from 'three-mesh-ui';
import gsap from 'gsap';

import FinanceAppImage from '../assets/FinanceApp.png';
import FitTrackImage from '../assets/fittrack.png';

function PortfolioUI() {
  const uiGroupRef = useRef<THREE.Group>(null);
  const { camera, scene: _scene } = useThree();
  const scroll = useScroll();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouse = useMemo(() => new THREE.Vector2(), []);
  const clickableObjects = useRef<THREE.Object3D[]>([]);
  
  const clearClickableObjects = () => {
    clickableObjects.current = [];
  };

  const handleClick = (event: MouseEvent) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickableObjects.current, true);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      console.log('Click detected on object:', clickedObject.userData?.type);

      // 🚩 UPDATED createAndShowLink FUNCTION
      const createAndShowLink = (url: string, content: string) => {
        const linkElement = document.createElement('a');
        linkElement.href = url;
        linkElement.target = '_blank';
        linkElement.rel = 'noopener noreferrer';
        linkElement.textContent = `🚀 Click to Open ${content} 🚀`;
        linkElement.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000;
          padding: 20px 40px;
          background-color: #00ff00;
          color: black;
          border: 2px solid #000;
          border-radius: 15px;
          cursor: pointer;
          font-size: 18px;
          font-weight: bold;
          text-decoration: none;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
        `;
        document.body.appendChild(linkElement);
        
        // Add a global click handler to remove the element
        const handleGlobalClick = (e: MouseEvent) => {
          // If the click is not on the link element itself, remove it
          if (e.target !== linkElement) {
            if (document.body.contains(linkElement)) {
              document.body.removeChild(linkElement);
            }
            // Clean up the event listener
            document.removeEventListener('click', handleGlobalClick);
          }
        };
        
        // Add the event listener to the document
        document.addEventListener('click', handleGlobalClick);

        linkElement.onmouseenter = () => {
          linkElement.style.backgroundColor = '#ffff00';
          linkElement.style.transform = 'translate(-50%, -50%) scale(1.1)';
        };
        linkElement.onmouseleave = () => {
          linkElement.style.backgroundColor = '#00ff00';
          linkElement.style.transform = 'translate(-50%, -50%) scale(1)';
        };

        // Fallback timeout
        setTimeout(() => {
          if (document.body.contains(linkElement)) {
            document.body.removeChild(linkElement);
          }
          document.removeEventListener('click', handleGlobalClick);
        }, 10000);
      };

      const flashTitle = (container: ThreeMeshUI.Block, type: string) => {
        container.traverse((child) => {
          if (child.userData && child.userData.type === type) {
            child.traverse((grandChild) => {
              if (grandChild instanceof ThreeMeshUI.Text) {
                // @ts-ignore
                grandChild.set({ fontColor: new THREE.Color(0xffffff) });
              }
            });
          }
        });
        setTimeout(() => {
          container.traverse((child) => {
            if (child.userData && child.userData.type === type) {
              child.traverse((grandChild) => {
                if (grandChild instanceof ThreeMeshUI.Text) {
                  // @ts-ignore
                  grandChild.set({ fontColor: new THREE.Color(0x92e66c) });
                }
              });
            }
          });
        }, 200);
      };

      if (clickedObject.userData && clickedObject.userData.type === 'finance-app-title') {
        createAndShowLink('https://financeapp555.netlify.app/', 'Finance App');
        flashTitle(projectContainer, 'finance-app-title');
      } else if (clickedObject.userData && clickedObject.userData.type === 'fittrack-title') {
        createAndShowLink('https://fittrack555.netlify.app/', 'FitTrack');
        flashTitle(fitTrackContainer, 'fittrack-title');
      }
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [camera]);

  const handleMouseMove = (event: MouseEvent) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickableObjects.current, true);

    const hasHovered = intersects.length > 0;
    document.body.style.cursor = hasHovered ? 'pointer' : 'default';

    const hoveredObject = hasHovered ? intersects[0].object : null;

    projectContainer.traverse((child) => {
      if (child.userData && child.userData.type === 'finance-app-title') {
        child.traverse((grandChild) => {
          if (grandChild instanceof ThreeMeshUI.Text) {
            // @ts-ignore
            grandChild.set({ fontColor: new THREE.Color(0x92e66c) });
          }
        });
      }
    });
    fitTrackContainer.traverse((child) => {
      if (child.userData && child.userData.type === 'fittrack-title') {
        child.traverse((grandChild) => {
          if (grandChild instanceof ThreeMeshUI.Text) {
            // @ts-ignore
            grandChild.set({ fontColor: new THREE.Color(0xffffff) });
          }
        });
      }
    });

    if (hoveredObject) {
      const type = hoveredObject.userData?.type;
      if (type === 'finance-app-title' || type === 'fittrack-title') {
        const container = type === 'finance-app-title' ? projectContainer : fitTrackContainer;
        container.traverse((child) => {
          if (child.userData && child.userData.type === type) {
            child.traverse((grandChild) => {
              if (grandChild instanceof ThreeMeshUI.Text) {
                // @ts-ignore
                grandChild.set({ fontColor: new THREE.Color(0xffff00) });
              }
            });
          }
        });
      }
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [camera]);

  const FontJSON = "/Roboto-msdf.json";
  const FontImage = "/Roboto-msdf.png";

  const headerBlock = useMemo(() => {
    const block = new ThreeMeshUI.Block({
      width: 6,
      height: 0.6,
      padding: 0.05,
      backgroundOpacity: 0.3,
      contentDirection: "row",
      justifyContent: "start",
      alignItems: "center",
    });
    block.position.set(0, 1, 0);
    const nameText = new ThreeMeshUI.Text({
      content: "Tshepiso Molefi",
      fontSize: 0.2,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0xffffff),
    });
    block.add(nameText);
    return block;
  }, []);

  const descriptionBlock = useMemo(() => {
    const block = new ThreeMeshUI.Block({
      width: 4,
      height: 1,
      backgroundOpacity: 0,
      padding: 0.1,
      margin: [0, 0.1, 0, 0],
    });
    const descriptionText = new ThreeMeshUI.Text({
      content: "I am a web developer who enjoys creating fintech apps and 3d web apps. I know, C#, javascript and typescript. The libraries I use to build these apps are react, asp core and threejs.",
      fontSize: 0.1,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0xecf0f1),
    });
    block.add(descriptionText);
    block.position.set(-1, -1, 0);
    return block;
  }, []);

  const techStackTitle = useMemo(() => {
    const block = new ThreeMeshUI.Block({
      width: 3,
      height: 0.0001,
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
    block.position.set(0, -2.5, 0);
    return block;
  }, []);

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
    container.position.set(0, -4, 0.1);
    container.rotation.x = -0.55;

    const title = new ThreeMeshUI.Block({
      height: 0.2,
      width: 1.5,
      margin: 0.025,
      justifyContent: "center",
      fontSize: 0.09,
    });
    title.add(
      new ThreeMeshUI.Text({
        content: "Finance App",
        fontColor: new THREE.Color(0x92e66c),
      })
    );
    title.userData = { type: 'finance-app-title' };
    container.add(title);
    
    const contentContainer = new ThreeMeshUI.Block({
      width: 4,
      height: 1,
      contentDirection: "row",
      padding: 0.02,
      margin: 0.025,
      backgroundOpacity: 0,
    });
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
        content: "Financial Management App",
        fontSize: 0.04,
      })
    );
    leftSubBlock.add(caption);
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
      new ThreeMeshUI.Text({ content: "Built with " }),
      new ThreeMeshUI.Text({ content: ".NET 8 Web API", fontColor: new THREE.Color(0x92e66c) }),
      new ThreeMeshUI.Text({ content: " and React TypeScript frontend." })
    );
    const subSubBlock2 = new ThreeMeshUI.Block({
      height: 0.53,
      width: 0.7,
      margin: 0.01,
      padding: 0.02,
      fontSize: 0.04,
      alignItems: "start",
      textAlign: 'justify',
      backgroundOpacity: 0,
    }).add(
      new ThreeMeshUI.Text({
        content: "A comprehensive financial analysis and portfolio management application built with .NET 8 Web API and React TypeScript frontend. This application provides real-time stock data, financial statement analysis, portfolio tracking, and company profiling capabilities.",
      })
    );
    rightSubBlock.add(subSubBlock1, subSubBlock2);
    contentContainer.add(leftSubBlock, rightSubBlock);
    container.add(contentContainer);
    new THREE.TextureLoader().load(FinanceAppImage, (texture) => {
      // @ts-ignore
      leftSubBlock.set({ backgroundTexture: texture });
    });
    return container;
  }, []);

  const fitTrackContainer = useMemo(() => {
    const container = new ThreeMeshUI.Block({
      ref: "fittrack-container",
      width: 4,
      height: 1.5,
      padding: 0.025,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0xffffff),
      backgroundOpacity: 0,
    });
    container.position.set(0, -5.5, 0.1);
    container.rotation.x = -0.55;

    const title = new ThreeMeshUI.Block({
      height: 0.2,
      width: 1.5,
      margin: 0.025,
      justifyContent: "center",
      fontSize: 0.09,
    });
    title.add(
      new ThreeMeshUI.Text({
        content: "FitTrack",
      })
    );
    title.userData = { type: 'fittrack-title' };
    container.add(title);
    
    const contentContainer = new ThreeMeshUI.Block({
      width: 4,
      height: 1,
      contentDirection: "row",
      padding: 0.02,
      margin: 0.025,
      backgroundOpacity: 0,
    });
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
        content: "Fitness Tracking App",
        fontSize: 0.04,
      })
    );
    leftSubBlock.add(caption);
    const rightSubBlock = new ThreeMeshUI.Block({
      width: 2.5,
      height: 0.95,
      margin: 0.025,
    });
    const subSubBlock1 = new ThreeMeshUI.Block({
      height: 0.35,
      width: 0.7,
      margin: 0.025,
      padding: 0.02,
      fontSize: 0.04,
      justifyContent: "center",
      backgroundOpacity: 0,
    }).add(
      new ThreeMeshUI.Text({ content: "Built with " }),
      new ThreeMeshUI.Text({ content: "React, TypeScript", fontColor: new THREE.Color(0x92e66c) }),
      new ThreeMeshUI.Text({ content: " and Tailwind CSS." })
    );
    const subSubBlock2 = new ThreeMeshUI.Block({
      height: 0.53,
      width: 0.7,
      margin: 0.01,
      padding: 0.02,
      fontSize: 0.04,
      alignItems: "start",
      textAlign: 'justify',
      backgroundOpacity: 0,
    }).add(
      new ThreeMeshUI.Text({
        content: "FitTrack is a modern fitness tracking web application built with React, TypeScript, and Tailwind CSS. It's designed to help users manage their workout routines and track their fitness progress.",
      })
    );
    rightSubBlock.add(subSubBlock1, subSubBlock2);
    contentContainer.add(leftSubBlock, rightSubBlock);
    container.add(contentContainer);
    new THREE.TextureLoader().load(FitTrackImage, (texture) => {
      // @ts-ignore
      leftSubBlock.set({ backgroundTexture: texture });
    });
    return container;
  }, []);

  const contactBlock = useMemo(() => {
    const block = new ThreeMeshUI.Block({
      width: 6,
      height: 0.8,
      padding: 0.1,
      backgroundColor: new THREE.Color(0x2c3e50),
      contentDirection: "row",
      justifyContent: "start",
      alignItems: "center",
    });
    block.position.set(0, -7, 0);
    const emailText = new ThreeMeshUI.Text({
      content: "tshepiso.molefi@yahoo.com",
      fontSize: 0.08,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0xecf0f1),
    });
    emailText.position.set(-1.5, 0, 0);
    block.add(emailText);
    const githubText = new ThreeMeshUI.Text({
      content: "GitHub: @thefoenixweb",
      fontSize: 0.08,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0xecf0f1),
    });
    githubText.position.set(1.5, 0, 0);
    block.add(githubText);
    return block;
  }, []);

  const lighting = useMemo(() => {
    const lightsGroup = new THREE.Group();
    lightsGroup.add(new THREE.AmbientLight(0xffffff, 1.2));
    lightsGroup.add(new THREE.DirectionalLight(0xffffff, 1.5));
    lightsGroup.add(new THREE.DirectionalLight(0xffffff, 0.8));
    lightsGroup.add(new THREE.PointLight(0xffffff, 0.8));
    lightsGroup.add(new THREE.PointLight(0xffffff, 1, 0, 0));
    const spotLight = new THREE.SpotLight(0xffffff, 1.5, 0, Math.PI / 3, 0.3);
    lightsGroup.add(spotLight);
    
    lightsGroup.children[1].position.set(5, 5, 5);
    lightsGroup.children[2].position.set(-5, 5, 5);
    lightsGroup.children[3].position.set(10, 10, 10);
    lightsGroup.children[4].position.set(2, 0, 5);
    lightsGroup.children[5].position.set(0, 5, 8);

    return lightsGroup;
  }, []);

  useEffect(() => {
    if (!tl.current) {
      tl.current = gsap.timeline();
    }
    if (tl.current) {
      tl.current.to(camera.position, { duration: 7, y: -3, z: 6 }, 0);
    }
    if (uiGroupRef.current) {
      tl.current.to(uiGroupRef.current.position, { duration: 7, y: 6 }, 0);
    }
  }, []);

  useFrame(() => {
    if (tl.current) {
      tl.current.seek(scroll.offset * tl.current.duration());
    }
    ThreeMeshUI.update();
    
    if (createGridSystem && scroll) {
      createGridSystem.children.forEach((grid) => {
        if (grid instanceof THREE.GridHelper && grid.material) {
          const baseOpacity = 0.08;
          const pulseEffect = Math.sin(scroll.offset * Math.PI * 2) * 0.02;
          (grid.material as THREE.Material).opacity = Math.max(0.03, baseOpacity + pulseEffect);
        }
      });
    }
    if (createSectionGrid && scroll) {
      createSectionGrid.children.forEach((line, index) => {
        if (line instanceof THREE.Line && line.material) {
          const baseOpacity = 0.2;
          const pulseEffect = Math.sin(scroll.offset * Math.PI * 3 + index) * 0.05;
          (line.material as THREE.LineBasicMaterial).opacity = Math.max(0.1, baseOpacity + pulseEffect);
        }
      });
    }
    if (createVerticalGridLines && scroll) {
      createVerticalGridLines.children.forEach((line, index) => {
        if (line instanceof THREE.Line && line.material) {
          const baseOpacity = [0.2, 0.2, 0.15][index] || 0.15;
          const waveEffect = Math.sin(scroll.offset * Math.PI * 3 + index * Math.PI / 2) * 0.05;
          (line.material as THREE.LineBasicMaterial).opacity = Math.max(0.05, baseOpacity + waveEffect);
        }
      });
    }
    if (createCornerAccents && scroll) {
      createCornerAccents.children.forEach((line, index) => {
        if (line instanceof THREE.Line && line.material) {
          const baseOpacity = 0.6;
          const pulseEffect = Math.sin(scroll.offset * Math.PI * 5 + index * 0.5) * 0.2;
          (line.material as THREE.LineBasicMaterial).opacity = Math.max(0.2, baseOpacity + pulseEffect);
          const time = Date.now() * 0.001;
          const colorShift = Math.sin(time + index) * 0.3;
          (line.material as THREE.LineBasicMaterial).color.setHSL(0.5 + colorShift * 0.1, 1, 0.5);
        }
      });
    }
  });

  useEffect(() => {
    if (uiGroupRef.current) {
      uiGroupRef.current.clear();
      clearClickableObjects();

      uiGroupRef.current.add(headerBlock);
      uiGroupRef.current.add(descriptionBlock);
      uiGroupRef.current.add(techStackTitle);
      uiGroupRef.current.add(projectContainer);
      uiGroupRef.current.add(fitTrackContainer);
      uiGroupRef.current.add(contactBlock);
      uiGroupRef.current.add(lighting);
      
      const fitTrackClickMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 0.2),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
      );
      fitTrackClickMesh.position.set(0, -5, 0.2);
      fitTrackClickMesh.userData = { type: 'fittrack-title' };
      fitTrackClickMesh.visible = false;
      clickableObjects.current.push(fitTrackClickMesh);
      uiGroupRef.current.add(fitTrackClickMesh);

      const titleClickMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 0.2),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
      );
      titleClickMesh.position.set(0, -3.5, 0.1);
      titleClickMesh.userData = { type: 'finance-app-title' };
      titleClickMesh.visible = false;
      clickableObjects.current.push(titleClickMesh);
      uiGroupRef.current.add(titleClickMesh);

      const modelsGroup = new THREE.Group();
      modelsGroup.position.set(0, -3, 0);

      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('/draco/');

      const reactLoader = new GLTFLoader();
      reactLoader.setDRACOLoader(dracoLoader);
      reactLoader.load('/1661753280.glb', (gltf: any) => {
        const glbScene = gltf.scene.clone();
        glbScene.position.set(-1.5, 0, 0);
        glbScene.scale.set(0.7, 0.7, 0.7);
        modelsGroup.add(glbScene);
      });

      const jsLoader = new GLTFLoader();
      jsLoader.setDRACOLoader(dracoLoader);
      jsLoader.load('/JS.glb', (gltf: any) => {
        const jsScene = gltf.scene.clone();
        jsScene.position.set(-0.5, 0, 0);
        jsScene.scale.set(2, 2, 2);
        modelsGroup.add(jsScene);
      });

      const tsLoader = new GLTFLoader();
      tsLoader.setDRACOLoader(dracoLoader);
      tsLoader.load('/TS.glb', (gltf: any) => {
        const tsScene = gltf.scene.clone();
        tsScene.position.set(0.5, 0, 0);
        tsScene.scale.set(2, 2, 2);
        modelsGroup.add(tsScene);
      });

      const csLoader = new GLTFLoader();
      csLoader.setDRACOLoader(dracoLoader);
      csLoader.load('/CS.glb', (gltf: any) => {
        const csScene = gltf.scene.clone();
        csScene.position.set(1.5, 0, 0);
        csScene.scale.set(2, 2, 2);
        modelsGroup.add(csScene);
      });

      const avatarLoader = new GLTFLoader();
      avatarLoader.setDRACOLoader(dracoLoader);

      avatarLoader.load('/avatar.glb', (gltf: any) => {
        const avatarScene = gltf.scene.clone();
        avatarScene.position.set(2.1, 2.1, 0);
        avatarScene.scale.set(0.7, 0.7, 0.7);
        modelsGroup.add(avatarScene);
      });

      uiGroupRef.current.add(modelsGroup);
      uiGroupRef.current.add(createGridSystem);
      uiGroupRef.current.add(createSectionGrid);
      uiGroupRef.current.add(createVerticalGridLines);
      uiGroupRef.current.add(createCornerAccents);
    }
    return () => {
      if (uiGroupRef.current) {
        uiGroupRef.current.clear();
      }
    };
  }, [headerBlock, descriptionBlock, techStackTitle, projectContainer, fitTrackContainer, contactBlock, lighting]);

  const createGridSystem = useMemo(() => {
    const gridGroup = new THREE.Group();
    const gridConfigs = [
      { size: 25, divisions: 25, depth: -15, opacity: 0.25, color: 0xffffff },
      { size: 20, divisions: 20, depth: -10, opacity: 0.21, color: 0xcccccc },
      { size: 15, divisions: 15, depth: -5, opacity: 0.17, color: 0x999999 },
      { size: 10, divisions: 10, depth: 0, opacity: 0.13, color: 0x666666 },
      { size: 5, divisions: 5, depth: 5, opacity: 0.09, color: 0x333333 }
    ];
    gridConfigs.forEach((config) => {
      const backgroundGrid = new THREE.GridHelper(config.size, config.divisions, 0xffffff, 0xffffff);
      backgroundGrid.material.opacity = config.opacity;
      backgroundGrid.material.transparent = true;
      backgroundGrid.position.set(0, 0, config.depth);
      backgroundGrid.material.color.setHex(config.color);
      gridGroup.add(backgroundGrid);
    });
    return gridGroup;
  }, []);

  const createSectionGrid = useMemo(() => {
    const sectionGrids = new THREE.Group();
    const sectionDividers = [
      { y: 0.5, width: 8 },
      { y: -0.5, width: 8 },
      { y: -2, width: 8 },
      { y: -4, width: 8 },
    ];
    sectionDividers.forEach(({ y, width }) => {
      const divider = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-width / 2, y, 0.1),
          new THREE.Vector3(width / 2, y, 0.1)
        ]),
        new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.2, transparent: true })
      );
      sectionGrids.add(divider);
    });
    return sectionGrids;
  }, []);

  const createVerticalGridLines = useMemo(() => {
    const verticalLines = new THREE.Group();
    const leftLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-4, 2, 0),
        new THREE.Vector3(-4, -6, 0)
      ]),
      new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.2, transparent: true })
    );
    verticalLines.add(leftLine);
    const rightLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(4, 2, 0),
        new THREE.Vector3(4, -6, 0)
      ]),
      new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.2, transparent: true })
    );
    verticalLines.add(rightLine);
    const centerLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 2, 0),
        new THREE.Vector3(0, -6, 0)
      ]),
      new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.15, transparent: true })
    );
    verticalLines.add(centerLine);
    return verticalLines;
  }, []);

  const createCornerAccents = useMemo(() => {
    const cornerGroup = new THREE.Group();
    const cornerPositions = [
      [-3.5, 1.5, 0.2], [3.5, 1.5, 0.2],
      [-3.5, -5.5, 0.2], [3.5, -5.5, 0.2]
    ];
    cornerPositions.forEach(([x, y, z]) => {
      const horizontalLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x - 0.3, y, z),
          new THREE.Vector3(x + 0.3, y, z)
        ]),
        new THREE.LineBasicMaterial({ color: 0x00ffff, opacity: 0.6, transparent: true })
      );
      const verticalLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x, y - 0.3, z),
          new THREE.Vector3(x, y + 0.3, z)
        ]),
        new THREE.LineBasicMaterial({ color: 0x00ffff, opacity: 0.6, transparent: true })
      );
      cornerGroup.add(horizontalLine, verticalLine);
    });
    return cornerGroup;
  }, []);

  return <group ref={uiGroupRef} />;
}

export default PortfolioUI;