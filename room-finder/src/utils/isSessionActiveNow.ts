import type { EventSession, LectureSession } from "@/models";

// prüft ob eine LectureSession, oder eine EventSession aktuell stattfindet
export const isSessionActiveNow = (session: LectureSession | EventSession, now: Date): boolean => {


    //falls die Uhrzeit außerhalb des Zeitraums liegt, in der die Session stattfindet soll false zurückgegeben werden

    const todaysDate = now.toLocaleDateString('sv-SE');

    // falls es eine eventSession ist
    if("date" in session) {
        
        if(session.date != todaysDate) return false;
    }
    // falls es eine lectureSession ist
    else {
        if(session.startDate > todaysDate || session.endDate < todaysDate) return false;
        if(session.dayOfWeek != now.getDay()) return false;
    }

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
    const [startH, startM] = session.startTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    
    const [endH, endM] = session.endTime.split(':').map(Number);
    const endMinutes = endH * 60 + endM;

    if (currentMinutes < startMinutes || currentMinutes >= endMinutes) return false;

    return true;
}