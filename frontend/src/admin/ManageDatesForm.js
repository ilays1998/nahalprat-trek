import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'; // TODO: Check if this file exists
import { Badge } from '../components/ui/badge'; // TODO: Check if this file exists
import { Button } from '../components/ui/button'; // TODO: Check if this file exists
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog"; // TODO: Check if this file exists
import { format, parseISO, isAfter, isBefore, isEqual, startOfDay } from 'date-fns';
import { Calendar, Check, Package, Trash2 } from 'lucide-react';

export default function ManageDates({ trekDates, onDeleteDate, language = 'he' }) {
  const today = startOfDay(new Date());

  const futureDates = trekDates.filter(d => isAfter(parseISO(d.start_date), today));
  const ongoingDates = trekDates.filter(d => {
    const start = parseISO(d.start_date);
    const end = parseISO(d.end_date);
    return (isEqual(start, today) || isBefore(start, today)) && (isEqual(end, today) || isAfter(end, today));
  });
  const pastDates = trekDates.filter(d => isBefore(parseISO(d.end_date), today));
  
  const content = {
    he: {
      future: 'תאריכים עתידיים',
      ongoing: 'טיולים פעילים',
      past: 'תאריכי עבר',
      noFuture: 'אין תאריכים עתידיים מתוכננים.',
      noOngoing: 'אין טיולים פעילים כרגע.',
      noPast: 'אין תאריכי עבר.',
      spots: 'מקומות',
      deleteDate: 'מחק תאריך',
      deleteConfirmTitle: 'האם למחוק את התאריך?',
      deleteConfirmDesc: 'פעולה זו תמחק את התאריך באופן סופי. לא ניתן לשחזר אותו. האם להמשיך?',
      confirm: 'אשר',
      back: 'חזור',
    },
    en: {
      future: 'Future Dates',
      ongoing: 'Ongoing Treks',
      past: 'Past Dates',
      noFuture: 'No future dates scheduled.',
      noOngoing: 'No treks are currently ongoing.',
      noPast: 'No past dates.',
      spots: 'spots',
      deleteDate: 'Delete Date',
      deleteConfirmTitle: 'Are you sure you want to delete this date?',
      deleteConfirmDesc: 'This will permanently delete the trek date. This action cannot be undone.',
      confirm: 'Confirm',
      back: 'Back',
    },
  };
  
  const t = content[language];
  
  const DateCard = ({ date, isPast }) => (
    <Card className="border-none shadow-md bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-600" />
          {format(parseISO(date.start_date), 'MMM d')} - {format(parseISO(date.end_date), 'MMM d, yyyy')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-200">
            Basic: {date.available_spots_basic} {t.spots}
          </Badge>
          <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200">
            Pro: {date.available_spots_pro} {t.spots}
          </Badge>
          <Badge variant="outline" className="text-purple-700 bg-purple-50 border-purple-200">
            Premium: {date.available_spots_premium} {t.spots}
          </Badge>
        </div>
        {!isPast && (
          <div className="pt-3 border-t">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="w-full">
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t.deleteDate}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t.deleteConfirmTitle}</AlertDialogTitle>
                  <AlertDialogDescription>{t.deleteConfirmDesc}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t.back}</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDeleteDate(date.id)}>{t.confirm}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const DateSection = ({ title, dates }) => (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-amber-200">{title}</h3>
      {dates.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dates.map(date => <DateCard key={date.id} date={date} isPast={title === t.past} />)}
        </div>
      ) : (
        <p className="text-gray-500">{t[`no${title.split(' ')[0]}`]}</p>
      )}
    </div>
  );

  return (
    <div>
      <DateSection title={t.ongoing} dates={ongoingDates} />
      <DateSection title={t.future} dates={futureDates} />
      <DateSection title={t.past} dates={pastDates} />
    </div>
  );
}