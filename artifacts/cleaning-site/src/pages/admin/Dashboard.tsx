import React from 'react';
import { 
  useListServices, 
  useListReviews, 
  useListContacts, 
  useListTeamMembers,
  getListServicesQueryKey,
  getListReviewsQueryKey,
  getListContactsQueryKey,
  getListTeamMembersQueryKey
} from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Star, MessageSquare, Users, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  
  const { data: services } = useListServices({ query: { queryKey: getListServicesQueryKey() } });
  const { data: reviews } = useListReviews({ all: "1" }, { query: { queryKey: getListReviewsQueryKey() } });
  const { data: contacts } = useListContacts({ query: { queryKey: getListContactsQueryKey() } });
  const { data: team } = useListTeamMembers({ query: { queryKey: getListTeamMembersQueryKey() } });

  const stats = [
    {
      title: "Active Services",
      value: services?.length || 0,
      icon: Sparkles,
      color: "text-blue-500",
      bg: "bg-blue-50",
      link: "/admin/services"
    },
    {
      title: "Total Reviews",
      value: reviews?.length || 0,
      icon: Star,
      color: "text-yellow-500",
      bg: "bg-yellow-50",
      link: "/admin/reviews"
    },
    {
      title: "Contact Submissions",
      value: contacts?.length || 0,
      icon: MessageSquare,
      color: "text-green-500",
      bg: "bg-green-50",
      link: "/admin/contact"
    },
    {
      title: "Team Members",
      value: team?.length || 0,
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-50",
      link: "/admin/team"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 mt-2">Welcome back to your CleanPro control panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={i} 
              className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 group"
              onClick={() => setLocation(stat.link)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <h3 className="text-3xl font-bold mt-1 text-gray-900">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Contact Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contacts?.slice(0, 5).map(contact => (
                <div key={contact.id} className="flex flex-col border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{contact.fullName}</p>
                      <p className="text-sm text-gray-500">{contact.serviceRequired || 'General Inquiry'}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              {(!contacts || contacts.length === 0) && (
                <p className="text-gray-500 py-4 text-center">No submissions yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviews?.slice(0, 5).map(review => (
                <div key={review.id} className="flex flex-col border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{review.customerName}</p>
                      <div className="flex items-center gap-1 mt-1 text-yellow-400">
                        {Array(review.rating).fill(0).map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      review.status === 'approved' ? 'bg-green-100 text-green-700' :
                      review.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {review.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{review.comment}</p>
                </div>
              ))}
              {(!reviews || reviews.length === 0) && (
                <p className="text-gray-500 py-4 text-center">No reviews yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
