'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function CategorySelect({
  categories,
  selectedIds,
  onSelect,
}: {
  categories: { id: string; name: string }[];
  selectedIds: string[];
  onSelect: (ids: string[]) => void;
}) {
  const [search, setSearch] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const filteredCategories =
    categories &&
    categories.filter((cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase())
    );

  const handleToggle = (categoryId: string) => {
    const newSelection = selectedIds.includes(categoryId)
      ? selectedIds.filter((id) => id !== categoryId)
      : [...selectedIds, categoryId];
    onSelect(newSelection);
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onSelect([...selectedIds, newCategory.trim()]);
      setNewCategory('');
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='w-full justify-start'
        >
          {selectedIds.length > 0
            ? categories &&
              categories
                .filter((c) => selectedIds.includes(c.id))
                .map((c) => c.name)
                .join(', ')
            : 'Select categories'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-96 p-4 space-y-4'>
        <Input
          placeholder='Search categories...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className='max-h-60 overflow-y-auto space-y-2'>
          {filteredCategories &&
            filteredCategories.map((category) => (
              <label
                key={category.id}
                className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded'
              >
                <Checkbox
                  checked={selectedIds.includes(category.id)}
                  onCheckedChange={() => handleToggle(category.id)}
                />
                <span>{category.name}</span>
              </label>
            ))}
        </div>

        <div className='space-y-2'>
          <Input
            placeholder='Add new category'
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Button
            size='sm'
            onClick={handleAddCategory}
            disabled={!newCategory.trim()}
          >
            Add Custom Category
          </Button>
        </div>

        {selectedIds.length > 0 && (
          <div className='flex flex-wrap gap-2 pt-4 border-t'>
            {selectedIds.map((id) => {
              const category = categories.find((c) => c.id === id);
              return (
                <Badge
                  key={id}
                  variant='secondary'
                  className='cursor-pointer'
                  onClick={() => handleToggle(id)}
                >
                  {category?.name || id}
                </Badge>
              );
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
