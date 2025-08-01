"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const LoadingState = () => {
  return (
    <div className="container mx-auto px-4 py-24 mb:py-32 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

interface ErrorStateProps {
  error: string | null;
}

export const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <div className="container mx-auto px-4 py-24 mb:py-32 max-w-6xl">
      <Card className="p-8 text-center">
        <CardHeader>
          <CardTitle className="text-red-500">Hata</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{error || "Ürün bulunamadı"}</p>
          <Button onClick={() => window.history.back()}>Geri Dön</Button>
        </CardContent>
      </Card>
    </div>
  );
};