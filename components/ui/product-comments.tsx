"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, User, Send } from "lucide-react";
import { Comment } from "@/lib/types";

interface CommentsProps {
  comments: Comment[];
  isAuthenticated: boolean;
  onAddComment: (comment: string) => Promise<void>;
  isAddingComment: boolean;
}

const Comments = ({ comments, isAuthenticated, onAddComment, isAddingComment }: CommentsProps) => {
  const [newComment, setNewComment] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    await onAddComment(newComment.trim());
    setNewComment("");
    setShowCommentInput(false);
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Kullanıcı Yorumları</h3>
        {isAuthenticated && !showCommentInput && (
          <Button
            variant="outline"
            onClick={() => setShowCommentInput(true)}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Yorum Ekle
          </Button>
        )}
      </div>

      {/* Comment Input Section */}
      {showCommentInput && isAuthenticated && (
        <div className="mb-8">
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg">Yorum Ekle</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-4">
                <Textarea
                  placeholder="Ürün hakkındaki düşüncelerinizi paylaşın..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                  maxLength={500}
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {newComment.length}/500 karakter
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCommentInput(false);
                        setNewComment("");
                      }}
                    >
                      İptal
                    </Button>
                    <Button
                      onClick={handleSubmitComment}
                      disabled={isAddingComment || !newComment.trim()}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {isAddingComment ? "Gönderiliyor..." : "Gönder"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  {comment.user_avatar ? (
                    <Image
                      src={comment.user_avatar}
                      alt={comment.username}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{comment.username}</span>
                    <span className="text-sm text-gray-500">{comment.time_ago}</span>
                  </div>
                  <p className="text-gray-700">{comment.comment}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <CardContent>
            <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">Daha önce yorum yapılmamış. İlk yorumunuzu paylaşın!</p>
            {isAuthenticated && !showCommentInput && (
              <Button onClick={() => setShowCommentInput(true)}>
                Yorum Yaz
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Comments;