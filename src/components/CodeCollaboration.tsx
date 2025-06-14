
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Share2, Download, Upload, Users, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeCollaborationProps {
  currentCode: string;
  onImportCode: (code: string) => void;
}

const CodeCollaboration: React.FC<CodeCollaborationProps> = ({
  currentCode,
  onImportCode
}) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [shareCode, setShareCode] = useState('');
  const [importCode, setImportCode] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateShareCode = useCallback(() => {
    // Generate a simple share code (in real app, this would be server-side)
    const compressed = btoa(encodeURIComponent(currentCode));
    const shareId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setShareCode(`HERLANG-${shareId}-${compressed.substring(0, 20)}`);
  }, [currentCode]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareCode);
      setCopied(true);
      toast({
        title: "已复制到剪贴板! 📋",
        description: "分享代码已复制，快去分享给朋友吧！"
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "复制失败 😿",
        description: "请手动复制分享代码",
        variant: "destructive"
      });
    }
  }, [shareCode, toast]);

  const exportCode = useCallback(() => {
    const blob = new Blob([currentCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `herlang-code-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "代码导出成功! 📁",
      description: "文件已下载到您的设备"
    });
  }, [currentCode, toast]);

  const importFromCode = useCallback(() => {
    if (!importCode.trim()) {
      toast({
        title: "请输入分享代码 🤔",
        description: "分享代码不能为空哦",
        variant: "destructive"
      });
      return;
    }

    try {
      // Try to decode the share code
      if (importCode.startsWith('HERLANG-')) {
        const parts = importCode.split('-');
        if (parts.length >= 3) {
          const compressed = parts.slice(2).join('-');
          const decoded = decodeURIComponent(atob(compressed));
          onImportCode(decoded);
          setImportDialogOpen(false);
          setImportCode('');
          toast({
            title: "代码导入成功! 🎉",
            description: "代码已成功导入到编辑器"
          });
          return;
        }
      }
      
      // If not a share code, treat as direct code
      onImportCode(importCode);
      setImportDialogOpen(false);
      setImportCode('');
      toast({
        title: "代码导入成功! 🎉",
        description: "代码已成功导入到编辑器"
      });
    } catch (error) {
      toast({
        title: "导入失败 😿",
        description: "分享代码格式不正确或已损坏",
        variant: "destructive"
      });
    }
  }, [importCode, onImportCode, toast]);

  const importFromFile = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        onImportCode(content);
        toast({
          title: "文件导入成功! 📂",
          description: `已导入文件: ${file.name}`
        });
      }
    };
    reader.readAsText(file);
  }, [onImportCode, toast]);

  return (
    <div className="flex items-center gap-2">
      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-purple-500/20 border-purple-400/30 text-purple-300 hover:bg-purple-500/30"
            onClick={generateShareCode}
          >
            <Share2 className="w-4 h-4 mr-2" />
            分享
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              分享你的代码
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm">分享代码:</label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={shareCode}
                  readOnly
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="点击生成分享代码..."
                />
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              💡 朋友们可以使用这个代码来导入你的作品！
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-blue-500/20 border-blue-400/30 text-blue-300 hover:bg-blue-500/30"
          >
            <Upload className="w-4 h-4 mr-2" />
            导入
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-400" />
              导入代码
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm">分享代码或直接粘贴代码:</label>
              <textarea
                value={importCode}
                onChange={(e) => setImportCode(e.target.value)}
                className="w-full h-32 mt-1 bg-gray-800 border border-gray-600 rounded text-white p-3 resize-none"
                placeholder="在这里粘贴分享代码或直接粘贴Herlang代码..."
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={importFromCode}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                导入代码
              </Button>
              <label className="flex-1">
                <input
                  type="file"
                  accept=".txt,.js,.ts"
                  onChange={importFromFile}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  选择文件
                </Button>
              </label>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Button */}
      <Button
        onClick={exportCode}
        variant="outline"
        size="sm"
        className="bg-green-500/20 border-green-400/30 text-green-300 hover:bg-green-500/30"
      >
        <Download className="w-4 h-4 mr-2" />
        导出
      </Button>
    </div>
  );
};

export default CodeCollaboration;
