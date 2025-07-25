"use client"; // If using Next.js App Router

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';
import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';

// Import your assets
// Ensure these paths are correct relative to your public folder or build system
import FontJSON from '../assets/Roboto-msdf.json';
import FontImage from '../assets/Roboto-msdf.png';
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

  // Memoize the creation of the entire UI structure
  const uiContainer = useMemo<ThreeMeshUI.Block>(() => { // Specify return type
    // --- Main Container for the Entire Portfolio UI ---
    const mainContainer = new ThreeMeshUI.Block({
      height: 4.0,
      width: 6.0,
      padding: 0.1,
      backgroundOpacity: 0.8,
      backgroundColor: new THREE.Color(0xf4f4f4),
      contentDirection: "column",
      justifyContent: "start",
      alignItems: "center"
    });

    // --- Header Section ---
    const headerBlock = new ThreeMeshUI.Block({
      width: 5,
      height: 0.5,
      padding: 0.05,
      backgroundColor: new THREE.Color(0xf4f4f4),
      contentDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    });
    mainContainer.add(headerBlock);

    const nameBlock = new ThreeMeshUI.Text({
      content: "Tshepiso Molefi",
      fontSize: 5,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0xffffff),
    });
    headerBlock.add(nameBlock);

    const navBlock = new ThreeMeshUI.Block({
      contentDirection: "row",
      justifyContent: "end",
      alignItems: "center",
      backgroundOpacity: 0,
      width: 0.6,
      height: 1,
    });
    headerBlock.add(navBlock);

    const navItems: string[] = ["About", "Projects", "Skills", "GitHub", "Resume", "Contact"];
    navItems.forEach((item: string) => {
      const navLink = new ThreeMeshUI.Block({
        margin: 0.03,
        padding: 0.015,
        backgroundOpacity: 0,
        isInteractable: true,
        width: 0.4,
        height:0.4,
      });
      navLink.add(
        new ThreeMeshUI.Text({
          content: item,
          fontSize: 0.08,
          fontFamily: FontJSON,
          fontTexture: FontImage,
          fontColor: new THREE.Color(0xffffff),
        })
      );
      let onClickAction: () => void;
      if (item === "GitHub") {
        onClickAction = () => window.open("https://github.com/thefoenixweb", "_blank");
      } else if (item === "Resume") {
        onClickAction = () => alert("Resume link coming soon!");
      } else {
        onClickAction = () => console.log(`Navigating to ${item} section`);
      }
      setupInteractiveBlock(navLink,
        new THREE.Color(0x000000), // Idle (transparent background for text)
        new THREE.Color(0x66ccff), // Hover (blue-400)
        new THREE.Color(0x4499dd), // Active (darker blue)
        onClickAction
      );
      navBlock.add(navLink);
    });

    // --- Hero Section ---
    const heroBlock = new ThreeMeshUI.Block({
      width: 1,
      height: 0.8,
      padding: 0.1,
      backgroundColor: new THREE.Color(0x555555),
      contentDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      margin: [0.1, 0, 0.1, 0]
    });
    mainContainer.add(heroBlock);

    const heroTitle = new ThreeMeshUI.Text({
      content: "Web Developer, Security Analyst, Tech Support",
      fontSize: 0.2,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0xffffff),
      margin: [0, 0, 0.05, 0]
    });
    heroBlock.add(heroTitle);

    const heroSubtitle = new ThreeMeshUI.Text({
      content: "Crafting secure and robust web solutions.",
      fontSize: 0.1,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0xffffff),
    });
    heroBlock.add(heroSubtitle);

    // --- About Section ---
    const aboutSection = new ThreeMeshUI.Block({
      width: 0.9,
      height: 0.6,
      padding: 0.08,
      backgroundColor: new THREE.Color(0xffffff),
      borderRadius: 0.05,
      margin: [0.1, 0, 0.1, 0]
    });
    mainContainer.add(aboutSection);

    const aboutTitle = new ThreeMeshUI.Text({
      content: "About Me",
      fontSize: 0.18,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0x333333),
      margin: [0, 0, 0.05, 0],
      textAlign: "center"
    });
    aboutSection.add(aboutTitle);

    const aboutText = new ThreeMeshUI.Text({
      content: "By analyzing risks, vulnerabilities, threats, and security incidents, I pinpoint and rectify issues within security systems. I possess the ability to design, install, test, and maintain web systems. Able to effectively self-manage during independent projects, and collaborate in a team setting.",
      fontSize: 0.07,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0x4a4a4a),
      textAlign: "center"
    });
    aboutSection.add(aboutText);

    // --- Projects Section ---
    const projectsSection = new ThreeMeshUI.Block({
      width: 0.9,
      height: 1.2,
      padding: 0.08,
      backgroundColor: new THREE.Color(0xffffff),
      borderRadius: 0.05,
      margin: [0.1, 0, 0.1, 0],
      contentDirection: "column",
      alignItems: "center"
    });
    mainContainer.add(projectsSection);

    const projectsTitle = new ThreeMeshUI.Text({
      content: "My Projects",
      fontSize: 0.18,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0x333333),
      margin: [0, 0, 0.08, 0],
      textAlign: "center"
    });
    projectsSection.add(projectsTitle);

    // Project 1 Item
    const project1Block = new ThreeMeshUI.Block({
      width: 1,
      height: 0.9,
      padding: 0.05,
      margin: [0, 0, 0.1, 0],
      contentDirection: "row",
      alignItems: "center",
      backgroundColor: new THREE.Color(0xf0f0f0),
      borderRadius: 0.03
    });
    projectsSection.add(project1Block);

   const project1ImageBlock = new ThreeMeshUI.Block({
  width: 1.5,
  height: 0.9,
  margin: [0, 0.08, 0, 0],
  borderRadius: 0.03,
});
new THREE.TextureLoader().load(Project1Image, (texture) => {
   // @ts-ignore
  project1ImageBlock.set({ backgroundTexture: texture });
});
project1Block.add(project1ImageBlock);
   
    // const project1ImageBlock = new ThreeMeshUI.Block({
    //   width: 1.5,
    //   height: 0.9,
    //   margin: [0, 0.08, 0, 0],
    //   borderRadius: 0.03,
    //   backgroundTexture: Project1Image
      
    // });
    // console.log("Project1Image value:", Project1Image);
    // project1Block.add(project1ImageBlock);
    // new THREE.TextureLoader().load(Project1Image, (texture: THREE.Texture) => {
    //   //project1ImageBlock.set({ backgroundTexture: texture });
    //   project1ImageBlock.material.backgroundTexture = texture;
    // });

    const project1DescriptionBlock = new ThreeMeshUI.Block({
      width: 3.5,
      height: 2,
      contentDirection: "column",
      justifyContent: "start",
      alignItems: "start",
      backgroundOpacity: 0
    });
    project1Block.add(project1DescriptionBlock);

    const project1Title = new ThreeMeshUI.Text({
      content: "Project Title One",
      fontSize: 0.12,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0x66ccff),
      margin: [0, 0, 0.03, 0],
      textAlign: "left"
    });
    project1DescriptionBlock.add(project1Title);

    const project1Desc = new ThreeMeshUI.Text({
      content: "This project involved developing a [brief description of project type, e.g., e-commerce platform, data visualization tool] using [key technologies used, e.g., React and Node.js]. My role included [your specific contributions, e.g., front-end development, API integration, database design]. It aimed to [problem solved or goal achieved].",
      fontSize: 0.06,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0x4a4a4a),
      margin: [0, 0, 0.03, 0],
      textAlign: "left"
    });
    project1DescriptionBlock.add(project1Desc);

    const project1LinksBlock = new ThreeMeshUI.Block({
      contentDirection: "row",
      backgroundOpacity: 0,
      alignItems: "center",
      width:1,
      height: 0.4,
    });
    project1DescriptionBlock.add(project1LinksBlock);

    const liveDemo1 = new ThreeMeshUI.Block({
      isInteractable: true,
      height: 1,
      width: 1,
      padding: 0.015,
      margin: [0, 0.03, 0, 0],
      backgroundOpacity: 0
    });
    liveDemo1.add(new ThreeMeshUI.Text({
      content: "Live Demo",
      fontSize: 0.06,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0x007bff),
    }));
    setupInteractiveBlock(liveDemo1,
        new THREE.Color(0x000000),
        new THREE.Color(0x007bff),
        new THREE.Color(0x0056b3),
        () => window.open("https://mockuplinkto.live/demo1", "_blank")
    );
    project1LinksBlock.add(liveDemo1);

    const divider1 = new ThreeMeshUI.Text({
      content: "|",
      fontSize: 0.06,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0x888888),
      margin: [0, 0.03, 0, 0.03]
    });
    project1LinksBlock.add(divider1);

    const githubRepo1 = new ThreeMeshUI.Block({
      isInteractable: true,
      width: 1,
      height: 1,
      padding: 0.015,
      backgroundOpacity: 0
    });
    githubRepo1.add(new ThreeMeshUI.Text({
      content: "GitHub Repo",
      fontSize: 0.06,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0x007bff),
    }));
    setupInteractiveBlock(githubRepo1,
        new THREE.Color(0x000000),
        new THREE.Color(0x007bff),
        new THREE.Color(0x0056b3),
        () => window.open("https://github.com/thefoenixweb/project1-repo", "_blank")
    );
    project1LinksBlock.add(githubRepo1);

    // Project 2 Item (structure similar to Project 1)
    const project2Block = new ThreeMeshUI.Block({
      width: 1,
      height: 0.9,
      padding: 0.05,
      contentDirection: "row",
      alignItems: "center",
      backgroundColor: new THREE.Color(0xf0f0f0),
      borderRadius: 0.03
    });
    projectsSection.add(project2Block);

    const project2ImageBlock = new ThreeMeshUI.Block({
      width: 1.5,
      height: 0.9,
      margin: [0, 0.08, 0, 0],
      borderRadius: 0.03,
      //backgroundTexture: Project2Image
    });
   new THREE.TextureLoader().load(Project2Image, (texture) => {
  // @ts-ignore
  project2ImageBlock.set({ backgroundTexture: texture });
});
    project2Block.add(project2ImageBlock);
    // new THREE.TextureLoader().load(Project2Image, (texture: THREE.Texture) => {
    //   project2ImageBlock.set({ backgroundTexture: texture });
    // });

    const project2DescriptionBlock = new ThreeMeshUI.Block({
      width: 3.5,
      height: 1,
      contentDirection: "column",
      justifyContent: "start",
      alignItems: "start",
      backgroundOpacity: 0
    });
    project2Block.add(project2DescriptionBlock);

    const project2Title = new ThreeMeshUI.Text({
      content: "Project Title Two",
      fontSize: 0.12,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0x66ccff),
      margin: [0, 0, 0.03, 0],
      textAlign: "left"
    });
    project2DescriptionBlock.add(project2Title);

    const project2Desc = new ThreeMeshUI.Text({
      content: "For this project, I focused on [brief description of project type, e.g., a real-time chat application, a portfolio site for a client] utilizing [key technologies, e.g., ASP.NET Core and SQL Server]. I was responsible for [your specific contributions, e.g., backend logic, security implementation, UI/UX improvements]. The project showcased [a specific skill or achievement].",
      fontSize: 0.06,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0x4a4a4a),
      margin: [0, 0, 0.03, 0],
      textAlign: "left"
    });
    project2DescriptionBlock.add(project2Desc);

    const project2LinksBlock = new ThreeMeshUI.Block({
      contentDirection: "row",
      backgroundOpacity: 0,
      alignItems: "center",
      width:1,
      height:1
    });
    project2DescriptionBlock.add(project2LinksBlock);

    const liveDemo2 = new ThreeMeshUI.Block({
      isInteractable: true,
      padding: 0.015,
      margin: [0, 0.03, 0, 0],
      backgroundOpacity: 0,
      width:1,
      height:1
    });
    liveDemo2.add(new ThreeMeshUI.Text({
      content: "Live Demo",
      fontSize: 0.06,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0x007bff),
    }));
    setupInteractiveBlock(liveDemo2,
        new THREE.Color(0x000000),
        new THREE.Color(0x007bff),
        new THREE.Color(0x0056b3),
        () => window.open("https://mockuplinkto.live/demo2", "_blank")
    );
    project2LinksBlock.add(liveDemo2);

    const divider2 = new ThreeMeshUI.Text({
      content: "|",
      fontSize: 0.06,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0x888888),
      margin: [0, 0.03, 0, 0.03]
    });
    project2LinksBlock.add(divider2);

    const githubRepo2 = new ThreeMeshUI.Block({
      isInteractable: true,
      padding: 0.015,
      backgroundOpacity: 0,
      height: 1,
      width: 1
    });
    githubRepo2.add(new ThreeMeshUI.Text({
      content: "GitHub Repo",
      fontSize: 0.06,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0x007bff),
    }));
    setupInteractiveBlock(githubRepo2,
        new THREE.Color(0x000000),
        new THREE.Color(0x007bff),
        new THREE.Color(0x0056b3),
        () => window.open("https://github.com/thefoenixweb/project2-repo", "_blank")
    );
    project2LinksBlock.add(githubRepo2);

    // --- Skills Section ---
    const skillsSection = new ThreeMeshUI.Block({
      width: 0.9,
      height: 0.8,
      padding: 0.08,
      backgroundColor: new THREE.Color(0xffffff),
      borderRadius: 0.05,
      margin: [0.1, 0, 0.1, 0],
      contentDirection: "column",
      alignItems: "center"
    });
    mainContainer.add(skillsSection);

    const skillsTitle = new ThreeMeshUI.Text({
      content: "My Skills",
      fontSize: 0.18,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0x333333),
      margin: [0, 0, 0.08, 0],
      textAlign: "center"
    });
    skillsSection.add(skillsTitle);

    const skillsListBlock = new ThreeMeshUI.Block({
      contentDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      backgroundOpacity: 0,
      width: 1,
      height: 0.6,
    });
    skillsSection.add(skillsListBlock);

    const skills: string[] = ["React", "ASP.NET Core", "WordPress", "Three.js", "Nmap", "Sophos", "Adobe Premiere Pro"];
    skills.forEach((skill: string) => {
      const skillItem = new ThreeMeshUI.Block({
        padding: 0.02,
        height:1,
        width: 1.5,
        margin: 0.02,
        backgroundColor: new THREE.Color(0x66ccff),
        borderRadius: 0.02,
      });
      skillItem.add(
        new ThreeMeshUI.Text({
          content: skill,
          fontSize: 0.07,
          fontFamily: FontJSON,
          fontTexture: FontImage,
          fontColor: new THREE.Color(0xffffff),
        })
      );
      skillsListBlock.add(skillItem);
    });

    // --- Contact Section ---
    const contactSection = new ThreeMeshUI.Block({
      width: 0.9,
      height: 1,
      padding: 0.08,
      backgroundColor: new THREE.Color(0xffffff),
      borderRadius: 0.05,
      margin: [0.1, 0, 0.1, 0],
      contentDirection: "column",
      alignItems: "center"
    });
    mainContainer.add(contactSection);

    const contactTitle = new ThreeMeshUI.Text({
      content: "Get in Touch",
      fontSize: 0.18,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0x333333),
      margin: [0, 0, 0.08, 0],
      textAlign: "center"
    });
    contactSection.add(contactTitle);

    const contactFormBlock = new ThreeMeshUI.Block({
      width: 0.7,
      height: 1,
      padding: 0.05,
      backgroundColor: new THREE.Color(0xf9f9f9),
      borderRadius: 0.03,
      contentDirection: "column",
      alignItems: "start",
    });
    contactSection.add(contactFormBlock);

    interface FormField {
      label: string;
      name: keyof FormData; // Ensures name matches keys in FormData
      type: "text" | "email" | "textarea";
      value: string;
    }

    const formFields: FormField[] = [
      { label: "Name:", name: "name", type: "text", value: formData.name },
      { label: "Email:", name: "email", type: "email", value: formData.email },
      { label: "Subject:", name: "subject", type: "text", value: formData.subject },
      { label: "Message:", name: "message", type: "textarea", value: formData.message }
    ];

    formFields.forEach((field: FormField) => {
      const fieldBlock = new ThreeMeshUI.Block({
        width: 1,
        height: 1,
        margin: [0.03, 0, 0.03, 0],
        backgroundOpacity: 0,
        contentDirection: "column",
        alignItems: "start",
      });
      contactFormBlock.add(fieldBlock);

      fieldBlock.add(
        new ThreeMeshUI.Text({
          content: field.label,
          fontSize: 0.06,
          fontFamily: FontJSON,
          fontTexture: FontImage,
          fontColor: new THREE.Color(0x4a4a4a),
          margin: [0, 0, 0.01, 0]
        })
      );
      fieldBlock.add(
        new ThreeMeshUI.Block({
          width: 1,
          
          height: field.type === "textarea" ? 0.3 : 0.1,
          backgroundColor: new THREE.Color(0xeeeeee),
          padding: 0.02,
          borderRadius: 0.01,
        }).add(
          new ThreeMeshUI.Text({
            content: field.value === "" ? `Enter ${field.label.replace(':', '')}` : field.value,
            fontSize: 0.06,
            fontFamily: FontJSON,
            fontTexture: FontImage,
            fontColor: field.value === "" ? new THREE.Color(0x888888) : new THREE.Color(0x333333),
          })
        )
      );
    });

    const submitButton = new ThreeMeshUI.Block({
      isInteractable: true,
      width: 0.3,
      height: 0.2,
      padding: 0.03,
      margin: [0.05, 0, 0, 0],
      backgroundColor: new THREE.Color(0x333333),
      borderRadius: 0.03,
    });
    submitButton.add(
      new ThreeMeshUI.Text({
        content: "Send Message",
        fontSize: 0.08,
        fontFamily: FontJSON,
        fontTexture: FontImage,
        fontColor: new THREE.Color(0xffffff),
      })
    );
    setupInteractiveBlock(submitButton,
        new THREE.Color(0x333333),
        new THREE.Color(0x66ccff),
        new THREE.Color(0x4499dd),
        () => {
            alert("Form submitted! (This is a demo in 3D UI)");
            console.log("Simulated Form data submitted from 3D UI.");
        }
    );
    contactFormBlock.add(submitButton);

    // --- Footer Section ---
    const footerBlock = new ThreeMeshUI.Block({
      width: 1,
      height: 0.3,
      padding: 0.05,
      backgroundColor: new THREE.Color(0x333333),
      contentDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      margin: [0.1, 0, 0, 0]
    });
    mainContainer.add(footerBlock);

    const copyrightText = new ThreeMeshUI.Text({
      content: "(c) 2025 Tshepiso Molefi. All rights reserved.",
      fontSize: 0.06,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0xffffff),
      margin: [0, 0, 0.02, 0]
    });
    footerBlock.add(copyrightText);

    const footerGithubLink = new ThreeMeshUI.Block({
      isInteractable: true,
      height: 1,
      width: 0.2,
      padding: 0.015,
      backgroundOpacity: 0
    });
    footerGithubLink.add(new ThreeMeshUI.Text({
      content: "GitHub",
      fontSize: 0.06,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0x66ccff),
    }));
    setupInteractiveBlock(footerGithubLink,
        new THREE.Color(0x000000),
        new THREE.Color(0x66ccff),
        new THREE.Color(0x4499dd),
        () => window.open("https://github.com/thefoenixweb", "_blank")
    );
    footerBlock.add(footerGithubLink);

    return mainContainer;
  }, []);

  // After the UI is created, add it to the r3f scene's group
  useEffect(() => {
    if (uiGroupRef.current && uiContainer) {
      uiGroupRef.current.add(uiContainer);
      ThreeMeshUI.update(); // Initial update
    }
    // Cleanup function: remove the UI when the component unmounts
    return () => {
      if (uiGroupRef.current && uiContainer) {
        uiGroupRef.current.remove(uiContainer);
        // Dispose of ThreeMeshUI objects if necessary to prevent memory leaks
        // uiContainer.dispose(); // ThreeMeshUI might not have a direct dispose method for Block
      }
    };
  }, [uiContainer]); // Depend on uiContainer to ensure it's created before adding

  // Update three-mesh-ui on every frame
  useFrame(() => {
    ThreeMeshUI.update();
  });

  return (
    <>
      {/* This group holds your entire three-mesh-ui structure */}
      <group ref={uiGroupRef} position={[0, 1.5, -3]} rotation={[0, 0, 0]}>
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