import { getTags } from "@/lib/actions/tag";
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
import { DeleteTagButton } from "@/components/admin/delete-tag-button";
import { AddTagModal } from "@/components/admin/add-tag-modal";
import { EditTagModal } from "@/components/admin/edit-tag-modal";

export default async function TagsPage() {
  const tags = await getTags();

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
          <h1 className="text-3xl font-bold">Etiketler</h1>
          <p className="text-muted-foreground">Blog etiketlerini yönetin</p>
        </div>
        <AddTagModal />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tüm Etiketler</CardTitle>
          <CardDescription>{tags.length} etiket bulundu</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Yazı Sayısı</TableHead>
                <TableHead>Oluşturulma</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell className="font-medium">{tag.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{tag.slug}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{tag._count.posts}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(tag.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <EditTagModal tag={tag} />
                      <DeleteTagButton
                        tagId={tag.id}
                        tagName={tag.name}
                        postCount={tag._count.posts}
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
