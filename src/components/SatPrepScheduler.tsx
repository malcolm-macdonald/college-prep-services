import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAllSatPrepEvents, SatPrepEvent } from '@/services/calendarService';

interface SatPrepSchedulerProps {
  onBack: () => void;
  onComplete: (selectedDate: Date, selectedTime: string) => void;
}

export const SatPrepScheduler: React.FC<SatPrepSchedulerProps> = ({ onBack, onComplete }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [allEvents, setAllEvents] = useState<SatPrepEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<SatPrepEvent | null>(null);
  
  // Fetch all SAT Prep events on component mount
  useEffect(() => {
    setLoading(true);
    
    getAllSatPrepEvents()
      .then(events => {
        console.log('Received events:', events);
        setAllEvents(events);
      })
      .catch(error => {
        console.error('Error fetching SAT Prep events:', error);
        toast({
          title: "Error",
          description: "Failed to fetch available SAT Prep sessions. Please try again.",
          variant: "destructive"
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [toast]);

  const handleEventSelect = (event: SatPrepEvent) => {
    setSelectedEvent(event);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) {
      toast({
        title: "Selection Required",
        description: "Please select an available SAT Prep session.",
        variant: "destructive",
      });
      return;
    }
    
    // Parse the date from the selected event
    // Format: "Monday, April 25, 2025"
    const dateParts = selectedEvent.date.split(', ');
    const monthDayYear = dateParts[1] + ', ' + dateParts[2];
    const dateObj = new Date(monthDayYear);
    
    // Just pass the selected date and time to parent without creating appointment
    onComplete(dateObj, selectedEvent.timeSlot);
  };

  // Group events by date
  const eventsByDate = allEvents.reduce((groups: Record<string, SatPrepEvent[]>, event) => {
    if (!groups[event.date]) {
      groups[event.date] = [];
    }
    groups[event.date].push(event);
    return groups;
  }, {});

  if (loading) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">Loading Available SAT Prep Sessions</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Select an Available SAT Prep Session</CardTitle>
        <CardDescription>Choose from our upcoming SAT Prep sessions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {allEvents.length === 0 ? (
          <div className="text-center p-6 bg-muted/20 rounded-lg">
            <h3 className="text-lg font-medium text-muted-foreground">No Available Sessions</h3>
            <p className="mt-2">There are currently no SAT Prep sessions available. Please check back later or contact us for more information.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(eventsByDate).map(([date, events]) => (
              <div key={date} className="space-y-2">
                <h3 className="text-lg font-semibold">{date}</h3>
                <div className="grid grid-cols-1 gap-3">
                  {events.map((event) => (
                    <Button
                      key={event.id}
                      variant={selectedEvent?.id === event.id ? "default" : "outline"}
                      className="w-full min-h-[3.5rem] py-3 px-4 whitespace-normal text-sm flex items-center justify-center text-center break-words"
                      onClick={() => handleEventSelect(event)}
                    >
                      {event.timeSlot}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedEvent || allEvents.length === 0}
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}; 