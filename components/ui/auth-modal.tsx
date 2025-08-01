"use client";

import { X, Lock, Heart, MessageCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'cart' | 'like' | 'comment' | 'rate';
  onLogin?: () => void;
}

const AuthModal = ({ isOpen, onClose, action, onLogin }: AuthModalProps) => {
  if (!isOpen) return null;

  const actionMessages = {
    cart: {
      title: "Sepete Ekle",
      description: "Ürünleri sepete eklemek ve satın almak için",
      icon: <ShoppingCart className="w-8 h-8 text-blue-500" />
    },
    like: {
      title: "Beğen",
      description: "Ürünleri beğenmek ve favorilere eklemek için",
      icon: <Heart className="w-8 h-8 text-red-500" />
    },
    comment: {
      title: "Yorum Yap",
      description: "Ürünler hakkında yorum yapmak için",
      icon: <MessageCircle className="w-8 h-8 text-green-500" />
    },
    rate: {
      title: "Değerlendir",
      description: "Ürünleri puanlamak için",
      icon: <Lock className="w-8 h-8 text-purple-500" />
    }
  };

  const currentAction = actionMessages[action];

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      window.location.href = '/auth';
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-full">
              {currentAction.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold">Giriş Yapın</h2>
              <p className="text-blue-100 text-sm">{currentAction.title} için hesabınıza giriş yapın</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Hesabınıza giriş yapın
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {currentAction.description} hesabınıza giriş yapmanız gerekiyor. 
              Hemen giriş yapın veya yeni hesap oluşturun!
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-3 text-sm">Üyelik avantajları:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                Ürünleri sepete ekleyin ve satın alın
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                Favorilerinizi kaydedin ve beğenin
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                Yorum yapın ve puanlayın
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                Sipariş geçmişinizi takip edin
              </li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Giriş Yap / Üye Ol
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full py-3 rounded-xl font-medium border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Daha Sonra
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;