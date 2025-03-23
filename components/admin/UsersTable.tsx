// src/components/admin/UsersTable.tsx
'use client';
import { ColumnDef, Row } from '@tanstack/react-table';
import { User } from '@prisma/client';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { updateUserRole } from '@/app/actions/admin';

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }: { row: Row<User> }) => (
      <Badge variant={row.original.role === 'ADMIN' ? 'default' : 'secondary'}>
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined',
    cell: ({ row }: { row: Row<User> }) =>
      new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: 'actions',
    cell: ({ row }: { row: Row<User> }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='h-8 w-8 p-0'
          >
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.original.email)}
          >
            Copy Email
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => updateUserRole(row.original.id, 'ADMIN')}
            disabled={row.original.role === 'ADMIN'}
          >
            Make Admin
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => updateUserRole(row.original.id, 'USER')}
            disabled={row.original.role === 'USER'}
          >
            Remove Admin
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export function UsersTable({ users }: { users: User[] }) {
  return (
    <DataTable
      columns={columns}
      data={users}
    />
  );
}
