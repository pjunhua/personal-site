import { useState } from 'react';
import './ProjectCard.css';

interface ProjectCardProps {
    bannerImageUrl: string;
    projectTitle: string;
    isActive: boolean;
    makeActive: ()=>void;
}

export default function ProjectCard({ bannerImageUrl, projectTitle, isActive, makeActive }: ProjectCardProps) {

    return (
        <>
            <div className={`lowerSection ${isActive ? 'isActive' : ''}`} style={{ backgroundImage: bannerImageUrl }}>
                <p className='projectTitle'>{projectTitle}</p>
            </div>
        </>
    )
}