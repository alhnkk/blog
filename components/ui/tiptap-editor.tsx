"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import "./tiptap-editor.css";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import CodeBlock from "@tiptap/extension-code-block";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./button";
import { Separator } from "./separator";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Table as TableIcon,
  Maximize,
  Minimize,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Input } from "./input";
import { toast } from "sonner";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = "İçeriğinizi buraya yazın...",
  className,
  editable = true,
}: TiptapEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
  const [isImagePopoverOpen, setIsImagePopoverOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-primary underline underline-offset-2 hover:text-primary/80",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Color,
      TextStyle,
      Highlight.configure({
        multicolor: true,
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: "rounded-md bg-muted p-4 font-mono text-sm overflow-x-auto",
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4",
          "prose-headings:font-bold prose-headings:text-foreground",
          "prose-p:text-foreground prose-p:leading-relaxed",
          "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
          "prose-strong:text-foreground prose-strong:font-semibold",
          "prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded",
          "prose-pre:bg-muted prose-pre:text-foreground",
          "prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground",
          "prose-ul:text-foreground prose-ol:text-foreground",
          "prose-li:text-foreground",
          "prose-table:text-foreground",
          "prose-th:text-foreground prose-td:text-foreground",
          className
        ),
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isFullscreen]);

  const addLink = useCallback(() => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setIsLinkPopoverOpen(false);
    }
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setIsImagePopoverOpen(false);
    }
  }, [editor, imageUrl]);

  const addTable = useCallback(() => {
    if (editor) {
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn(
        "border rounded-lg overflow-hidden transition-all duration-200",
        isFullscreen &&
          "fixed inset-0 z-50 border-none rounded-none bg-background flex flex-col h-full"
      )}
    >
      {/* Toolbar */}
      <div
        className={cn(
          "border-b bg-muted/30 p-2",
          isFullscreen && "flex-shrink-0"
        )}
      >
        <div className="flex flex-wrap items-center gap-1">
          {/* Text Formatting */}
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive("bold") && "bg-muted"
              )}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive("italic") && "bg-muted"
              )}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive("underline") && "bg-muted"
              )}
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive("strike") && "bg-muted"
              )}
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive("code") && "bg-muted"
              )}
            >
              <Code className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Headings */}
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive("heading", { level: 1 }) && "bg-muted"
              )}
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive("heading", { level: 2 }) && "bg-muted"
              )}
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive("heading", { level: 3 }) && "bg-muted"
              )}
            >
              <Heading3 className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Lists */}
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive("bulletList") && "bg-muted"
              )}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive("orderedList") && "bg-muted"
              )}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive("blockquote") && "bg-muted"
              )}
            >
              <Quote className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive("codeBlock") && "bg-muted"
              )}
            >
              <Code className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Alignment */}
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive({ textAlign: "left" }) && "bg-muted"
              )}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive({ textAlign: "center" }) && "bg-muted"
              )}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive({ textAlign: "right" }) && "bg-muted"
              )}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive({ textAlign: "justify" }) && "bg-muted"
              )}
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Media & Links */}
          <div className="flex items-center gap-1">
            <Popover
              open={isLinkPopoverOpen}
              onOpenChange={setIsLinkPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0",
                    editor.isActive("link") && "bg-muted"
                  )}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-3">
                  <h4 className="font-medium">Link Ekle</h4>
                  <Input
                    placeholder="https://example.com"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addLink();
                      }
                    }}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsLinkPopoverOpen(false)}
                    >
                      İptal
                    </Button>
                    <Button type="button" size="sm" onClick={addLink}>
                      Ekle
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover
              open={isImagePopoverOpen}
              onOpenChange={setIsImagePopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96">
                <div className="space-y-4">
                  <h4 className="font-medium">Resim Ekle</h4>

                  {/* URL Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Resim URL&apos;si:
                    </label>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addImage();
                        }
                      }}
                    />
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Veya dosya yükle:
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        try {
                          // Get auth params
                          const response = await fetch("/api/upload-auth");
                          const authData = await response.json();

                          // Import ImageKit utilities
                          const { getImageKitConfig } = await import(
                            "@/lib/imagekit-config"
                          );
                          const { uploadToImageKit } = await import(
                            "@/lib/imagekit-upload"
                          );

                          const config = getImageKitConfig();
                          const authParams = { ...authData, ...config };

                          // Upload file
                          const uploadResponse = (await uploadToImageKit(
                            file,
                            authParams,
                            {
                              folder: "/blog-content",
                              fileName: file.name,
                              useUniqueFileName: true,
                            }
                          )) as { url: string; fileId: string };

                          // Add image to editor
                          if (editor) {
                            editor
                              .chain()
                              .focus()
                              .setImage({ src: uploadResponse.url })
                              .run();
                            setIsImagePopoverOpen(false);
                            toast.success("Resim başarıyla eklendi!");
                          }
                        } catch (error) {
                          console.error("Image upload error:", error);
                          toast.error("Resim yüklenirken hata oluştu");
                        }
                      }}
                      className="w-full text-sm"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsImagePopoverOpen(false)}
                    >
                      İptal
                    </Button>
                    <Button type="button" size="sm" onClick={addImage}>
                      URL Ekle
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addTable}
              className="h-8 w-8 p-0"
            >
              <TableIcon className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Highlight */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive("highlight") && "bg-muted"
            )}
          >
            <Highlighter className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="h-8 w-8 p-0"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="h-8 w-8 p-0"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1" />

          {/* Fullscreen Toggle */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-8 w-8 p-0"
            title={isFullscreen ? "Tam ekrandan çık" : "Tam ekran"}
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div
        className={cn(
          "min-h-[300px]",
          isFullscreen && "flex-1 overflow-hidden"
        )}
      >
        <EditorContent
          editor={editor}
          className={cn(
            isFullscreen &&
              "h-full [&_.ProseMirror]:h-full [&_.ProseMirror]:overflow-y-auto [&_.ProseMirror]:p-8"
          )}
        />
      </div>
    </div>
  );
}
