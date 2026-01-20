import { useState } from "react";

export const [includeSaturday, setIncludeSaturday] = useState(false);

export const days: string[] = includeSaturday ? [
        'Monday', 
        'Tuesday', 
        'Wednesday', 
        'Thursday',
        'Friday', 
        'Saturday'
    ] : [
        'Monday', 
        'Tuesday', 
        'Wednesday', 
        'Thursday', 
        'Friday'
    ];

export const timeSlots: string[] = [
    '08:00', 
    '08:50', 
    '09:45', 
    '10:35', 
    '11:30', 
    '12:20', 
    '13:15', 
    '14:05', 
    '15:00', 
    '15:50', 
    '16:45', 
    '17:35', 
    '18:30', 
    '19:20'
];