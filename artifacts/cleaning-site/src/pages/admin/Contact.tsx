import React from 'react';
import { useListContacts, useDeleteContact, getListContactsQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, Phone, Mail } from 'lucide-react';

export default function ContactManager() {
  const queryClient = useQueryClient();
  const { data: contacts, isLoading } = useListContacts({ query: { queryKey: getListContactsQueryKey() } });
  const deleteContact = useDeleteContact();

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      deleteContact.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListContactsQueryKey() });
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Contact Submissions</h1>
        <p className="text-gray-500 mt-2">View leads and inquiries from your website.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer Details</TableHead>
                <TableHead>Service Required</TableHead>
                <TableHead className="w-1/3">Message</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">Loading submissions...</TableCell>
                </TableRow>
              ) : contacts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">No submissions yet.</TableCell>
                </TableRow>
              ) : (
                contacts?.map(contact => (
                  <TableRow key={contact.id}>
                    <TableCell className="whitespace-nowrap text-sm text-gray-500">
                      {new Date(contact.createdAt).toLocaleDateString()}<br/>
                      {new Date(contact.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-gray-900">{contact.fullName}</div>
                      <div className="flex flex-col mt-1 gap-1 text-sm text-gray-600">
                        <a href={`tel:${contact.phone}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                          <Phone className="w-3 h-3" /> {contact.phone}
                        </a>
                        <a href={`mailto:${contact.email}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                          <Mail className="w-3 h-3" /> {contact.email}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      {contact.serviceRequired ? (
                        <Badge variant="secondary">{contact.serviceRequired}</Badge>
                      ) : (
                        <span className="text-gray-400 text-sm">Not specified</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{contact.message || <span className="italic text-gray-400">No message</span>}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" variant="destructive" onClick={() => handleDelete(contact.id)} title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
