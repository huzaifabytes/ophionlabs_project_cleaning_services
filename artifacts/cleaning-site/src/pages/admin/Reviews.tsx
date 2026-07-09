import React from 'react';
import { useListReviews, useUpdateReview, useDeleteReview, getListReviewsQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/StarRating';
import { Check, X, EyeOff, Eye, Pin, Trash2 } from 'lucide-react';

export default function ReviewsManager() {
  const queryClient = useQueryClient();
  const { data: reviews, isLoading } = useListReviews({ all: "1" }, { query: { queryKey: getListReviewsQueryKey() } });
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const handleUpdate = (id: number, data: any) => {
    updateReview.mutate({ id, data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey() });
      }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this review?')) {
      deleteReview.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey() });
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Reviews</h1>
        <p className="text-gray-500 mt-2">Manage customer testimonials.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="w-1/3">Comment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attributes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">Loading reviews...</TableCell>
                </TableRow>
              ) : reviews?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">No reviews yet.</TableCell>
                </TableRow>
              ) : (
                reviews?.map(review => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium">
                      {review.customerName}
                      <div className="text-xs text-gray-400 font-normal mt-1">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StarRating value={review.rating} readOnly size="sm" />
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600 line-clamp-3" title={review.comment}>
                        {review.comment}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        review.status === 'approved' ? 'success' :
                        review.status === 'rejected' ? 'destructive' :
                        'warning'
                      }>
                        {review.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {review.pinned && <Badge variant="secondary" className="bg-blue-100 text-blue-700">Pinned</Badge>}
                        {review.hidden && <Badge variant="secondary" className="bg-gray-100 text-gray-700">Hidden</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {review.status === 'pending' && (
                          <>
                            <Button size="icon" variant="outline" className="text-green-600 hover:text-green-700" onClick={() => handleUpdate(review.id, { status: 'approved' })} title="Approve">
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleUpdate(review.id, { status: 'rejected' })} title="Reject">
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button 
                          size="icon" 
                          variant="outline" 
                          onClick={() => handleUpdate(review.id, { pinned: !review.pinned })}
                          className={review.pinned ? "bg-blue-50 text-blue-600" : ""}
                          title={review.pinned ? "Unpin" : "Pin to top"}
                        >
                          <Pin className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="outline" 
                          onClick={() => handleUpdate(review.id, { hidden: !review.hidden })}
                          className={review.hidden ? "bg-gray-100" : ""}
                          title={review.hidden ? "Unhide" : "Hide"}
                        >
                          {review.hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </Button>
                        <Button size="icon" variant="destructive" onClick={() => handleDelete(review.id)} title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
