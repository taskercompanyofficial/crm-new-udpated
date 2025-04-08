import React from 'react';
import { Badge } from '@/components/ui/badge';

interface PriorityProps {
    priority: string;
}

export const Priority: React.FC<PriorityProps> = ({ priority }) => {
    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'low':
                return 'bg-green-100 text-green-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'high':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Badge className={`${getPriorityColor(priority)} font-medium`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </Badge>
    );
};
