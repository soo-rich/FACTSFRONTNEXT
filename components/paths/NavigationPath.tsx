'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '../ui/breadcrumb';

const NavigationPath = () => {

    const  pathname = usePathname();
    const pathSegments = pathname.split('/').filter(segment => segment);
    return (
        <Breadcrumb>
        <BreadcrumbList className='hidden md:flex text-xl font-semibold text-gray-800 dark:text-gray-200'>
            <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className='hidden md:block'>/</BreadcrumbSeparator>
            {pathSegments.map((segment, index) => (
                <BreadcrumbItem key={index}>
                    <BreadcrumbLink href={`/${pathSegments.slice(0, index + 1).join('/')}`}>
                        {segment}
                    </BreadcrumbLink>
                </BreadcrumbItem>
            ))}
            
        </BreadcrumbList>
        </Breadcrumb>
    );
};


export default NavigationPath;