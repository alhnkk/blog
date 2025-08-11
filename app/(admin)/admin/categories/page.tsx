import { getCategories } from "@/lib/actions/category";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeleteCategoryButton } from "@/components/admin/delete-category-button";
import { AddCategoryModal } from "@/components/admin/add-category-modal";
import { EditCategoryModal } from "@/components/admin/edit-category-modal";

export default async function CategoriesPage() {
  const categories = await getCategories();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="container max-w-[1600px] mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kategoriler</h1>
          <p className="text-muted-foreground">Blog kategorilerini yönetin</p>
        </div>
        <AddCategoryModal />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tüm Kategoriler</CardTitle>
          <CardDescription>
            {categories.length} kategori bulundu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Açıklama</TableHead>
                <TableHead>Yazı Sayısı</TableHead>
                <TableHead>Oluşturulma</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{category.slug}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {category.description || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{category._count.posts}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(category.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <EditCategoryModal
                        category={{
                          id: category.id,
                          name: category.name,
                          description: category.description || undefined,
                        }}
                      />
                      <DeleteCategoryButton
                        categoryId={category.id}
                        categoryName={category.name}
                        postCount={category._count.posts}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
