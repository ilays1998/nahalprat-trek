import React, { useState } from "react";
import { TrekDate } from "../entities/all"; // TODO: Check if this file exists
import { Button } from "../components/ui/button"; // TODO: Check if this file exists
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"; // TODO: Check if this file exists
import { Input } from "../components/ui/input"; // TODO: Check if this file exists
import { Label } from "../components/ui/label"; // TODO: Check if this file exists
import { Textarea } from "../components/ui/textarea"; // TODO: Check if this file exists
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"; // TODO: Check if this file exists
import { Calendar } from "../components/ui/calendar"; // TODO: Check if this file exists
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"; // TODO: Check if this file exists
import { Alert, AlertDescription } from "../components/ui/alert"; // TODO: Check if this file exists
import { CalendarIcon, Plus, AlertCircle, CheckCircle } from "lucide-react";
import { format, addDays } from "date-fns";

export default function AddDateForm({ onDateAdded, language = 'he' }) {
  const [startDate, setStartDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    available_spots_basic: 12,
    available_spots_pro: 8,
    available_spots_premium: 4,
    season: 'spring',
    weather_notes: ''
  });

  const content = {
    he: {
      title: "הוסף תאריך טיול חדש",
      startDate: "תאריך התחלה",
      endDate: "תאריך סיום",
      basicSpots: "מקומות זמינים - בסיסי",
      proSpots: "מקומות זמינים - מקצועי",
      premiumSpots: "מקומות זמינים - פרימיום",
      season: "עונה",
      weatherNotes: "הערות מזג אוויר",
      seasons: {
        spring: "אביב",
        summer: "קיץ",
        autumn: "סתיו",
        winter: "חורף"
      },
      selectDate: "בחר תאריך",
      addDate: "הוסף תאריך",
      adding: "מוסיף...",
      success: "התאריך נוסף בהצלחה!",
      error: "אירעה שגיאה בהוספת התאריך",
      weatherPlaceholder: "מזג אוויר צפוי, המלצות לביגוד וכו'"
    },
    en: {
      title: "Add New Trek Date",
      startDate: "Start Date",
      endDate: "End Date",
      basicSpots: "Available Spots - Basic",
      proSpots: "Available Spots - Pro",
      premiumSpots: "Available Spots - Premium",
      season: "Season",
      weatherNotes: "Weather Notes",
      seasons: {
        spring: "Spring",
        summer: "Summer",
        autumn: "Autumn",
        winter: "Winter"
      },
      selectDate: "Select Date",
      addDate: "Add Date",
      adding: "Adding...",
      success: "Date added successfully!",
      error: "Error adding date",
      weatherPlaceholder: "Expected weather, clothing recommendations, etc."
    }
  };

  const currentContent = content[language];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate) {
      setError(language === 'he' ? 'אנא בחר תאריך התחלה' : 'Please select a start date');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const endDate = addDays(startDate, 2); // 3-day trek

      const dateData = {
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        ...formData
      };

      await TrekDate.create(dateData);
      
      setSuccess(true);
      setStartDate(null);
      setFormData({
        available_spots_basic: 12,
        available_spots_pro: 8,
        available_spots_premium: 4,
        season: 'spring',
        weather_notes: ''
      });

      if (onDateAdded) {
        onDateAdded();
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      setError(currentContent.error);
    }
    
    setLoading(false);
  };

  const today = new Date();
  const endDate = startDate ? addDays(startDate, 2) : null;

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-amber-600" />
          {currentContent.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {currentContent.success}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>{currentContent.startDate}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start mt-2">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : currentContent.selectDate}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) => date < today}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>{currentContent.endDate}</Label>
              <div className="mt-2 p-3 bg-gray-50 rounded-md border">
                <span className="text-gray-600">
                  {endDate ? format(endDate, 'PPP') : language === 'he' ? 'יחושב אוטומטית (3 ימים)' : 'Calculated automatically (3 days)'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="basicSpots">{currentContent.basicSpots}</Label>
              <Input
                id="basicSpots"
                type="number"
                min="0"
                max="20"
                value={formData.available_spots_basic}
                onChange={(e) => handleInputChange('available_spots_basic', parseInt(e.target.value))}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="proSpots">{currentContent.proSpots}</Label>
              <Input
                id="proSpots"
                type="number"
                min="0"
                max="15"
                value={formData.available_spots_pro}
                onChange={(e) => handleInputChange('available_spots_pro', parseInt(e.target.value))}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="premiumSpots">{currentContent.premiumSpots}</Label>
              <Input
                id="premiumSpots"
                type="number"
                min="0"
                max="10"
                value={formData.available_spots_premium}
                onChange={(e) => handleInputChange('available_spots_premium', parseInt(e.target.value))}
                className="mt-2"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>{currentContent.season}</Label>
              <Select
                value={formData.season}
                onValueChange={(value) => handleInputChange('season', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(currentContent.seasons).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{currentContent.weatherNotes}</Label>
              <Textarea
                value={formData.weather_notes}
                onChange={(e) => handleInputChange('weather_notes', e.target.value)}
                placeholder={currentContent.weatherPlaceholder}
                className="mt-2 h-20"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !startDate}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:opacity-90"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {currentContent.adding}
              </div>
            ) : (
              currentContent.addDate
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}