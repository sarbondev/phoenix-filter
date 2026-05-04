'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Eye, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Locale } from '@/shared/types';
import type { Dictionary } from '@/shared/i18n/dictionaries/en';
import { useGetBlogsQuery } from '@/store/api/blogApi';
import { t, getImageUrl } from '@/shared/lib/utils';
import { Skeleton, Button } from '@/shared/ui';
import { useQueryParams } from '@/shared/hooks';
import { Editable } from '@/features/inline-editor';
import { BlogsBlockEditor } from '@/features/inline-editor/blocks/BlogsBlockEditor';
import { useEditorDict } from '@/features/inline-editor/useEditorDict';

interface Props { locale: Locale; dict: Dictionary }

export function BlogPageClient({ locale, dict }: Props) {
  const { params, setParams } = useQueryParams();
  const page = Number(params.page) || 1;
  const { data, isLoading } = useGetBlogsQuery({ page, limit: 12 });
  const ed = useEditorDict();

  const blogs = data?.data ?? [];
  const meta = data?.meta;

  return (
    <Editable
      id="blogs"
      label={ed.blogsLabel}
      block={() => ({
        title: ed.blogsTitle,
        description: ed.blogsDesc,
        render: (close) => <BlogsBlockEditor close={close} />,
      })}
    >
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">{dict.blog.title}</h1>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
        </div>
      ) : blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="rounded-3xl bg-slate-100 p-6 mb-6">
            <FileText className="h-12 w-12 text-slate-300" />
          </div>
          <p className="text-lg font-medium text-slate-500">{dict.blog.empty}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, i) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/${locale}/blog/${blog.slug}`}
                  className="group block overflow-hidden rounded-2xl bg-white border border-slate-200 transition-all duration-300 hover:shadow-xl hover:border-primary/30"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                    {blog.image ? (
                      <Image
                        src={getImageUrl(blog.image)}
                        alt={t(blog.title, locale)}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <FileText className="h-12 w-12 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {blog.views} {dict.blog.views}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 line-clamp-2 group-hover:text-primary transition-colors">
                      {t(blog.title, locale)}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                      {t(blog.excerpt, locale)}
                    </p>
                    <p className="mt-3 text-sm font-medium text-primary">
                      {dict.blog.readMore} &rarr;
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3">
              <Button variant="outline" disabled={page <= 1} onClick={() => setParams({ page: page - 1 <= 1 ? undefined : String(page - 1) })}><ChevronLeft className="h-4 w-4" /></Button>
              <span className="text-sm text-slate-500">{page} / {meta.totalPages}</span>
              <Button variant="outline" disabled={page >= meta.totalPages} onClick={() => setParams({ page: String(page + 1) })}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          )}
        </>
      )}
    </div>
    </Editable>
  );
}
