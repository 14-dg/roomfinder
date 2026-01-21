import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScreenHeader from '@/components/ScreenHeader';

import RoomsAdmin from './RoomsAdmin';
import TimetablesAdmin from './TimetablesAdmin';
import BookingsAdmin from './BookingsAdmin';
import ProfessorsAdmin from './ProfessorsAdmin';


//------------------------------ screen ------------------------------------ //
// hier wird der Admin Screen mit Tabs für die verschiedenen Admin Bereiche erstellt
// und aufgerufen

export default function AdminScreen() {
  return (
    <>
      <ScreenHeader
        title="Admin Panel"
        subtitle="Manage rooms, timetables, bookings and professors"
      />

      <Tabs defaultValue="rooms" className="w-full space-y-6">
        <TabsList className="w-full flex flex-wrap gap-2">
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="timetables">Timetables</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="professors">Professors</TabsTrigger>
        </TabsList>

        <TabsContent value="rooms">
          <RoomsAdmin />
        </TabsContent>

        <TabsContent value="timetables">
          <TimetablesAdmin />
        </TabsContent>

        <TabsContent value="bookings">
          <BookingsAdmin />
        </TabsContent>

        <TabsContent value="professors">
          <ProfessorsAdmin />
        </TabsContent>
      </Tabs>
    </>
  );
}
