
import React, { useState, useEffect } from "react";
import { Booking, User, TrekDate } from "../entities/all";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { CalendarIcon, Users, Phone, Mail, Shield, ShieldCheck, ShieldClose, Ban, Clock, Check, Trash2 } from "lucide-react";
import { format, parseISO, isAfter } from "date-fns";
import AddDateForm from "../admin/AddDateForm";
import ManageDates from "../admin/ManageDatesForm";
import { useLanguage } from "../layout";
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
} from "../components/ui/alert-dialog";

export default function MyBookingsPage() {
  const { language } = useLanguage();
  const [myBookings, setMyBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddDate, setShowAddDate] = useState(false);
  const [trekDates, setTrekDates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load current user
      const user = await User.me();
      setCurrentUser(user);
      
      try {
        // Load user's own bookings and trek dates concurrently
        const [userBookings, allTrekDates] = await Promise.all([
          Booking.filter({ sort: '-trek_date', user_id: user.id }),
          TrekDate.list('-start_date')
        ]);
        
        setMyBookings(userBookings);
        setTrekDates(allTrekDates);
        
        // If user is admin, load all bookings
        if (user.role === 'admin') {
          try {
            const allBookingsData = await Booking.filter({ 
              sort: '-trek_date',
              admin: true // Use admin=true parameter for admin requests
            });
            console.log('Admin bookings loaded:', allBookingsData);
            setAllBookings(allBookingsData);
          } catch (error) {
            console.error('Error loading all bookings:', error);
            setError('Failed to load all bookings. Please try again.');
            setAllBookings([]);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load bookings. Please try again.');
        setMyBookings([]);
        setTrekDates([]);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load user data. Please try again.');
    }
    setLoading(false);
  };

  const handleApproveBooking = async (bookingToApprove) => {
    try {
      await Booking.update(bookingToApprove.id, { status: 'confirmed' });
      await loadData(); // Reload all data after update
    } catch (error) {
      console.error("Failed to approve booking:", error);
      setError('Failed to approve booking. Please try again.');
    }
  };

  const handleCancelBooking = async (bookingToCancel) => {
    try {
      // 1. Update booking status to 'cancelled'
      await Booking.update(bookingToCancel.id, { status: 'cancelled' });

      // 2. Find the corresponding trek date
      const trekDateToUpdate = trekDates.find(td => 
        td.start_date === bookingToCancel.trek_date
      );

      if (trekDateToUpdate) {
        // 3. Add the spots back to the available count
        const spotsField = `available_spots_${bookingToCancel.package_type}`;
        const currentSpots = trekDateToUpdate[spotsField] || 0;
        const spotsToAdd = bookingToCancel.participants_count;
        
        await TrekDate.update(trekDateToUpdate.id, {
          [spotsField]: currentSpots + spotsToAdd
        });
      }

      // 4. Refresh data
      await loadData();
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      setError('Failed to cancel booking. Please try again.');
    }
  };

  const handleDeleteDate = async (dateId) => {
    try {
      await TrekDate.delete(dateId);
      await loadData();
    } catch (error) {
      console.error("Failed to delete date:", error);
      setError('Failed to delete date. Please try again.');
    }
  };

  const content = {
    he: {
      title: "ניהול הזמנות ותאריכים",
      myBookings: "ההזמנות שלי",
      allBookings: "כל ההזמנות",
      manageDates: "ניהול תאריכים",
      noBookings: "אין הזמנות עדיין",
      noBookingsDesc: "כשתבצע הזמנות, הן יופיעו כאן",
      noBookingsAdmin: "אין הזמנות במערכת עדיין",
      noBookingsAdminDesc: "כשלקוחות יבצעו הזמנות, הן יופיעו כאן",
      bookingDetails: "פרטי הזמנה",
      packageTypes: {
        basic: "בסיסי",
        pro: "מקצועי", 
        premium: "פרימיום"
      },
      status: {
        pending: "ממתין לאישור",
        confirmed: "מאושר",
        cancelled: "מבוטל"
      },
      contact: "פרטי קשר",
      emergency: "איש קשר לחירום",
      totalBookings: "סה״כ הזמנות",
      totalRevenue: "סה״כ הכנסות",
      totalParticipants: "סה״כ משתתפים",
      adminPanel: "פאנל ניהול",
      addNewDate: "הוסף תאריך חדש",
      hideAddDate: "סגור טופס",
      approveBooking: "אשר הזמנה",
      cancelBooking: "בטל הזמנה",
      cancelConfirmTitle: "האם לבטל את ההזמנה?",
      cancelConfirmDesc: "פעולה זו תבטל את הזמנתך באופן סופי. המקומות שהזמנת ישוחררו. האם להמשיך?",
      confirm: "אשר",
      back: "חזור",
    },
    en: {
      title: "Manage Bookings & Dates",
      myBookings: "My Bookings", 
      allBookings: "All Bookings",
      manageDates: "Manage Dates",
      noBookings: "No bookings yet",
      noBookingsDesc: "When you make bookings, they will appear here",
      noBookingsAdmin: "No bookings in the system yet",
      noBookingsAdminDesc: "When customers make bookings, they will appear here",
      bookingDetails: "Booking Details",
      packageTypes: {
        basic: "Basic",
        pro: "Pro",
        premium: "Premium"
      },
      status: {
        pending: "Pending Confirmation",
        confirmed: "Confirmed", 
        cancelled: "Cancelled"
      },
      contact: "Contact Details",
      emergency: "Emergency Contact",
      totalBookings: "Total Bookings",
      totalRevenue: "Total Revenue",
      totalParticipants: "Total Participants",
      adminPanel: "Admin Panel",
      addNewDate: "Add New Date",
      hideAddDate: "Close Form",
      approveBooking: "Approve Booking",
      cancelBooking: "Cancel Booking",
      cancelConfirmTitle: "Are you sure you want to cancel?",
      cancelConfirmDesc: "This will permanently cancel your booking and release your spots. This action cannot be undone.",
      confirm: "Confirm",
      back: "Back",
    }
  };

  const currentContent = content[language];

  const BookingCard = ({ booking, showUserInfo = false }) => {
    // Check if the booking is cancelled
    const isCancelled = booking.status === 'cancelled';
    // Check if the trek date is in the future
    const isFutureBooking = isAfter(parseISO(booking.trek_date), new Date());

    // Define status display properties
    const statusInfo = {
      pending: {
        label: currentContent.status.pending,
        icon: <Clock className="w-5 h-5 text-yellow-600" />,
        badgeClass: "bg-yellow-100 text-yellow-800",
      },
      cancelled: {
        label: currentContent.status.cancelled,
        icon: <ShieldClose className="w-5 h-5 text-red-500" />,
        badgeClass: "bg-red-100 text-red-800",
      },
      confirmed: {
        label: currentContent.status.confirmed,
        icon: <ShieldCheck className="w-5 h-5 text-green-600" />,
        badgeClass: "bg-green-100 text-green-800",
      }
    };

    // Get the current status display from the map, default to pending if not found
    const currentStatus = statusInfo[booking.status] || statusInfo.pending;

    return (
    <Card className={`border-none shadow-lg hover:shadow-xl transition-shadow duration-300 ${isCancelled ? 'bg-gray-50 opacity-70' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className={`text-xl font-bold text-gray-900 ${isCancelled ? 'line-through' : ''}`}>
              {showUserInfo ? `${booking.first_name} ${booking.last_name}` : currentContent.bookingDetails}
            </CardTitle>
            <p className="text-gray-500 text-sm">
              {language === 'he' ? 'הוזמן ב' : 'Booked on'}: {format(new Date(booking.created_date), 'MMM d, yyyy')}
            </p>
          </div>
          <Badge className={`${currentStatus.badgeClass} flex items-center gap-2`}>
            {currentStatus.icon}
            {currentStatus.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-5 h-5 text-amber-600" />
            <div>
              <p className="font-medium">{format(new Date(booking.trek_date), 'MMM d, yyyy')}</p>
              <p className="text-sm text-gray-500">
                {language === 'he' ? 'תאריך טיול' : 'Trek Date'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-amber-600" />
            <div>
              <p className="font-medium">{booking.participants_count} {language === 'he' ? 'אנשים' : 'people'}</p>
              <p className="text-sm text-gray-500">
                ₪{booking.total_price?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {showUserInfo && (
          <div className="pt-4 border-t border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-2">{currentContent.contact}</h4>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{booking.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{booking.phone}</span>
              </div>
            </div>
            
            {booking.emergency_contact_name && (
              <div className="mt-3">
                <h5 className="font-medium text-gray-700 text-sm">{currentContent.emergency}:</h5>
                <p className="text-sm text-gray-600">
                  {booking.emergency_contact_name} - {booking.emergency_contact_phone}
                </p>
              </div>
            )}
          </div>
        )}

        {booking.special_requests && (
          <div className="pt-2 border-t border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-1 text-sm">
              {language === 'he' ? 'בקשות מיוחדות' : 'Special Requests'}:
            </h4>
            <p className="text-sm text-gray-600">{booking.special_requests}</p>
          </div>
        )}
      </CardContent>
      {showUserInfo && !isCancelled && (
        <CardFooter className="grid grid-cols-2 gap-2">
          {booking.status === 'pending' && (
             <Button variant="default" size="sm" onClick={() => handleApproveBooking(booking)} className="bg-green-600 hover:bg-green-700 text-white">
                <Check className="w-4 h-4 mr-2" />
                {currentContent.approveBooking}
              </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className={booking.status === 'pending' ? '' : 'col-span-2'}>
                <Ban className="w-4 h-4 mr-2" />
                {currentContent.cancelBooking}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{currentContent.cancelConfirmTitle}</AlertDialogTitle>
                <AlertDialogDescription>{currentContent.cancelConfirmDesc}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{currentContent.back}</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleCancelBooking(booking)}>{currentContent.confirm}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      )}
      {!showUserInfo && !isCancelled && isFutureBooking && (
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="w-full">
                <Ban className="w-4 h-4 mr-2" />
                {currentContent.cancelBooking}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{currentContent.cancelConfirmTitle}</AlertDialogTitle>
                <AlertDialogDescription>
                  {currentContent.cancelConfirmDesc}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{currentContent.back}</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleCancelBooking(booking)}>
                  {currentContent.confirm}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      )}
    </Card>
  )};

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{language === 'he' ? 'טוען...' : 'Loading...'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">⚠️</div>
            <p className="text-gray-900 font-semibold">{error}</p>
            <Button 
              onClick={loadData} 
              className="mt-4 bg-amber-600 hover:bg-amber-700"
            >
              {language === 'he' ? 'נסה שוב' : 'Try Again'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {currentContent.title}
          </h1>
          {isAdmin && (
            <div className="flex items-center justify-center gap-2 text-amber-700 mb-4">
              <Shield className="w-5 h-5" />
              <span className="font-medium">{currentContent.adminPanel}</span>
            </div>
          )}
        </div>

        <Tabs defaultValue="my-bookings" className="space-y-8">
          <TabsList className={`grid w-full max-w-md mx-auto ${isAdmin ? 'grid-cols-3' : 'grid-cols-1'}`}>
            <TabsTrigger value="my-bookings">{currentContent.myBookings}</TabsTrigger>
            {isAdmin && (
              <>
                <TabsTrigger value="all-bookings">{currentContent.allBookings}</TabsTrigger>
                <TabsTrigger value="manage-dates">{currentContent.manageDates}</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="my-bookings" className="space-y-6">
            {myBookings.length > 0 ? (
              <div className="grid lg:grid-cols-2 gap-6">
                {myBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {currentContent.noBookings}
                </h3>
                <p className="text-gray-600">
                  {currentContent.noBookingsDesc}
                </p>
              </div>
            )}
          </TabsContent>

          {isAdmin && (
            <TabsContent value="all-bookings" className="space-y-6">
              {/* Admin Statistics */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="border-none shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-amber-600 mb-2">
                      {allBookings.filter(b => b.status !== 'cancelled').length}
                    </div>
                    <p className="text-gray-600">{currentContent.totalBookings}</p>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      ₪{allBookings.filter(b => b.status === 'confirmed').reduce((sum, booking) => sum + (booking.total_price || 0), 0).toLocaleString()}
                    </div>
                    <p className="text-gray-600">{currentContent.totalRevenue}</p>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {allBookings.filter(b => b.status === 'confirmed').reduce((sum, booking) => sum + (booking.participants_count || 0), 0)}
                    </div>
                    <p className="text-gray-600">
                      {currentContent.totalParticipants}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {allBookings.length > 0 ? (
                <div className="grid lg:grid-cols-2 gap-6">
                  {allBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} showUserInfo={true} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {currentContent.noBookingsAdmin}
                  </h3>
                  <p className="text-gray-600">
                    {currentContent.noBookingsAdminDesc}
                  </p>
                </div>
              )}
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="manage-dates" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentContent.manageDates}
                </h2>
                <Button
                  onClick={() => setShowAddDate(!showAddDate)}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:opacity-90"
                >
                  {showAddDate ? currentContent.hideAddDate : currentContent.addNewDate}
                </Button>
              </div>

              {showAddDate && (
                <AddDateForm 
                  onDateAdded={() => {
                    setShowAddDate(false);
                    loadData(); // Refresh data after adding a date
                  }}
                  language={language}
                />
              )}
              <ManageDates trekDates={trekDates} onDeleteDate={handleDeleteDate} language={language} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
