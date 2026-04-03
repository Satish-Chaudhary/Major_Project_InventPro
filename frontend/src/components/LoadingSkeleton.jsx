import React from 'react';
import { clsx } from 'clsx';

const SkeletonBase = ({ className, ...props }) => (
  <div 
    className={clsx(
      'animate-pulse bg-slate-800/50 rounded-lg',
      className
    )} 
    {...props}
  />
);

export const TableRowSkeleton = () => (
  <tr className="border-b border-slate-800">
    <td className="px-6 py-5"><SkeletonBase className="h-4 w-4" /></td>
    <td className="px-6 py-5"><SkeletonBase className="h-10 w-10 rounded-xl" /></td>
    <td className="px-6 py-5"><SkeletonBase className="h-4 w-32" /></td>
    <td className="px-6 py-5"><SkeletonBase className="h-4 w-20" /></td>
    <td className="px-6 py-5"><SkeletonBase className="h-4 w-16" /></td>
    <td className="px-6 py-5"><SkeletonBase className="h-4 w-12" /></td>
    <td className="px-6 py-5"><SkeletonBase className="h-6 w-20 rounded-full" /></td>
    <td className="px-6 py-5"><SkeletonBase className="h-8 w-24 rounded" /></td>
  </tr>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-800/40 border-b border-slate-800 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
            <th className="px-6 py-4 w-12"><SkeletonBase className="h-4 w-4" /></th>
            <th className="px-6 py-4">Product</th>
            <th className="px-6 py-4">SKU</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Quantity</th>
            <th className="px-6 py-4">Price</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const CardSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
        <SkeletonBase className="h-4 w-24 mb-3" />
        <SkeletonBase className="h-8 w-32" />
      </div>
    ))}
  </div>
);

export const FormSkeleton = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <SkeletonBase className="h-4 w-16" />
      <SkeletonBase className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <SkeletonBase className="h-4 w-20" />
      <SkeletonBase className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <SkeletonBase className="h-4 w-12" />
      <SkeletonBase className="h-24 w-full" />
    </div>
    <SkeletonBase className="h-10 w-32" />
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
    <SkeletonBase className="h-4 w-32 mb-4" />
    <SkeletonBase className="h-64 w-full" />
  </div>
);

export const StatCardSkeleton = () => (
  <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-3">
    <SkeletonBase className="h-3 w-20" />
    <SkeletonBase className="h-8 w-24" />
    <SkeletonBase className="h-3 w-16" />
  </div>
);

export const SidebarSkeleton = () => (
  <div className="w-64 bg-[#0a0a0a] border-r border-slate-800 min-h-screen p-4 flex flex-col">
    <div className="space-y-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <SkeletonBase className="h-5 w-5 rounded" />
          <SkeletonBase className="h-4 w-32" />
        </div>
      ))}
    </div>
  </div>
);

export const PageSkeleton = () => (
  <div className="p-6 space-y-6">
    <div className="flex items-center justify-between">
      <SkeletonBase className="h-8 w-48" />
      <SkeletonBase className="h-10 w-32 rounded-lg" />
    </div>
    <CardSkeleton count={4} />
    <TableSkeleton rows={5} />
  </div>
);

export const DetailPageSkeleton = () => (
  <div className="p-6 space-y-6">
    <div className="flex items-center gap-4">
      <SkeletonBase className="h-10 w-24" />
      <SkeletonBase className="h-8 w-48" />
    </div>
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
      <SkeletonBase className="h-6 w-32 mb-4" />
      <FormSkeleton />
    </div>
  </div>
);

export default {
  TableSkeleton,
  CardSkeleton,
  FormSkeleton,
  ChartSkeleton,
  StatCardSkeleton,
  SidebarSkeleton,
  PageSkeleton,
  DetailPageSkeleton
};