import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Pencil, Trash2, Search, Eye } from "lucide-react";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/store/api/productApi";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";
import {
  Button,
  Input,
  Select,
  Card,
  Table,
  Badge,
  Pagination,
  ConfirmDialog,
  Modal,
} from "@/components/ui";
import type { Product } from "@/lib/types";
import { useLocale, tf } from "@/hooks/useLocale";
import { useQueryParams } from "@/hooks/useQueryParams";
import ProductForm from "./ProductForm";

export default function ProductsPage() {
  const { t } = useTranslation();
  const locale = useLocale();
  const { params, setParams } = useQueryParams();

  const page = Number(params.page) || 1;
  const search = params.search || "";
  const category = params.category || "";

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  const {
    data: res,
    isLoading,
  } = useGetProductsQuery({
    page,
    limit: 10,
    search: search || undefined,
    category: category || undefined,
  });
  const { data: categories } = useGetCategoriesQuery();
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();

  const products = res?.data ?? [];
  const meta = res?.meta;

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteProduct(deleteId);
    setDeleteId(null);
  };

  const formatPrice = (n: number) => new Intl.NumberFormat("uz-UZ").format(n);

  const getCategoryName = (cat: Product["category"]) => {
    if (typeof cat === "object" && cat !== null && cat.name)
      return tf(cat.name, locale);
    return "-";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
          {t("products.title")}
        </h1>
        <Button
          icon={<Plus className="h-4 w-4" />}
          onClick={() => {
            setEditingProduct(null);
            setModalOpen(true);
          }}
        >
          {t("products.addProduct")}
        </Button>
      </div>

      {/* Filters */}

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder={t("products.searchProducts")}
            icon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => {
              setParams({
                search: e.target.value || undefined,
                page: undefined,
              });
            }}
          />
        </div>
        <div className="w-48">
          <Select
            placeholder={t("products.allCategories")}
            options={(categories ?? []).map((c) => ({
              value: c.id,
              label: tf(c.name, locale),
            }))}
            value={category}
            onChange={(e) => {
              setParams({
                category: e.target.value || undefined,
                page: undefined,
              });
            }}
          />
        </div>
      </div>

      {/* Table */}
      <Card padding={false}>
        <Table<Product>
          loading={isLoading}
          columns={[
            {
              key: "name",
              header: t("sidebar.products"),
              render: (p) => (
                <div className="flex items-center gap-3">
                  {p.images[0] && (
                    <img
                      src={p.images[0]}
                      alt=""
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium text-slate-900">
                      {tf(p.name, locale)}
                    </p>
                    <p className="text-xs text-slate-500">SKU: {p.sku}</p>
                  </div>
                </div>
              ),
            },
            {
              key: "category",
              header: t("common.category"),
              render: (p) => getCategoryName(p.category),
            },
            {
              key: "price",
              header: t("common.price"),
              render: (p) => (
                <div>
                  <span className="font-medium">
                    {formatPrice(p.price)} UZS
                  </span>
                  {p.discountPercent ? (
                    <span className="ml-2 text-xs text-green-600">
                      -{p.discountPercent}% (
                      {formatPrice(p.discountPrice ?? p.price)} UZS)
                    </span>
                  ) : null}
                </div>
              ),
            },
            {
              key: "stock",
              header: t("common.stock"),
              render: (p) => (
                <Badge
                  variant={
                    p.stock > 10
                      ? "success"
                      : p.stock > 0
                        ? "warning"
                        : "danger"
                  }
                >
                  {p.stock}
                </Badge>
              ),
            },
            {
              key: "isActive",
              header: t("common.status"),
              render: (p) => (
                <Badge variant={p.isActive ? "success" : "default"}>
                  {p.isActive ? t("common.active") : t("common.inactive")}
                </Badge>
              ),
            },
            {
              key: "actions",
              header: "",
              className: "w-32",
              render: (p) => (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewProduct(p)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingProduct(p);
                      setModalOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(p.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ),
            },
          ]}
          data={products}
          keyExtractor={(p) => p.id}
          emptyMessage={t("products.noProducts")}
        />
        {meta && (
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            onPageChange={(p) =>
              setParams({ page: p > 1 ? String(p) : undefined })
            }
          />
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          editingProduct ? t("products.editProduct") : t("products.addProduct")
        }
        size="xl"
      >
        <ProductForm
          product={editingProduct}
          onSuccess={() => setModalOpen(false)}
        />
      </Modal>

      {/* View Modal */}
      <Modal
        open={!!viewProduct}
        onClose={() => setViewProduct(null)}
        title={t("products.productDetails")}
        size="lg"
      >
        {viewProduct && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-500">{t("products.nameEn")}</p>
                <p className="font-medium">{viewProduct.name.en}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">{t("products.nameRu")}</p>
                <p className="font-medium">{viewProduct.name.ru}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">{t("products.nameUz")}</p>
                <p className="font-medium">{viewProduct.name.uz}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">{t("products.nameKz")}</p>
                <p className="font-medium">{viewProduct.name.kz}</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-500">{t("products.descEn")}</p>
                <p className="text-sm">{viewProduct.description.en}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">{t("products.descRu")}</p>
                <p className="text-sm">{viewProduct.description.ru}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">{t("products.descUz")}</p>
                <p className="text-sm">{viewProduct.description.uz}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">{t("products.descKz")}</p>
                <p className="text-sm">{viewProduct.description.kz}</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-slate-500">
                  {t("products.priceLabel")}:
                </span>{" "}
                {formatPrice(viewProduct.price)} UZS
              </div>
              <div>
                <span className="text-slate-500">
                  {t("products.stockLabel")}:
                </span>{" "}
                {viewProduct.stock}
              </div>
              <div>
                <span className="text-slate-500">
                  {t("products.viewsLabel")}:
                </span>{" "}
                {viewProduct.views}
              </div>
              <div>
                <span className="text-slate-500">SKU:</span> {viewProduct.sku}
              </div>
            </div>
            {viewProduct.specifications.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">
                  {t("products.specifications")}
                </p>
                <div className="space-y-1">
                  {viewProduct.specifications.map((spec, i) => (
                    <div key={i} className="flex text-sm">
                      <span className="w-40 text-slate-500">
                        {spec.key[locale]}:
                      </span>
                      <span>{spec.value[locale]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t("products.deleteProduct")}
        message={t("products.deleteConfirm")}
        loading={deleting}
      />
    </div>
  );
}
