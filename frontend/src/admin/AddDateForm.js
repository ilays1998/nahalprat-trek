import React, { useState } from "react";
import { TrekDate } from "../entities/all";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Alert, AlertDescription } from "../components/ui/alert";
import { CalendarIcon, Plus, Minus, AlertCircle, CheckCircle, Sun, Snowflake, Leaf, Flower2, Info } from "lucide-react";
import { format, addDays } from "date-fns";

export default function AddDateForm({ onDateAdded, language = 'he' }) {
  const [startDate, setStartDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  const [formData, setFormData] = useState({
    available_spots: 12,
    season: 'spring',
    weather_notes: ''
  });

  const content = {
    he: {
      title: "הוסף תאריך טיול חדש",
      startDate: "תאריך התחלה",
      endDate: "תאריך סיום",
  spots: "מקומות פנויים",
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
  spots: "Available Spots",
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

  const suggestions = {
    he: [
      "חם ושמשי, הביאו כובע ומים (3 ליטר)",
      "לילות קרים – מומלץ שכבת חימום",
      "ייתכנו רוחות חזקות בפסגה",
      "שביל חלק – נעלי הליכה עם אחיזה טובה",
    ],
    en: [
      "Hot and sunny – bring hat and 3L water",
      "Cold nights – bring a warm layer",
      "High winds possible near the ridge",
      "Trail may be slippery – sturdy hiking shoes",
    ],
  };

  const seasonOptions = [
    { key: 'spring', label: currentContent.seasons.spring, Icon: Flower2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { key: 'summer', label: currentContent.seasons.summer, Icon: Sun, color: 'text-desert-600 bg-desert-50 border-desert-200' },
    { key: 'autumn', label: currentContent.seasons.autumn, Icon: Leaf, color: 'text-orange-600 bg-orange-50 border-orange-200' },
    { key: 'winter', label: currentContent.seasons.winter, Icon: Snowflake, color: 'text-sky-600 bg-sky-50 border-sky-200' },
  ];

  const totalCapacity =
  Number(formData.available_spots) || 0;

  const changeSpots = (field, delta, min = 0, max = 50) => {
    setFormData(prev => {
      const next = Math.min(max, Math.max(min, Number(prev[field] || 0) + delta));
      return { ...prev, [field]: next };
    });
  };

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
        available_spots: formData.available_spots,
        season: formData.season,
        weather_notes: formData.weather_notes
      };

      await TrekDate.create(dateData);
      
      setSuccess(true);
      setStartDate(null);
      setFormData({
        available_spots: 12,
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
          <Plus className="w-5 h-5 text-desert-600" />
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
              <div className="mt-2">
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PPP') : currentContent.selectDate}
                </Button>
                {showCalendar && (
                  <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date);
                        setShowCalendar(false);
                      }}
                      disabled={(date) => date < today}
                      initialFocus
                    />
                  </div>
                )}
              </div>
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
              <Label htmlFor="spots">{currentContent.spots}</Label>
              <div className="mt-2 flex items-center gap-2">
                <Button type="button" variant="outline" size="icon" onClick={() => changeSpots('available_spots', -1)}>
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  id="spots"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.available_spots}
                  onChange={(e) => handleInputChange('available_spots', parseInt(e.target.value || '0'))}
                  className="text-center"
                />
                <Button type="button" variant="outline" size="icon" onClick={() => changeSpots('available_spots', 1)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-desert-600" />
              <span>{language === 'he' ? 'סה"כ קיבולת' : 'Total capacity'}: <strong className="text-gray-900">{totalCapacity}</strong></span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>{currentContent.season}</Label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {seasonOptions.map(({ key, label, Icon, color }) => {
                  const selected = formData.season === key;
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => handleInputChange('season', key)}
                      className={`flex items-center gap-2 rounded-md border px-3 py-2 text-left transition ${selected ? 'ring-2 ring-desert-500 bg-white' : 'hover:bg-white/60'} ${color}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label>{currentContent.weatherNotes}</Label>
              <Textarea
                value={formData.weather_notes}
                onChange={(e) => handleInputChange('weather_notes', e.target.value)}
                placeholder={currentContent.weatherPlaceholder}
                className="mt-2 h-24"
                maxLength={220}
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {suggestions[language].map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleInputChange('weather_notes', (formData.weather_notes ? formData.weather_notes + (formData.weather_notes.endsWith(' ') ? '' : ' ') : '') + s)}
                      className="text-xs rounded-full border border-desert-200 bg-desert-50 px-3 py-1 text-desert-700 hover:bg-desert-100"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-gray-500">{(formData.weather_notes || '').length}/220</span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !startDate}
            className="w-full bg-gradient-to-r from-desert-600 to-orange-600 text-white hover:opacity-90"
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