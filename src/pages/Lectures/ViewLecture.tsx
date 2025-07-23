import { Lectures } from '@/types/Lectures';
import { EyeIcon } from '@heroicons/react/20/solid';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { VideoPlayer } from './VideoPlayer/VideoPlayer';

const ViewLecture = ({
  VideoId,
  Lecture,
}: {
  VideoId: string;
  Lecture: Lectures;
}) => {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch video token when VideoId changes
  useEffect(() => {
    const fetchVideoToken = async () => {
      try {
        // Since we're using static data, use a placeholder video source
        // For demo purposes, you can replace this with actual video URLs
        const demoVideoSrc = `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`;
        setSrc(demoVideoSrc);
      } catch (e) {
        toast({
          title: 'Error loading video',
          variant: 'destructive',
        });
      }
    };
    fetchVideoToken();
  }, [VideoId]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="inline-flex text-lg items-center justify-center gap-2.5 rounded-full bg-meta-3 py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-4 xl:px-6">
            <EyeIcon className="h-4 w-4" />
            View
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle className="opacity-60">View Lecture</DialogTitle>
          {Lecture.name && (
            <h1 className="text-xl text-meta-2 font-semibold">
              {Lecture.name}
            </h1>
          )}
          {src && (
            <VideoPlayer
              hlsSrc={src}
              posterSrc={`${import.meta.env.VITE_BACKEND_STORAGE_URL}/${
                Lecture.image_path
              }`}
            />
          )}
          <DialogFooter>Dialog Footer</DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewLecture;
